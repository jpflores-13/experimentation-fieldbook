import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type {
  Screen, HomeVariant, Step, SysTab, SupportMap, SupportNote, Ring, StarRating, LoopGraph, Polarity,
  Concept, TestRow, WorkspaceData, AssumptionCategory, ChecklistItem, FiveRDiagnostic, FiveRElement,
} from '../types';
import { defaultSupportMaps, defaultLoopGraphs } from '../data/systemsSeed';
import { concepts as seedConcepts, seedTests } from '../data/seed';
import { defaultWorkspaceDataByConcept, emptyWorkspaceData } from '../data/workspaceSeed';
import { emptyFiveRDiagnostic } from '../data/fiveRsQuestions';

const STORAGE_KEY = 'fb_app_state_v1';

export interface PersistedState {
  screen: Screen;
  home: HomeVariant;
  step: Step;
  sysTab: SysTab;
  sysArch: string | null;
  supportMaps: Record<string, SupportMap>;
  loopGraphs: Record<string, LoopGraph>;
  concepts: Concept[];
  activeConceptId: string;
  workspaceData: Record<string, WorkspaceData>;
  tests: TestRow[];
  fiveRs: FiveRDiagnostic[];
  activeFiveRId: string | null;
}

const defaultState: PersistedState = {
  screen: 'dashboard',
  home: 'a',
  step: 1,
  sysTab: 'support',
  sysArch: null,
  supportMaps: defaultSupportMaps,
  loopGraphs: defaultLoopGraphs,
  concepts: seedConcepts,
  activeConceptId: 'easykicks',
  workspaceData: defaultWorkspaceDataByConcept,
  tests: seedTests,
  fiveRs: [],
  activeFiveRId: null,
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

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

interface AppStateValue extends PersistedState {
  go: (screen: Screen) => void;
  setHome: (home: HomeVariant) => void;
  setStep: (step: Step) => void;
  setSysTab: (t: SysTab) => void;
  setSysArch: (id: string | null) => void;
  resetToDemoData: () => void;
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
  clearLoopGraph: (graphId: string) => void;
  renameLoopGraph: (graphId: string, title: string) => void;
  renameSupportMap: (mapId: string, title: string) => void;

  // Concepts
  setActiveConcept: (id: string) => void;
  createConcept: () => string;
  deleteConcept: (id: string) => void;
  clearConcepts: () => void;
  updateConcept: (id: string, patch: Partial<Pick<Concept, 'name' | 'org' | 'description'>>) => void;
  moveConcept: (id: string, value: number, effort: number) => void;

  // Tests
  deleteTest: (id: string) => void;
  clearTests: () => void;

  // Step 1
  updateSnapshotUserLabel: (conceptId: string, which: 'user1Label' | 'user2Label', value: string) => void;
  updateSnapshotField: (conceptId: string, rowId: string, col: 'u1' | 'u2', value: string) => void;
  updateStoryboardCaption: (conceptId: string, frameId: string, value: string) => void;
  toggleStoryboardBlank: (conceptId: string, frameId: string) => void;
  setStoryboardFile: (conceptId: string, frameId: string, file: { dataUrl: string; name: string; type: string } | null) => void;

  // Step 2
  addAssumption: (conceptId: string, category: AssumptionCategory) => void;
  updateAssumption: (conceptId: string, category: AssumptionCategory, itemId: string, text: string) => void;
  deleteAssumption: (conceptId: string, category: AssumptionCategory, itemId: string) => void;
  addEvidenceRow: (conceptId: string) => void;
  updateEvidenceField: (conceptId: string, rowId: string, field: 'assumption' | 'evidence' | 'threshold' | 'aspirational' | 'source', value: string) => void;
  deleteEvidenceRow: (conceptId: string, rowId: string) => void;

  // Step 3
  setConceptQ1: (conceptId: string, v: 'yes' | 'no') => void;
  setConceptQ2: (conceptId: string, v: 'component' | 'whole') => void;
  setConceptQ3: (conceptId: string, v: 'say' | 'do') => void;
  setConceptSaydo: (conceptId: string, v: number) => void;
  updateDigestField: (conceptId: string, field: keyof WorkspaceData['step3']['digest'], value: string) => void;
  confirmTest: (conceptId: string) => void;

  // Step 4
  setConceptFidelity: (conceptId: string, v: number) => void;
  selectFormat: (conceptId: string, formatId: string) => void;
  toggleResearchGuideItem: (conceptId: string, itemId: string) => void;

  // Step 5
  toggleAuditItem: (conceptId: string, itemId: string) => void;
  updateResultField: (conceptId: string, rowId: string, field: 'label' | 'actual' | 'threshold', value: string | number) => void;
  addResultRow: (conceptId: string) => void;
  deleteResultRow: (conceptId: string, rowId: string) => void;
  updateIterateNote: (conceptId: string, value: string) => void;
  updateLiveStatus: (conceptId: string, label: string, note: string) => void;

  // 5Rs System Diagnostic
  setActiveFiveR: (id: string | null) => void;
  createFiveRDiagnostic: () => string;
  deleteFiveRDiagnostic: (id: string) => void;
  duplicateFiveRDiagnostic: (id: string) => string;
  renameFiveRDiagnostic: (id: string, name: string) => void;
  updateFiveRBoundary: (id: string, value: string) => void;
  setFiveRStatus: (id: string, status: 'draft' | 'final') => void;
  setFiveRRating: (id: string, element: FiveRElement, rating: number) => void;
  updateFiveRAnswer: (id: string, element: FiveRElement, questionIndex: number, value: string) => void;
  updateFiveRGapNote: (id: string, element: FiveRElement, value: string) => void;
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

  // Pop-out windows (Support Map / Feedback Loops) share this tab's
  // localStorage — pick up edits made in the other window without a reload.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        setState(s => ({ ...s, ...JSON.parse(e.newValue!) }));
      } catch {
        /* ignore malformed storage */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

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

  const updateWorkspace = (conceptId: string, fn: (w: WorkspaceData) => WorkspaceData) => {
    setState(s => {
      const current = s.workspaceData[conceptId];
      if (!current) return s;
      return { ...s, workspaceData: { ...s.workspaceData, [conceptId]: fn(current) } };
    });
  };

  const updateFiveR = (id: string, fn: (d: FiveRDiagnostic) => FiveRDiagnostic) => {
    setState(s => ({ ...s, fiveRs: s.fiveRs.map(d => (d.id === id ? fn(d) : d)) }));
  };

  const value: AppStateValue = {
    ...state,
    go: (screen) => patch({ screen }),
    setHome: (home) => patch({ home }),
    setStep: (step) => patch({ step }),
    setSysTab: (sysTab) => patch({ sysTab, sysArch: null }),
    setSysArch: (sysArch) => patch({ sysArch }),
    resetToDemoData: () => setState(defaultState),
    renameSupportMap: (mapId, title) => {
      const trimmed = title.trim();
      if (!trimmed) return;
      updateMap(mapId, m => ({ ...m, title: trimmed }));
    },
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
        ...g,
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
    clearLoopGraph: (graphId) => {
      updateGraph(graphId, g => ({ ...g, nodes: [], links: [] }));
    },
    renameLoopGraph: (graphId, title) => {
      const trimmed = title.trim();
      if (!trimmed) return;
      updateGraph(graphId, g => ({ ...g, title: trimmed }));
    },

    // ---- Concepts ----
    setActiveConcept: (id) => patch({ activeConceptId: id, step: 1 }),
    createConcept: () => {
      const id = newId('concept');
      const concept: Concept = {
        id, name: 'New concept', description: '', org: '',
        accent: 'blue', step: 1, stepLabel: 'Step 1 · Frame',
        segments: [0, 0, 0, 0, 0], value: 50, effort: 50, quadrantLabel: 'Quick win', statusLine: 'Just started',
      };
      setState(s => ({
        ...s,
        concepts: [...s.concepts, concept],
        workspaceData: { ...s.workspaceData, [id]: emptyWorkspaceData() },
        activeConceptId: id,
        screen: 'workspace',
        step: 1,
      }));
      return id;
    },
    deleteConcept: (id) => {
      setState(s => {
        const concepts = s.concepts.filter(c => c.id !== id);
        const workspaceData = { ...s.workspaceData };
        delete workspaceData[id];
        const activeConceptId = s.activeConceptId === id ? (concepts[0]?.id ?? '') : s.activeConceptId;
        return { ...s, concepts, workspaceData, activeConceptId };
      });
    },
    clearConcepts: () => {
      setState(s => ({ ...s, concepts: [], workspaceData: {}, activeConceptId: '' }));
    },
    updateConcept: (id, patchFields) => {
      setState(s => ({ ...s, concepts: s.concepts.map(c => (c.id === id ? { ...c, ...patchFields } : c)) }));
    },
    moveConcept: (id, value, effort) => {
      setState(s => ({ ...s, concepts: s.concepts.map(c => (c.id === id ? { ...c, value, effort } : c)) }));
    },

    // ---- Tests ----
    deleteTest: (id) => {
      setState(s => ({ ...s, tests: s.tests.filter(t => t.id !== id) }));
    },
    clearTests: () => {
      setState(s => ({ ...s, tests: [] }));
    },

    // ---- Step 1 ----
    updateSnapshotUserLabel: (conceptId, which, value) => {
      updateWorkspace(conceptId, w => ({ ...w, step1: { ...w.step1, [which]: value } }));
    },
    updateSnapshotField: (conceptId, rowId, col, value) => {
      updateWorkspace(conceptId, w => ({
        ...w,
        step1: { ...w.step1, snapshot: w.step1.snapshot.map(row => (row.id === rowId ? { ...row, [col]: value } : row)) },
      }));
    },
    updateStoryboardCaption: (conceptId, frameId, value) => {
      updateWorkspace(conceptId, w => ({
        ...w,
        step1: { ...w.step1, storyboard: w.step1.storyboard.map(f => (f.id === frameId ? { ...f, caption: value } : f)) },
      }));
    },
    toggleStoryboardBlank: (conceptId, frameId) => {
      updateWorkspace(conceptId, w => ({
        ...w,
        step1: { ...w.step1, storyboard: w.step1.storyboard.map(f => (f.id === frameId ? { ...f, blank: !f.blank } : f)) },
      }));
    },
    setStoryboardFile: (conceptId, frameId, file) => {
      updateWorkspace(conceptId, w => ({
        ...w,
        step1: {
          ...w.step1,
          storyboard: w.step1.storyboard.map(f => (f.id === frameId
            ? { ...f, fileDataUrl: file?.dataUrl, fileName: file?.name, fileType: file?.type }
            : f)),
        },
      }));
    },

    // ---- Step 2 ----
    addAssumption: (conceptId, category) => {
      updateWorkspace(conceptId, w => ({
        ...w,
        step2: {
          ...w.step2,
          assumptions: {
            ...w.step2.assumptions,
            [category]: [...w.step2.assumptions[category], { id: newId('assum'), text: 'New assumption' }],
          },
        },
      }));
    },
    updateAssumption: (conceptId, category, itemId, text) => {
      updateWorkspace(conceptId, w => ({
        ...w,
        step2: {
          ...w.step2,
          assumptions: {
            ...w.step2.assumptions,
            [category]: w.step2.assumptions[category].map(item => (item.id === itemId ? { ...item, text } : item)),
          },
        },
      }));
    },
    deleteAssumption: (conceptId, category, itemId) => {
      updateWorkspace(conceptId, w => ({
        ...w,
        step2: {
          ...w.step2,
          assumptions: {
            ...w.step2.assumptions,
            [category]: w.step2.assumptions[category].filter(item => item.id !== itemId),
          },
        },
      }));
    },
    addEvidenceRow: (conceptId) => {
      updateWorkspace(conceptId, w => ({
        ...w,
        step2: {
          ...w.step2,
          evidence: [...w.step2.evidence, { id: newId('evid'), assumption: 'New assumption', evidence: '', threshold: '', aspirational: '', source: '' }],
        },
      }));
    },
    updateEvidenceField: (conceptId, rowId, field, value) => {
      updateWorkspace(conceptId, w => ({
        ...w,
        step2: { ...w.step2, evidence: w.step2.evidence.map(row => (row.id === rowId ? { ...row, [field]: value } : row)) },
      }));
    },
    deleteEvidenceRow: (conceptId, rowId) => {
      updateWorkspace(conceptId, w => ({ ...w, step2: { ...w.step2, evidence: w.step2.evidence.filter(row => row.id !== rowId) } }));
    },

    // ---- Step 3 ----
    setConceptQ1: (conceptId, v) => updateWorkspace(conceptId, w => ({ ...w, step3: { ...w.step3, q1: v } })),
    setConceptQ2: (conceptId, v) => updateWorkspace(conceptId, w => ({ ...w, step3: { ...w.step3, q2: v } })),
    setConceptQ3: (conceptId, v) => updateWorkspace(conceptId, w => ({ ...w, step3: { ...w.step3, q3: v } })),
    setConceptSaydo: (conceptId, v) => updateWorkspace(conceptId, w => ({ ...w, step3: { ...w.step3, saydo: v } })),
    updateDigestField: (conceptId, field, value) => {
      updateWorkspace(conceptId, w => ({ ...w, step3: { ...w.step3, digest: { ...w.step3.digest, [field]: value } } }));
    },
    confirmTest: (conceptId) => {
      const concept = state.concepts.find(c => c.id === conceptId);
      const workspace = state.workspaceData[conceptId];
      if (!concept || !workspace) return;
      const rec = recommendation(workspace.step3.q1, workspace.step3.q2, workspace.step3.q3);
      const testType = rec?.name ?? (workspace.step3.digest.testType || 'Test');
      const sayDo = workspace.step3.q3 === 'say' ? 'Say' : workspace.step3.q3 === 'do' ? 'Do' : 'Say→Do';
      const row: TestRow = {
        id: newId('test'), concept: `${concept.name} · ${testType}`, testType, sayDo,
        status: 'In field', statusColor: 'blue', result: 'Awaiting results', resultColor: 'muted',
      };
      setState(s => ({ ...s, tests: [row, ...s.tests] }));
    },

    // ---- Step 4 ----
    setConceptFidelity: (conceptId, v) => updateWorkspace(conceptId, w => ({ ...w, step4: { ...w.step4, fidelity: v } })),
    selectFormat: (conceptId, formatId) => updateWorkspace(conceptId, w => ({ ...w, step4: { ...w.step4, selectedFormat: formatId } })),
    toggleResearchGuideItem: (conceptId, itemId) => {
      updateWorkspace(conceptId, w => ({
        ...w,
        step4: { ...w.step4, researchGuide: w.step4.researchGuide.map((it: ChecklistItem) => (it.id === itemId ? { ...it, done: !it.done } : it)) },
      }));
    },

    // ---- Step 5 ----
    toggleAuditItem: (conceptId, itemId) => {
      updateWorkspace(conceptId, w => ({
        ...w,
        step5: { ...w.step5, audit: w.step5.audit.map((it: ChecklistItem) => (it.id === itemId ? { ...it, done: !it.done } : it)) },
      }));
    },
    updateResultField: (conceptId, rowId, field, value) => {
      updateWorkspace(conceptId, w => ({
        ...w,
        step5: { ...w.step5, results: w.step5.results.map(r => (r.id === rowId ? { ...r, [field]: value } : r)) },
      }));
    },
    addResultRow: (conceptId) => {
      updateWorkspace(conceptId, w => ({
        ...w,
        step5: { ...w.step5, results: [...w.step5.results, { id: newId('res'), label: 'New metric', actual: 0, threshold: 0, comparison: 'gte', unit: '%', vsLabel: '' }] },
      }));
    },
    deleteResultRow: (conceptId, rowId) => {
      updateWorkspace(conceptId, w => ({ ...w, step5: { ...w.step5, results: w.step5.results.filter(r => r.id !== rowId) } }));
    },
    updateIterateNote: (conceptId, value) => {
      updateWorkspace(conceptId, w => ({ ...w, step5: { ...w.step5, iterateNote: value } }));
    },
    updateLiveStatus: (conceptId, label, note) => {
      updateWorkspace(conceptId, w => ({ ...w, step5: { ...w.step5, liveStatusLabel: label, liveStatusNote: note } }));
    },

    // ---- 5Rs System Diagnostic ----
    setActiveFiveR: (id) => patch({ activeFiveRId: id }),
    createFiveRDiagnostic: () => {
      const diag = emptyFiveRDiagnostic();
      setState(s => ({ ...s, fiveRs: [diag, ...s.fiveRs], activeFiveRId: diag.id }));
      return diag.id;
    },
    deleteFiveRDiagnostic: (id) => {
      setState(s => {
        const fiveRs = s.fiveRs.filter(d => d.id !== id);
        const activeFiveRId = s.activeFiveRId === id ? (fiveRs[0]?.id ?? null) : s.activeFiveRId;
        return { ...s, fiveRs, activeFiveRId };
      });
    },
    duplicateFiveRDiagnostic: (id) => {
      const source = state.fiveRs.find(d => d.id === id);
      if (!source) return '';
      const now = new Date().toISOString();
      const copy: FiveRDiagnostic = {
        ...source,
        id: newId('5r'),
        name: `${source.name} (copy)`,
        status: 'draft',
        createdAt: now,
        updatedAt: now,
      };
      setState(s => ({ ...s, fiveRs: [copy, ...s.fiveRs], activeFiveRId: copy.id }));
      return copy.id;
    },
    renameFiveRDiagnostic: (id, name) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      updateFiveR(id, d => ({ ...d, name: trimmed, updatedAt: new Date().toISOString() }));
    },
    updateFiveRBoundary: (id, value) => {
      updateFiveR(id, d => ({ ...d, systemBoundary: value, updatedAt: new Date().toISOString() }));
    },
    setFiveRStatus: (id, status) => {
      updateFiveR(id, d => ({ ...d, status, updatedAt: new Date().toISOString() }));
    },
    setFiveRRating: (id, element, rating) => {
      updateFiveR(id, d => ({ ...d, elements: { ...d.elements, [element]: { ...d.elements[element], rating } }, updatedAt: new Date().toISOString() }));
    },
    updateFiveRAnswer: (id, element, questionIndex, value) => {
      updateFiveR(id, d => {
        const answers = d.elements[element].answers.slice();
        answers[questionIndex] = value;
        return { ...d, elements: { ...d.elements, [element]: { ...d.elements[element], answers } }, updatedAt: new Date().toISOString() };
      });
    },
    updateFiveRGapNote: (id, element, value) => {
      updateFiveR(id, d => ({ ...d, elements: { ...d.elements, [element]: { ...d.elements[element], gapNote: value } }, updatedAt: new Date().toISOString() }));
    },
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}

export function recommendation(q1: 'yes' | 'no' | null, q2: 'component' | 'whole' | null, q3: 'say' | 'do' | null) {
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
