import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden', background: '#eef1f4' }}>
      <Sidebar />
      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <TopBar />
        <main className="fb-pad" style={{ flex: '1 1 auto', overflowY: 'auto', padding: '26px 30px 60px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
