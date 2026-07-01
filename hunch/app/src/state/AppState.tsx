import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Screen, HomeVariant, Step, SysTab, SupportMap, SupportNote, Ring, StarRating, LoopGraph, Polarity } from '../types';
import { defaultSupportMaps, defaultLoopGraphs } from '../data/systemsSeed';

const STORAGE_KEY = 'fb_app_state_v1';

export interface PersistedState {
  screen: Screen;
  home: HomeVariant;
  step: Step;
  q1: 'yes' | 'no' | null;
  q2: 'component' | 'whole' | null;
  q3: 'say' | 'do' | null;
  saydo: number;
  fidelity: number;
  sysTab: SysTab;
  sysArch: string | null;
  supportMaps: Record<string, SupportMap>;
  loopGraphs: Record<string, LoopGraph>;
}

const defaultState: PersistedState = {
  screen: 'dashboard',
  home: 'a',
  step: 1,
  q1: null,
  q2: null,
  q3: null,
  saydo: 64,
  fidelity: 42,
  sysTab: 'support',
  sysArch: null,
  supportMaps: defaultSupportMaps,
  loopGraphs: defaultLoopGraphs,
};

function loadInitial(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    /* ignore malformed storage */
  }
  return defaultState;
}

const starCycle: StarRating[] = ['helpful', 'neutral', 'unhelpful'];

// Default spawn position for a newly-added note: spread notes around each
// ring's band so repeated adds don't stack exactly on top of each other.
const ringRadius: Record<Exclude<Ring, 'role'>, number> = { responsibility: 27, need: 33, resource: 42, wish: 47 };
const ringBaseAngle: Record<Exclude<Ring, 'role'>, number> = { responsibility: 200, need: 20, resource: 300, wish: 100 };

function nextRingPosition(ring: Exclude<Ring, 'role'>, existingCount: number) {
  const radius = ringRadius[ring];
  const angle = ((ringBaseAngle[ring] + existingCount * 55) % 360) * (Math.PI / 180);
  const x = Math.min(96, Math.max(4, 50 + radius * Math.cos(angle)));
  const y = Math.min(96, Math.max(4, 50 + radius * Math.sin(angle)));
  return { x, y };
}

const ringDefaultLabel: Record<Exclude<Ring, 'role'>, string> = {
  responsibility: 'New responsibility',
  need: 'New need',
  resource: 'New resource',
  wish: 'New wish',
};

interface AppStateValue extends PersistedState {
  go: (screen: Screen) => void;
  setHome: (home: HomeVariant) => void;
  setStep: (step: Step) => void;
  setQ1: (v: 'yes' | 'no') => void;
  setQ2: (v: 'component' | 'whole') => void;
  setQ3: (v: 'say' | 'do') => void;
  setSaydo: (v: number) => void;
  setFidelity: (v: number) => void;
  setSysTab: (t: SysTab) => void;
  setSysArch: (id: string | null) => void;
  addSupportNote: (mapId: string, ring: Exclude<Ring, 'role'>) => string;
  renameSupportNote: (mapId: string, noteId: string, text: string) => void;
  moveSupportNote: (mapId: string, noteId: string, x: number, y: number) => void;
  deleteSupportNote: (mapId: string, noteId: string) => void;
  cycleSupportNoteStar: (mapId: string, noteId: string) => void;
  addLoopNode: (graphId: string) => string;
  renameLoopNode: (graphId: string, nodeId: string, label: string) => void;
  moveLoopNode: (graphId: string, nodeId: string, x: number, y: number) => void;
  deleteLoopNode: (graphId: string, nodeId: string) => void;
  addLoopLink: (graphId: string, from: string, to: string, polarity: Polarity) => string;
  deleteLoopLink: (graphId: string, linkId: string) => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state]);

  const patch = (p: Partial<PersistedState>) => setState(s => ({ ...s, ...p }));

  const updateMap = (mapId: string, fn: (m: SupportMap) => SupportMap) => {
    setState(s => {
      const current = s.supportMaps[mapId];
      if (!current) return s;
      return { ...s, supportMaps: { ...s.supportMaps, [mapId]: fn(current) } };
    });
  };

  const updateNote = (mapId: string, noteId: string, fn: (n: SupportNote) => SupportNote) => {
    updateMap(mapId, m => ({ ...m, notes: m.notes.map(n => (n.id === noteId ? fn(n) : n)) }));
  };

  const updateGraph = (graphId: string, fn: (g: LoopGraph) => LoopGraph) => {
    setState(s => {
      const current = s.loopGraphs[graphId];
      if (!current) return s;
      return { ...s, loopGraphs: { ...s.loopGraphs, [graphId]: fn(current) } };
    });
  };

  const value: AppStateValue = {
    ...state,
    go: (screen) => patch({ screen }),
    setHome: (home) => patch({ home }),
    setStep: (step) => patch({ step }),
    setQ1: (q1) => patch({ q1 }),
    setQ2: (q2) => patch({ q2 }),
    setQ3: (q3) => patch({ q3 }),
    setSaydo: (saydo) => patch({ saydo }),
    setFidelity: (fidelity) => patch({ fidelity }),
    setSysTab: (sysTab) => patch({ sysTab, sysArch: null }),
    setSysArch: (sysArch) => patch({ sysArch }),
    addSupportNote: (mapId, ring) => {
      const existingCount = state.supportMaps[mapId]?.notes.filter(n => n.ring === ring).length ?? 0;
      const { x, y } = nextRingPosition(ring, existingCount);
      const id = `${ring}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const note: SupportNote = { id, ring, text: ringDefaultLabel[ring], x, y, ...(ring === 'resource' ? { star: 'neutral' as StarRating } : {}) };
      updateMap(mapId, m => ({ ...m, notes: [...m.notes, note] }));
      return id;
    },
    renameSupportNote: (mapId, noteId, text) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      updateNote(mapId, noteId, n => ({ ...n, text: trimmed }));
    },
    moveSupportNote: (mapId, noteId, x, y) => {
      updateNote(mapId, noteId, n => ({ ...n, x, y }));
    },
    deleteSupportNote: (mapId, noteId) => {
      updateMap(mapId, m => ({ ...m, notes: m.notes.filter(n => n.id !== noteId) }));
    },
    cycleSupportNoteStar: (mapId, noteId) => {
      updateNote(mapId, noteId, n => {
        const idx = n.star ? starCycle.indexOf(n.star) : -1;
        const next = starCycle[(idx + 1) % starCycle.length];
        return { ...n, star: next };
      });
    },
    addLoopNode: (graphId) => {
      const count = state.loopGraphs[graphId]?.nodes.length ?? 0;
      const id = `n-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const angle = (count * 47) % 360;
      const x = 300 + 140 * Math.cos((angle * Math.PI) / 180);
      const y = 190 + 120 * Math.sin((angle * Math.PI) / 180);
      updateGraph(graphId, g => ({ ...g, nodes: [...g.nodes, { id, label: 'New element', x, y }] }));
      return id;
    },
    renameLoopNode: (graphId, nodeId, label) => {
      const trimmed = label.trim();
      if (!trimmed) return;
      updateGraph(graphId, g => ({ ...g, nodes: g.nodes.map(n => (n.id === nodeId ? { ...n, label: trimmed } : n)) }));
    },
    moveLoopNode: (graphId, nodeId, x, y) => {
      updateGraph(graphId, g => ({ ...g, nodes: g.nodes.map(n => (n.id === nodeId ? { ...n, x, y } : n)) }));
    },
    deleteLoopNode: (graphId, nodeId) => {
      updateGraph(graphId, g => ({
        nodes: g.nodes.filter(n => n.id !== nodeId),
        links: g.links.filter(l => l.from !== nodeId && l.to !== nodeId),
      }));
    },
    addLoopLink: (graphId, from, to, polarity) => {
      const id = `l-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      updateGraph(graphId, g => ({ ...g, links: [...g.links, { id, from, to, polarity }] }));
      return id;
    },
    deleteLoopLink: (graphId, linkId) => {
      updateGraph(graphId, g => ({ ...g, links: g.links.filter(l => l.id !== linkId) }));
    },
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}

export function recommendation(q1: PersistedState['q1'], q2: PersistedState['q2'], q3: PersistedState['q3']) {
  if (q1 === 'yes') {
    return { name: 'Thought test', note: 'Existing data can address this assumption — analyze before going to the field.', icon: 'Brain' as const };
  }
  if (q3 === 'say') {
    return q2 === 'component'
      ? { name: 'Cognitive walkthrough', note: 'Say data, early stage — walk a prototype through with prospective users.', icon: 'ChatsCircle' as const }
      : { name: 'Lemonade stand', note: 'Say→Do transition — a pop-up that lets users come to you.', icon: 'Storefront' as const };
  }
  if (q3 === 'do') {
    if (q2 === 'component') {
      return { name: 'Smoke test', note: 'Arms-length Do data on a specific value proposition via ads + landing page.', icon: 'CursorClick' as const };
    }
    return { name: 'Simulation or Trial', note: 'Whole-concept Do data — Wizard-of-Oz simulation, or a functional trial.', icon: 'Flask' as const };
  }
  return null;
}
