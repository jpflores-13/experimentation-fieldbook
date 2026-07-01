// Data model — typed records so seed (case-study) data can be swapped
// for real, user-created records without touching the UI.

export type Step = 1 | 2 | 3 | 4 | 5;
export type Screen = 'dashboard' | 'concepts' | 'workspace' | 'tests' | 'progress' | 'team' | 'systems';
export type SysTab = 'support' | 'loops' | 'archetypes';
export type HomeVariant = 'a' | 'b' | 'c';
export type Quadrant = 'quick-win' | 'strategic-bet' | 'fill-in' | 'avoid';
export type Role = 'Owner' | 'Editor' | 'Viewer';

export interface Member {
  id: string;
  name: string;
  initials: string;
  role: string;
  roleTag: Role;
  color: string;
}

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
  ownerId: string;
  segments: (0 | 0.5 | 1)[]; // 5-segment progress bar fill (0, half, full)
  value: number; // 0-100, y position on matrix (0 = bottom/low value)
  effort: number; // 0-100, x position on matrix (0 = left/easy)
  quadrantLabel: string; // "Quick win", "Strategic bet", etc.
  statusLine: string; // used in All concepts list
  shelved?: boolean;
}

export interface Comment {
  id: string;
  authorId: string;
  target: string; // "Concept · Template"
  text: string;
  when: string;
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

export interface ActivityItem {
  id: string;
  memberId: string;
  html: string;
  when: string;
}

export interface TaskItem {
  id: string;
  label: string;
  meta: string;
  done: boolean;
}
