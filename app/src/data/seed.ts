import type { Member, Concept, Comment, TestRow, ActivityItem, TaskItem } from '../types';

export const members: Member[] = [
  { id: 'ma', name: 'Maya Alvarez', initials: 'MA', role: 'Lead researcher', roleTag: 'Owner', color: '#008ecd' },
  { id: 'jr', name: 'Jordan Reyes', initials: 'JR', role: 'Design researcher · Easykicks, ER Fast-Track', roleTag: 'Editor', color: '#2ea38e' },
  { id: 'tk', name: 'Tomás Kane', initials: 'TK', role: 'Field lead · Welcome Host', roleTag: 'Editor', color: '#5b6b7a' },
  { id: 'sp', name: 'Sam Park', initials: 'SP', role: 'Stakeholder · reviews only', roleTag: 'Viewer', color: '#9b8b5b' },
];

export const concepts: Concept[] = [
  {
    id: 'easykicks', name: 'Easykicks subscription', subtitle: 'Shoe recycling component · Nike', org: 'Nike',
    icon: 'SneakerMove', accent: 'blue', step: 4, stepLabel: 'Step 4 · Prototype', ownerId: 'jr',
    segments: [1, 1, 1, 0.5, 0], value: 84, effort: 18, quadrantLabel: 'Quick win',
    statusLine: 'Quick win · 2 of 3 critical assumptions tested',
  },
  {
    id: 'welcome-host', name: 'Welcome Host', subtitle: 'Station concierge · South Western Railway', org: 'South Western Railway',
    icon: 'HandWaving', accent: 'teal', step: 5, stepLabel: 'Step 5 · Trial', ownerId: 'tk',
    segments: [1, 1, 1, 1, 0.5], value: 73, effort: 52, quadrantLabel: 'Strategic bet',
    statusLine: 'Strategic bet · validated, scaling',
  },
  {
    id: 'career-navigator', name: 'Career Navigator', subtitle: 'Self-assessment tool · PMI', org: 'PMI',
    icon: 'CompassTool', accent: 'blue', step: 3, stepLabel: 'Step 3 · Test design', ownerId: 'ma',
    segments: [1, 1, 0.5, 0, 0], value: 68, effort: 73, quadrantLabel: 'Strategic bet',
    statusLine: 'Strategic bet · designing test',
  },
  {
    id: 'er-fast-track', name: 'ER Fast-Track', subtitle: 'Triage at entrance · Whiteriver Hospital', org: 'Whiteriver Hospital',
    icon: 'FirstAid', accent: 'slate', step: 2, stepLabel: 'Step 2 · Evidence', ownerId: 'jr',
    segments: [1, 0.5, 0, 0, 0], value: 58, effort: 28, quadrantLabel: 'Quick win',
    statusLine: 'Quick win · surfacing assumptions',
  },
  {
    id: 'snippets', name: 'Snippets micro-learning', subtitle: 'PMI · value/effort mapped', org: 'PMI',
    icon: 'Lightning', accent: 'slate', step: 1, stepLabel: 'Step 1 · Frame', ownerId: 'jr',
    segments: [0.5, 0, 0, 0, 0], value: 38, effort: 24, quadrantLabel: 'Fill-in',
    statusLine: 'Fill-in · concept snapshot',
  },
  {
    id: 'hive', name: 'Hive peer network', subtitle: 'PMI · concept snapshot draft', org: 'PMI',
    icon: 'Users', accent: 'slate', step: 1, stepLabel: 'Step 1 · Frame', ownerId: 'ma',
    segments: [0.5, 0, 0, 0, 0], value: 30, effort: 76, quadrantLabel: 'Avoid',
    statusLine: 'Shelved · failed desirability threshold', shelved: true,
  },
];

export const tasks: TaskItem[] = [
  { id: 't1', label: 'Prioritize assumptions — Career Navigator', meta: 'Step 2 · due tomorrow', done: false },
  { id: 't2', label: 'Build poster prototype — Easykicks', meta: 'Step 4 · this week', done: false },
  { id: 't3', label: 'Run pretest — Welcome Host', meta: 'Step 5 · done', done: true },
];

export const activity: ActivityItem[] = [
  { id: 'a1', memberId: 'tk', html: '<b>Tomás</b> logged trial results for <b class="link">Welcome Host</b> — 80% staff satisfaction.', when: '12 min ago' },
  { id: 'a2', memberId: 'ma', html: '<b>Maya</b> commented on <b class="link">Career Navigator</b> assumptions.', when: '1 hr ago' },
  { id: 'a3', memberId: 'jr', html: '<b>Jordan</b> completed the <b class="link">Concept Snapshot</b> for Easykicks.', when: '3 hrs ago' },
];

export const comments: Comment[] = [
  { id: 'c1', authorId: 'ma', target: 'Career Navigator · Assumptions', text: 'Is "members will finish the assessment" really the make-or-break one? Feels more like feasibility than desirability.', when: '1h' },
  { id: 'c2', authorId: 'jr', target: 'Easykicks · Test Digest', text: 'Bumping the sample to 40 buyers — 20 felt too thin to trust the return rate.', when: '3h' },
  { id: 'c3', authorId: 'tk', target: 'Welcome Host · Results', text: 'Leisure-travel component is dead — awareness near zero. Recommend cutting it before trial 2 write-up.', when: 'yesterday' },
];

export const tests: TestRow[] = [
  { id: '01', concept: 'Easykicks · recycling', testType: 'Simulation', sayDo: 'Do', status: 'In field', statusColor: 'blue', result: '2 / 3 pass', resultColor: 'teal' },
  { id: '02', concept: 'Welcome Host · trial 2', testType: 'Trial', sayDo: 'Do', status: 'In field', statusColor: 'blue', result: 'Desirability ✓', resultColor: 'teal' },
  { id: '03', concept: 'Career Navigator · persistence', testType: 'Simulation', sayDo: 'Do', status: 'Analyzing', statusColor: 'muted', result: '70% > 40%', resultColor: 'teal' },
  { id: '04', concept: 'PMI concepts · lemonade stand', testType: 'Lemonade stand', sayDo: 'Say→Do', status: 'Complete', statusColor: 'muted', result: '2 shelved', resultColor: 'muted' },
  { id: '05', concept: 'ER Fast-Track · legality', testType: 'Thought test', sayDo: 'Archival', status: 'Complete', statusColor: 'muted', result: 'Pivot needed', resultColor: 'warn' },
];

export const memberById = (id: string) => members.find(m => m.id === id)!;
export const conceptById = (id: string) => concepts.find(c => c.id === id)!;
