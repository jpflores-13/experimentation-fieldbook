// Data model — typed records so seed (case-study) data can be swapped
// for real, user-created records without touching the UI.

export type Step = 1 | 2 | 3 | 4 | 5;
export type Screen = 'dashboard' | 'concepts' | 'workspace' | 'tests' | 'progress' | 'systems';
export type SysTab = 'support' | 'loops' | 'archetypes';
export type HomeVariant = 'a' | 'b' | 'c';
export type Quadrant = 'quick-win' | 'strategic-bet' | 'fill-in' | 'avoid';

export interface Concept {
  id: string;
  name: string;
  subtitle: string;
  org: string;
  icon: string; // phosphor icon name suffix
  iconWeight?: 'regular' | 'fill';
  accent: 'blue' | 'teal' | 'slate';
  step: Step;
  stepLabel: string;
  segments: (0 | 0.5 | 1)[]; // 5-segment progress bar fill (0, half, full)
  value: number; // 0-100, y position on matrix (0 = bottom/low value)
  effort: number; // 0-100, x position on matrix (0 = left/easy)
  quadrantLabel: string; // "Quick win", "Strategic bet", etc.
  statusLine: string; // used in All concepts list
  shelved?: boolean;
}

export interface TestRow {
  id: string;
  concept: string;
  testType: string;
  sayDo: string;
  status: string;
  statusColor: 'blue' | 'muted';
  result: string;
  resultColor: 'teal' | 'muted' | 'warn';
}

export interface TaskItem {
  id: string;
  label: string;
  meta: string;
  done: boolean;
}

// Systems mapping — per-concept records
export type Ring = 'role' | 'responsibility' | 'need' | 'resource' | 'wish';
export type StarRating = 'helpful' | 'neutral' | 'unhelpful';

export interface SupportNote {
  id: string;
  ring: Ring;
  text: string;
  x: number; // 0-100, % from left of the map
  y: number; // 0-100, % from top of the map
  star?: StarRating; // meaningful for resource notes only
}

export interface SupportMap {
  title: string;
  notes: SupportNote[];
}

export type Polarity = '+' | '-';

export interface LoopNodeRecord {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface LoopLinkRecord {
  id: string;
  from: string;
  to: string;
  polarity: Polarity;
}

export interface LoopGraph {
  nodes: LoopNodeRecord[];
  links: LoopLinkRecord[];
}
