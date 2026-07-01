import type { WorkspaceData, FormatOption, SnapshotRow, StoryboardFrame } from '../types';

// The fixed catalog of prototype formats offered in Step 4 (not per-concept —
// it's the picker itself, only `selectedFormat` on a concept's Step4Data varies).
export const formatOptions: FormatOption[] = [
  { id: 'storyboard', label: 'Storyboard', sub: 'low-fi', icon: 'Cards' },
  { id: 'poster', label: 'Poster', sub: 'low-fi', icon: 'ImageSquare' },
  { id: 'physical-mockup', label: 'Physical mock-up', sub: 'mid-fi', icon: 'Package' },
  { id: 'digital-mockup', label: 'Digital mock-up', sub: 'mid-fi', icon: 'DeviceMobile' },
  { id: 'mvp', label: 'MVP', sub: 'high-fi', icon: 'RocketLaunch' },
];

function blankSnapshot(): SnapshotRow[] {
  return [
    { id: 'for', label: 'For', sub: 'target user', spanBoth: false, u1: '', u2: '' },
    { id: 'who-want', label: 'Who want', sub: 'unmet needs', spanBoth: false, u1: '', u2: '' },
    { id: 'we-will-offer', label: 'We will offer', sub: 'offering', spanBoth: true, u1: '', u2: '' },
    { id: 'that-provides', label: 'That provides', sub: 'benefits', spanBoth: false, u1: '', u2: '' },
    { id: 'uniquely', label: 'Uniquely', sub: 'differentiation', spanBoth: true, u1: '', u2: '' },
  ];
}

function blankStoryboard(): StoryboardFrame[] {
  return Array.from({ length: 5 }, (_, i) => ({ id: `f${i + 1}`, caption: '', blank: false }));
}

export function emptyWorkspaceData(): WorkspaceData {
  return {
    step1: { user1Label: 'User 1', user2Label: 'User 2', snapshot: blankSnapshot(), storyboard: blankStoryboard() },
    step2: {
      assumptions: { desirability: [], feasibility: [], viability: [] },
      evidence: [],
    },
    step3: {
      q1: null, q2: null, q3: null, saydo: 50,
      dataSort: [],
      digest: { testType: '', testTypeSub: '', prototype: '', prototypeSub: '', participants: '', participantsSub: '', sampleTimeframe: '', sampleTimeframeSub: '' },
    },
    step4: {
      fidelity: 50,
      selectedFormat: '',
      researchGuide: [
        { id: 'rg1', label: 'Roles of researcher & participant defined', done: false },
        { id: 'rg2', label: 'Interview guide & probing questions drafted', done: false },
        { id: 'rg3', label: 'Privacy notice / consent form ready', done: false },
        { id: 'rg4', label: 'Recruiting plans A, B & C in place', done: false },
      ],
    },
    step5: {
      audit: [
        { id: 'a1', label: 'Prototype tests the critical assumption', done: false },
        { id: 'a2', label: 'Data capture plan works end-to-end', done: false },
        { id: 'a3', label: 'Pretested with 3 friendly proxies', done: false },
        { id: 'a4', label: 'Documentation running in parallel', done: false },
      ],
      liveStatusLabel: 'Not started',
      liveStatusNote: '',
      results: [],
      iterateNote: '',
    },
  };
}

const easykicksWorkspaceData: WorkspaceData = {
  step1: {
    user1Label: 'Young Athletes (8–12)',
    user2Label: 'Their Parents',
    snapshot: [
      { id: 'for', label: 'For', sub: 'target user', spanBoth: false, u1: 'Kids who play sports and outgrow shoes fast', u2: 'Parents managing cost, hassle & sustainability' },
      { id: 'who-want', label: 'Who want', sub: 'unmet needs', spanBoth: false, u1: 'More control & agency in their shoe choices; the right fit & performance; a pleasant, less painful shopping experience', u2: 'Confidence kids have the right shoes; less time spent shopping; fewer conflicts & stress' },
      { id: 'we-will-offer', label: 'We will offer', sub: 'offering', spanBoth: true, u1: 'A subscription that delivers the right shoes when kids need them, with a simple return-and-recycle loop for outgrown pairs.', u2: '' },
      { id: 'that-provides', label: 'That provides', sub: 'benefits', spanBoth: false, u1: 'Self-expression, confidence & a special feeling when they perform', u2: 'The shoes their athletes need, when they need them — with less shopping pain' },
      { id: 'uniquely', label: 'Uniquely', sub: 'differentiation', spanBoth: true, u1: 'A sustainable, cyclical buy-return process with accurate fit assessment and a 1:1 ongoing relationship — a service experience wrapped around the shoe.', u2: '' },
    ],
    storyboard: [
      { id: 'f1', caption: 'Parent sees Easykicks and signs their kid up online', blank: false },
      { id: 'f2', caption: 'First box arrives; kid tries on the shoes', blank: false },
      { id: 'f3', caption: '(blank on purpose)', blank: true },
      { id: 'f4', caption: 'Outgrown shoes go back in the prepaid bag', blank: false },
      { id: 'f5', caption: '(blank on purpose)', blank: true },
    ],
  },
  step2: {
    assumptions: {
      desirability: [
        { id: 'd1', text: "Parents want to recycle their kids' outgrown shoes" },
        { id: 'd2', text: 'A prepaid return bag removes the friction of sending back' },
      ],
      feasibility: [
        { id: 'f1', text: 'Parents will actually mail the old shoes back' },
        { id: 'f2', text: 'Returns can be processed at existing facilities' },
      ],
      viability: [
        { id: 'v1', text: 'Cost to process each returned pair stays low enough' },
        { id: 'v2', text: 'Recovered materials offset the processing cost' },
      ],
    },
    evidence: [
      { id: 'e1', assumption: 'Parents will return old shoes', evidence: '% of buyers who mail back within 60 days', threshold: '≥ 30%', aspirational: '60%', source: 'Prepaid-bag tracking' },
      { id: 'e2', assumption: 'Parents value recycling', evidence: 'Unprompted positive mentions in interviews', threshold: '50%', aspirational: '80%', source: 'Intercept interviews' },
      { id: 'e3', assumption: 'Processing stays viable', evidence: 'Fully-loaded cost per returned pair', threshold: '< $4', aspirational: '< $2', source: 'Ops finance log' },
    ],
  },
  step3: {
    q1: null, q2: null, q3: null, saydo: 64,
    dataSort: [
      { id: 'ds1', tag: 'KNOW NOW', text: 'Shoe recycling rates from prior CSR data' },
      { id: 'ds2', tag: 'KNOWABLE', text: 'Return-shipping cost per parcel' },
      { id: 'ds3', tag: 'FIELD ONLY', text: 'Whether parents actually mail shoes back' },
    ],
    digest: {
      testType: 'Simulation', testTypeSub: 'Wizard-of-Oz returns',
      prototype: 'Prepaid return bag', prototypeSub: 'Physical mock-up',
      participants: "Parents buying kids' shoes", participantsSub: 'Recruited in-store',
      sampleTimeframe: '40 buyers · 60 days', sampleTimeframeSub: 'Return window',
    },
  },
  step4: {
    fidelity: 42,
    selectedFormat: 'physical-mockup',
    researchGuide: [
      { id: 'rg1', label: 'Roles of researcher & participant defined', done: true },
      { id: 'rg2', label: 'Interview guide & probing questions drafted', done: true },
      { id: 'rg3', label: 'Privacy notice / consent form ready', done: false },
      { id: 'rg4', label: 'Recruiting plans A, B & C in place', done: false },
    ],
  },
  step5: {
    audit: [
      { id: 'a1', label: 'Prototype tests the critical assumption', done: true },
      { id: 'a2', label: 'Data capture plan works end-to-end', done: true },
      { id: 'a3', label: 'Pretested with 3 friendly proxies', done: true },
      { id: 'a4', label: 'Documentation running in parallel', done: false },
    ],
    liveStatusLabel: 'Test is live',
    liveStatusNote: 'Day 3 of 60 · 14 bags returned so far',
    results: [
      { id: 'r1', label: 'Return rate', actual: 41, threshold: 30, comparison: 'gte', unit: '%', vsLabel: 'vs ≥30%' },
      { id: 'r2', label: 'Value recycling (mentions)', actual: 63, threshold: 50, comparison: 'gte', unit: '%', vsLabel: 'vs 50%' },
      { id: 'r3', label: 'Cost per pair', actual: 4.6, threshold: 4, comparison: 'lte', unit: '$', vsLabel: 'vs <$4' },
    ],
    iterateNote: "Parents clearly want to recycle and will return shoes — move this component forward to a smoke test on the full subscription value proposition. But processing cost missed threshold: redesign the returns flow to consolidate shipments before the next round.",
  },
};

export const defaultWorkspaceDataByConcept: Record<string, WorkspaceData> = {
  easykicks: easykicksWorkspaceData,
  'welcome-host': emptyWorkspaceData(),
  'career-navigator': emptyWorkspaceData(),
  'er-fast-track': emptyWorkspaceData(),
  snippets: emptyWorkspaceData(),
  hive: emptyWorkspaceData(),
};
