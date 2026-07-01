import {
  Flask, SquaresFour, Stack, Compass, TestTube, ListChecks, UsersThree,
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

  const NavButton = ({ item }: { item: (typeof workspaceItems)[number] }) => {
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
        </span>
      </button>
    );
  };

  return (
    <aside className="fb-sidebar" style={{ width: 248, flex: '0 0 auto', background: '#2c2e35', display: 'flex', flexDirection: 'column', color: '#c8cace', zIndex: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '22px 20px 18px' }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: '#008ecd', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
          <Flask size={20} weight="fill" color="#fff" />
        </div>
        <div className="fb-brandtext" style={{ lineHeight: 1.1 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: '#fff', letterSpacing: '-.01em' }}>Field Book</div>
          <div style={{ fontSize: 11, color: '#7e828b', fontWeight: 500 }}>Experimentation OS</div>
        </div>
      </div>

      <div style={{ padding: '6px 12px 2px', fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6c707a', fontWeight: 600 }}>Workspace</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '6px 12px' }}>
        {workspaceItems.map(item => <NavButton key={item.screen} item={item} />)}
      </nav>

      <div style={{ padding: '14px 12px 2px', fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6c707a', fontWeight: 600 }}>Team</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '6px 12px' }}>
        <NavButton item={{ screen: 'team', label: 'Members & Activity', icon: UsersThree }} />
      </nav>

      <div style={{ marginTop: 'auto', padding: 14 }}>
        <div className="fb-teamcard" style={{ background: '#34373f', border: '1px solid #41454e', borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 11, color: '#8a8e97', fontWeight: 600, marginBottom: 8 }}>PEER INSIGHT LAB</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {[
              { i: 'MA', bg: '#008ecd' },
              { i: 'JR', bg: '#2ea38e' },
              { i: 'TK', bg: '#5b6b7a' },
            ].map((a, idx) => (
              <span key={a.i} style={{ width: 26, height: 26, borderRadius: '50%', background: a.bg, color: '#fff', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #34373f', marginLeft: idx ? -8 : 0 }}>{a.i}</span>
            ))}
            <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#454953', color: '#c8cace', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #34373f', marginLeft: -8 }}>+4</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
