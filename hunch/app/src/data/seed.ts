import type { Concept, TestRow } from '../types';

export const concepts: Concept[] = [
  {
    id: 'easykicks', name: 'Easykicks subscription', org: 'Nike',
    description: 'testing whether parents will return old shoes',
accent: 'blue', step: 4, stepLabel: 'Step 4 · Prototype',
    segments: [1, 1, 1, 0.5, 0], value: 84, effort: 18, quadrantLabel: 'Quick win',
    statusLine: 'Quick win · 2 of 3 critical assumptions tested',
  },
  {
    id: 'welcome-host', name: 'Welcome Host', org: 'South Western Railway',
    description: 'testing whether station staff can double as concierges',
accent: 'teal', step: 5, stepLabel: 'Step 5 · Trial',
    segments: [1, 1, 1, 1, 0.5], value: 73, effort: 52, quadrantLabel: 'Strategic bet',
    statusLine: 'Strategic bet · validated, scaling',
  },
  {
    id: 'career-navigator', name: 'Career Navigator', org: 'PMI',
    description: 'testing whether members will complete a self-guided assessment',
accent: 'blue', step: 3, stepLabel: 'Step 3 · Test design',
    segments: [1, 1, 0.5, 0, 0], value: 68, effort: 73, quadrantLabel: 'Strategic bet',
    statusLine: 'Strategic bet · designing test',
  },
  {
    id: 'er-fast-track', name: 'ER Fast-Track', org: 'Whiteriver Hospital',
    description: 'testing whether entrance triage reduces wait times',
accent: 'slate', step: 2, stepLabel: 'Step 2 · Evidence',
    segments: [1, 0.5, 0, 0, 0], value: 58, effort: 28, quadrantLabel: 'Quick win',
    statusLine: 'Quick win · surfacing assumptions',
  },
  {
    id: 'snippets', name: 'Snippets micro-learning', org: 'PMI',
    description: 'testing whether short-form lessons improve completion rates',
accent: 'slate', step: 1, stepLabel: 'Step 1 · Frame',
    segments: [0.5, 0, 0, 0, 0], value: 38, effort: 24, quadrantLabel: 'Fill-in',
    statusLine: 'Fill-in · concept snapshot',
  },
  {
    id: 'hive', name: 'Hive peer network', org: 'PMI',
    description: 'testing whether peers will self-organize without a facilitator',
accent: 'slate', step: 1, stepLabel: 'Step 1 · Frame',
    segments: [0.5, 0, 0, 0, 0], value: 30, effort: 76, quadrantLabel: 'Avoid',
    statusLine: 'Shelved · failed desirability threshold', shelved: true,
  },
];

export const seedTests: TestRow[] = [
  { id: '01', concept: 'Easykicks · recycling', testType: 'Simulation', sayDo: 'Do', status: 'In field', statusColor: 'blue', result: '2 / 3 pass', resultColor: 'teal' },
  { id: '02', concept: 'Welcome Host · trial 2', testType: 'Trial', sayDo: 'Do', status: 'In field', statusColor: 'blue', result: 'Desirability ✓', resultColor: 'teal' },
  { id: '03', concept: 'Career Navigator · persistence', testType: 'Simulation', sayDo: 'Do', status: 'Analyzing', statusColor: 'muted', result: '70% > 40%', resultColor: 'teal' },
  { id: '04', concept: 'PMI concepts · lemonade stand', testType: 'Lemonade stand', sayDo: 'Say→Do', status: 'Complete', statusColor: 'muted', result: '2 shelved', resultColor: 'muted' },
  { id: '05', concept: 'ER Fast-Track · legality', testType: 'Thought test', sayDo: 'Archival', status: 'Complete', statusColor: 'muted', result: 'Pivot needed', resultColor: 'warn' },
];
