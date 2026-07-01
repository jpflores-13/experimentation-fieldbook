import {
  SquaresFour, Stack, Compass, TestTube, ListChecks, Graph,
} from '@phosphor-icons/react';
import { useAppState } from '../state/AppState';
import type { Screen } from '../types';

const workspaceItems: { screen: Screen; label: string; icon: React.ElementType; badge?: string }[] = [
  { screen: 'dashboard', label: 'Dashboard', icon: SquaresFour },
  { screen: 'concepts', label: 'Concepts', icon: Stack, badge: '6' },
  { screen: 'workspace', label: 'Guided Workflow', icon: Compass },
  { screen: 'tests', label: 'Tests', icon: TestTube },
  { screen: 'progress', label: 'Progress', icon: ListChecks },
];

export function Sidebar() {
  const { screen, go } = useAppState();

  const NavButton = ({ item, newBadge }: { item: (typeof workspaceItems)[number] & { newBadge?: boolean }; newBadge?: boolean }) => {
    const active = screen === item.screen;
    const Icon = item.icon;
    return (
      <button
        className={`fb-navitem${active ? ' active' : ''}`}
        onClick={() => go(item.screen)}
        style={{
          position: 'relative', display: 'flex', alignItems: 'center', gap: 12, width: '100%',
          border: 'none', background: active ? '#008ecd' : 'transparent', color: 'inherit',
          padding: '9px 12px', borderRadius: 9, cursor: 'pointer', fontSize: 13.5, fontWeight: 500, textAlign: 'left',
        }}
      >
        <Icon size={19} weight="regular" style={{ position: 'relative', zIndex: 1, flex: '0 0 auto' }} />
        <span className="fb-navlabel" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
          {item.label}
          {item.badge && (
            <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, background: '#454953', color: '#c8cace', padding: '1px 7px', borderRadius: 20 }}>
              {item.badge}
            </span>
          )}
          {newBadge && (
            <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, background: '#2ea38e', color: '#fff', padding: '1px 6px', borderRadius: 20 }}>
              NEW
            </span>
          )}
        </span>
      </button>
    );
  };

  return (
    <aside className="fb-sidebar" style={{ width: 248, flex: '0 0 auto', background: '#2c2e35', display: 'flex', flexDirection: 'column', color: '#c8cace', zIndex: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '22px 20px 18px' }}>
        <img src="/scintilla-icon.svg" width={34} height={34} alt="" style={{ flex: '0 0 auto' }} />
        <div className="fb-brandtext" style={{ lineHeight: 1.1 }}>
          <div style={{ fontFamily: "'Work Sans',sans-serif", fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-.03em' }}>scintilla</div>
          <div style={{ fontSize: 11, color: '#7e828b', fontWeight: 500 }}>Test any idea</div>
        </div>
      </div>

      <div style={{ padding: '6px 12px 2px', fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6c707a', fontWeight: 600 }}>Workspace</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '6px 12px' }}>
        {workspaceItems.map(item => <NavButton key={item.screen} item={item} />)}
      </nav>

      <div style={{ padding: '14px 12px 2px', fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6c707a', fontWeight: 600 }}>Systems</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '6px 12px' }}>
        <NavButton item={{ screen: 'systems', label: 'Systems maps', icon: Graph }} newBadge />
      </nav>
    </aside>
  );
}
