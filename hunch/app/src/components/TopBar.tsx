import { MagnifyingGlass, Plus, Printer } from '@phosphor-icons/react';
import { useAppState } from '../state/AppState';
import { HelpButton } from './HelpButton';
import type { Screen } from '../types';

const titles: Record<Exclude<Screen, 'workspace'>, [string, string]> = {
  dashboard: ['Dashboard', 'Your experimentation portfolio at a glance'],
  concepts: ['Concepts', 'Prioritize and frame your testable ideas — Step 1'],
  tests: ['Tests', 'Every test across your concepts — Test Digest & results'],
  progress: ['Progress Tracker', 'Milestones across all five steps'],
  systems: ['Systems maps', 'Map the system around your idea — supports, loops & archetypes'],
};

const screenHelp: Record<Exclude<Screen, 'workspace' | 'systems'>, string> = {
  dashboard: "Your portfolio at a glance. Switch between the Mission Control and Pipeline layouts, click any concept to open its guided workflow, and use \"New concept\" to start one from scratch.",
  concepts: "Frame your ideas here. Plot concepts on the Value/Effort Matrix by how much value they create and how hard they are to execute, or scan the list on the right — click any concept to open it, and hover a row to delete it.",
  tests: "Every test you've confirmed from Step 3, across every concept. Click a row to jump back into that concept's workflow, hover to delete one, or Clear all to start over.",
  progress: "The active concept's five-step journey — done, current and upcoming milestones — plus a quick look at a few other concepts in your portfolio.",
};

const stepHelp: Record<number, string> = {
  1: "Frame the idea: fill in the Concept Snapshot (who it's for, what you'll offer) and sketch a five-frame Storyboard. Upload a photo or PDF per frame, or mark a frame blank to co-create it with users later.",
  2: 'Surface the assumptions that make this concept a "wow," prioritize the riskiest ones, then define observable evidence with a threshold and an aspirational target for each.',
  3: 'Answer the three funnel questions to get a recommended test type, fill in the Test Digest, then Confirm test to log it into your Tests tracker as "In field."',
  4: "Pick how real the prototype needs to look and feel, choose a format (storyboard, poster, mock-up, MVP), and check off the Research Guide before you go to the field.",
  5: 'Run through the Test Audit Checklist, log your live status, record results against each threshold, and write up what you learned in "Iterate."',
};

const systemsHelp: Record<string, { title: string; body: string }> = {
  support: { title: 'System Support Map', body: "Map your role at the centre, ringed by Responsibilities, Needs, Resources and Wishes. Add a note to a ring, drag to reposition it, and star resources helpful, neutral or unhelpful." },
  loops: { title: 'Feedback Loops', body: 'Build a causal-loop diagram: add elements, then link them with a + or − polarity. The canvas auto-detects reinforcing (R) and balancing (B) loops for you.' },
  fiveRs: { title: '5Rs System Diagnostic', body: "Rate a local system's Results, Roles, Relationships, Rules and Resources 0–5, answer each element's guiding questions, and note any gaps — adapted from USAID's 5Rs Framework." },
  archetypes: { title: 'Systems Archetypes', body: 'A reference gallery of classic systems traps — what to watch for, and where to intervene.' },
};

function helpFor(screen: Screen, step: number, sysTab: string): { title: string; body: string } {
  if (screen === 'workspace') {
    return { title: `Step ${step} of 5`, body: stepHelp[step] ?? '' };
  }
  if (screen === 'systems') {
    return systemsHelp[sysTab] ?? { title: 'Systems maps', body: 'Understand the system your idea lives in before you test it.' };
  }
  return { title: titles[screen][0], body: screenHelp[screen] };
}

export function TopBar() {
  const { screen, concepts, activeConceptId, createConcept, step, sysTab } = useAppState();
  const active = concepts.find(c => c.id === activeConceptId);
  const [title, sub] = screen === 'workspace'
    ? ['Guided Workflow', active ? `${active.name} · move through the five steps` : 'Move through the five steps']
    : titles[screen];
  const help = helpFor(screen, step, sysTab);

  return (
    <header style={{ flex: '0 0 auto', height: 64, background: '#fff', borderBottom: '1px solid #e3e6ea', display: 'flex', alignItems: 'center', gap: 16, padding: '0 26px' }}>
      <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 9 }}>
        <div>
          <div style={{ fontSize: 16.5, fontWeight: 700, letterSpacing: '-.01em', color: '#2c2e35' }}>{title}</div>
          <div style={{ fontSize: 12, color: '#83878f', fontWeight: 500 }}>{sub}</div>
        </div>
        <HelpButton title={help.title}>{help.body}</HelpButton>
      </div>
      <div className="fb-topbar-search" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 9, background: '#f1f3f6', border: '1px solid #e3e6ea', borderRadius: 10, padding: '8px 12px', width: 230 }}>
        <MagnifyingGlass size={16} color="#9b9c9f" />
        <input placeholder="Search concepts, tests…" style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: '#2c2e35', width: '100%' }} />
      </div>
      <button
        onClick={() => window.print()}
        className="fb-hover fb-hover-bg"
        style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#fff', border: '1px solid #e3e6ea', borderRadius: 10, padding: '9px 13px', fontSize: 12.5, fontWeight: 600, color: '#5b5f67', cursor: 'pointer', whiteSpace: 'nowrap' }}
      >
        <Printer size={16} /> Export PDF
      </button>
      <button
        className="fb-btn-primary"
        onClick={() => createConcept()}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#008ecd', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 15px', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,142,205,.35)', whiteSpace: 'nowrap' }}
      >
        <Plus size={15} weight="bold" /> New concept
      </button>
    </header>
  );
}
