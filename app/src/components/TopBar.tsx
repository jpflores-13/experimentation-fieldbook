import { MagnifyingGlass, Bell, Plus } from '@phosphor-icons/react';
import { useAppState } from '../state/AppState';
import type { Screen } from '../types';

const titles: Record<Screen, [string, string]> = {
  dashboard: ['Dashboard', 'Your experimentation portfolio at a glance'],
  concepts: ['Concepts', 'Prioritize and frame your testable ideas — Step 1'],
  workspace: ['Guided Workflow', 'Easykicks · move through the five steps'],
  tests: ['Tests', 'Every test across your concepts — Test Digest & results'],
  progress: ['Progress Tracker', 'Milestones across all five steps'],
  team: ['Members & Activity', 'Owners, comments, and the testing journey'],
};

export function TopBar() {
  const { screen, go } = useAppState();
  const [title, sub] = titles[screen];

  return (
    <header style={{ flex: '0 0 auto', height: 64, background: '#fff', borderBottom: '1px solid #e3e6ea', display: 'flex', alignItems: 'center', gap: 16, padding: '0 26px' }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 16.5, fontWeight: 700, letterSpacing: '-.01em', color: '#2c2e35' }}>{title}</div>
        <div style={{ fontSize: 12, color: '#83878f', fontWeight: 500 }}>{sub}</div>
      </div>
      <div className="fb-topbar-search" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 9, background: '#f1f3f6', border: '1px solid #e3e6ea', borderRadius: 10, padding: '8px 12px', width: 230 }}>
        <MagnifyingGlass size={16} color="#9b9c9f" />
        <input placeholder="Search concepts, tests…" style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: '#2c2e35', width: '100%' }} />
      </div>
      <button className="fb-hover fb-hover-bg" style={{ position: 'relative', width: 40, height: 40, borderRadius: 10, border: '1px solid #e3e6ea', background: '#fff', cursor: 'pointer', color: '#5b5f67' }}>
        <Bell size={18} style={{ display: 'block', margin: '0 auto' }} />
        <span style={{ position: 'absolute', top: 9, right: 10, width: 7, height: 7, borderRadius: '50%', background: '#008ecd', border: '1.5px solid #fff' }} />
      </button>
      <button
        className="fb-btn-primary"
        onClick={() => go('workspace')}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#008ecd', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 15px', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,142,205,.35)', whiteSpace: 'nowrap' }}
      >
        <Plus size={15} weight="bold" /> New concept
      </button>
    </header>
  );
}
