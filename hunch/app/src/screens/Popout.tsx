import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Image } from '@phosphor-icons/react';
import { SupportMapTab, FeedbackLoopsTab, FiveRsTab } from './Systems';
import { ValueEffortMatrix } from './Concepts';

const titles: Record<string, string> = {
  support: 'System Support Map',
  loops: 'Feedback Loops',
  fiveRs: '5Rs System Diagnostic',
  matrix: 'Value / Effort Matrix',
};

export function Popout({ tool }: { tool: string }) {
  const title = titles[tool] ?? 'Systems maps';
  const captureRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const exportPng = async () => {
    if (!captureRef.current || exporting) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(captureRef.current, { backgroundColor: '#eef1f4', pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `scintilla-${tool}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#eef1f4', padding: '20px 24px 40px' }}>
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <img src="/scintilla-icon.svg" width={26} height={26} alt="" />
        <span style={{ fontFamily: "'Work Sans',sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: '-.03em' }}>scintilla</span>
        <span style={{ fontSize: 13, color: '#9b9c9f' }}>· {title} · pop-out</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button
            onClick={exportPng}
            disabled={exporting}
            className="fb-hover fb-hover-bg"
            style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#fff', border: '1px solid #e3e6ea', borderRadius: 10, padding: '9px 13px', fontSize: 12.5, fontWeight: 600, color: '#5b5f67', cursor: exporting ? 'default' : 'pointer', opacity: exporting ? .6 : 1 }}
          >
            <Image size={15} /> {exporting ? 'Exporting…' : 'Export PNG'}
          </button>
          <button
            onClick={() => window.print()}
            className="fb-hover fb-hover-bg"
            style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#fff', border: '1px solid #e3e6ea', borderRadius: 10, padding: '9px 13px', fontSize: 12.5, fontWeight: 600, color: '#5b5f67', cursor: 'pointer' }}
          >
            Export PDF
          </button>
        </div>
      </div>
      <div ref={captureRef} style={{ maxWidth: 1180, margin: '0 auto' }}>
        {tool === 'support' && <SupportMapTab />}
        {tool === 'loops' && <FeedbackLoopsTab />}
        {tool === 'fiveRs' && <FiveRsTab />}
        {tool === 'matrix' && <ValueEffortMatrix />}
      </div>
    </div>
  );
}
