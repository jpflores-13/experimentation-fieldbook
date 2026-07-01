import type { FiveRElement, FiveRDiagnostic } from '../types';

// Verbatim guiding questions from Table 1, "Guiding Questions for Listening to
// the 'As Is' System," USAID Technical Note: The 5Rs Framework in the Program
// Cycle (Version 2.1, October 2016), page 7.
export const fiveRQuestions: Record<FiveRElement, string[]> = {
  results: [
    'What is the target result around which the local system is defined?',
    'Are there trends (increasing, decreasing) or patterns in the target result over time?',
    'How is the target result evaluated by local actors? Is it valued?',
    'How is that valuation expressed to actors inside and outside the local system?',
    'What other results (positive/negative) do actors note about the local system?',
    'How adaptive, resilient, or self-sustainable does the local system seem to be?',
  ],
  roles: [
    'What roles are actors currently performing?',
    'Are some actors performing multiple roles?',
    'Are some roles being played by different types of actors, such as both government and the private sector providing primary education?',
    'Are donors or other third parties playing prominent roles?',
    'How effectively are actors fulfilling the roles they have taken on?',
    'Are there issues of legitimacy or appropriateness surrounding the choice of roles that particular actors might take on?',
    'Are there any roles that seem to be absent? Why?',
  ],
  relationships: [
    'What types of relationships exist between role-players (formal/informal, contractual/hierarchical/reciprocal)?',
    'How strong are these relationships?',
    'How valued are these relationships? Are they collaborative? Mutually beneficial? Conflictual? Predatory?',
    'Does the strength of the relationship vary depending on the actors involved?',
    'Are there relationships identified as missing, weak, unnecessary or illegitimate?',
  ],
  rules: [
    'What rules affect the way the local system functions?',
    'Are the relevant rules formal (laws) or informal (norms)?',
    'Are relevant rules enforced? How well? Effectively? Equitably?',
    'Are actors in the local system able to modify the rules that affect them?',
  ],
  resources: [
    'What resources are currently being used by the local system in producing the target result?',
    'Are there needed resource inflows that are missing or insufficient?',
    'Are there trends (increasing, decreasing) or patterns (cyclical) in resource inflows?',
    'What are the sources of those resources? Are they reliable and secure?',
    'How well are the results that the local system is producing being translated, through feedback loops, into sustained resource inflows?',
  ],
};

export const fiveRElements: FiveRElement[] = ['results', 'roles', 'relationships', 'rules', 'resources'];

export const fiveRMeta: Record<FiveRElement, { label: string; color: string; textColor: string; bg: string; border: string }> = {
  results: { label: 'Results', color: '#008ecd', textColor: '#0079b0', bg: '#eef7fc', border: '#cfe8f6' },
  roles: { label: 'Roles', color: '#2ea38e', textColor: '#25826f', bg: '#eef6f3', border: '#cfe9e2' },
  relationships: { label: 'Relationships', color: '#8a5cc9', textColor: '#6d3fae', bg: '#f3ecfb', border: '#ddc9f2' },
  rules: { label: 'Rules', color: '#c25a48', textColor: '#b5502a', bg: '#fdf1ea', border: '#f0d7d2' },
  resources: { label: 'Resources', color: '#5b6b7a', textColor: '#4c5966', bg: '#f3f5f7', border: '#e3e7ea' },
};

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function emptyFiveRDiagnostic(): FiveRDiagnostic {
  const now = new Date().toISOString();
  const elements = {} as FiveRDiagnostic['elements'];
  for (const el of fiveRElements) {
    elements[el] = { rating: 0, answers: fiveRQuestions[el].map(() => ''), gapNote: '' };
  }
  return {
    id: newId('5r'),
    name: 'Untitled diagnostic',
    systemBoundary: '',
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    elements,
  };
}
