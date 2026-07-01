import { SupportMapTab, FeedbackLoopsTab, FiveRsTab } from './Systems';

const titles: Record<string, string> = {
  support: 'System Support Map',
  loops: 'Feedback Loops',
  fiveRs: '5Rs System Diagnostic',
};

export function Popout({ tool }: { tool: string }) {
  const title = titles[tool] ?? 'Systems maps';
  return (
    <div style={{ minHeight: '100vh', background: '#eef1f4', padding: '20px 24px 40px' }}>
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <img src="/scintilla-icon.svg" width={26} height={26} alt="" />
        <span style={{ fontFamily: "'Work Sans',sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: '-.03em' }}>scintilla</span>
        <span style={{ fontSize: 13, color: '#9b9c9f' }}>· {title} · pop-out</span>
        <button
          onClick={() => window.print()}
          className="fb-hover fb-hover-bg"
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7, background: '#fff', border: '1px solid #e3e6ea', borderRadius: 10, padding: '9px 13px', fontSize: 12.5, fontWeight: 600, color: '#5b5f67', cursor: 'pointer' }}
        >
          Export PDF
        </button>
      </div>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        {tool === 'support' && <SupportMapTab />}
        {tool === 'loops' && <FeedbackLoopsTab />}
        {tool === 'fiveRs' && <FiveRsTab />}
      </div>
    </div>
  );
}
