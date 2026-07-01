// Data model — typed records so seed (case-study) data can be swapped
// for real, user-created records without touching the UI.

export type Step = 1 | 2 | 3 | 4 | 5;
export type Screen = 'dashboard' | 'concepts' | 'workspace' | 'tests' | 'progress' | 'systems';
export type SysTab = 'support' | 'loops' | 'archetypes' | 'fiveRs';
export type HomeVariant = 'a' | 'b' | 'c';
export type Quadrant = 'quick-win' | 'strategic-bet' | 'fill-in' | 'avoid';

export interface Concept {
  id: string;
  name: string;
  subtitle: string;
  description: string; // context line shown in the workspace header, e.g. "testing whether parents will return old shoes"
  org: string;
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

// Per-concept Guided Workflow content — every "box" a user fills in while
// working through the five steps. Keyed by concept id in AppState.

export interface SnapshotRow {
  id: string;
  label: string;
  sub: string;
  spanBoth: boolean; // true = one field spans both user columns (We will offer / Uniquely)
  u1: string;
  u2: string;
}

export interface StoryboardFrame {
  id: string;
  caption: string;
  blank: boolean; // true = "co-create with user" placeholder instead of an image frame
}

export interface Step1Data {
  user1Label: string;
  user2Label: string;
  snapshot: SnapshotRow[];
  storyboard: StoryboardFrame[];
}

export type AssumptionCategory = 'desirability' | 'feasibility' | 'viability';

export interface AssumptionItem {
  id: string;
  text: string;
}

export interface EvidenceRow {
  id: string;
  assumption: string;
  evidence: string;
  threshold: string;
  aspirational: string;
  source: string;
}

export interface Step2Data {
  assumptions: Record<AssumptionCategory, AssumptionItem[]>;
  evidence: EvidenceRow[];
}

export interface TestDigest {
  testType: string;
  testTypeSub: string;
  prototype: string;
  prototypeSub: string;
  participants: string;
  participantsSub: string;
  sampleTimeframe: string;
  sampleTimeframeSub: string;
}

export interface DataSortRow {
  id: string;
  tag: 'KNOW NOW' | 'KNOWABLE' | 'FIELD ONLY';
  text: string;
}

export interface Step3Data {
  q1: 'yes' | 'no' | null;
  q2: 'component' | 'whole' | null;
  q3: 'say' | 'do' | null;
  saydo: number;
  dataSort: DataSortRow[];
  digest: TestDigest;
}

export interface FormatOption {
  id: string;
  label: string;
  sub: string;
  icon: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface Step4Data {
  fidelity: number;
  selectedFormat: string; // FormatOption id
  researchGuide: ChecklistItem[];
}

export interface ResultRow {
  id: string;
  label: string;
  actual: number;
  threshold: number;
  comparison: 'gte' | 'lte'; // gte: pass if actual >= threshold; lte: pass if actual <= threshold
  unit: '%' | '$' | '';
  vsLabel: string; // e.g. "vs ≥30%" shown next to the actual value
}

export interface Step5Data {
  audit: ChecklistItem[];
  liveStatusLabel: string;
  liveStatusNote: string;
  results: ResultRow[];
  iterateNote: string;
}

export interface WorkspaceData {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
  step5: Step5Data;
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

// 5Rs System Diagnostic (USAID 5Rs Framework) — a library of named,
// timestamped assessments of a local system's "as is" state.
export type FiveRElement = 'results' | 'roles' | 'relationships' | 'rules' | 'resources';

export interface FiveRElementData {
  rating: number; // 0-5
  answers: string[]; // parallel to the fixed guiding-question list for this element
  gapNote: string;
}

export interface FiveRDiagnostic {
  id: string;
  name: string;
  systemBoundary: string; // the focal result / "as is" system being assessed
  status: 'draft' | 'final';
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  elements: Record<FiveRElement, FiveRElementData>;
}
