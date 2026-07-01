import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Screen, HomeVariant, Step, SysTab } from '../types';

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
