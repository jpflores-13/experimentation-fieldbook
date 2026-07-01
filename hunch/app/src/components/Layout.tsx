import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="fb-app-shell" style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden', background: '#eef1f4' }}>
      <div className="no-print"><Sidebar /></div>
      <div className="fb-app-main" style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <div className="no-print"><TopBar /></div>
        <main className="fb-pad fb-app-content" style={{ flex: '1 1 auto', overflowY: 'auto', padding: '26px 30px 60px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
