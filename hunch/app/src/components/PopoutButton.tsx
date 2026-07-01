import { ArrowsOutSimple } from '@phosphor-icons/react';

export type PopoutTool = 'support' | 'loops' | 'fiveRs' | 'matrix';

export function openPopout(tool: PopoutTool) {
  const url = new URL(window.location.href);
  url.search = `?popout=${tool}`;
  window.open(url.toString(), `scintilla-popout-${tool}`, 'width=1040,height=760,noopener');
}

export function PopoutButton({ tool }: { tool: PopoutTool }) {
  return (
    <button
      onClick={() => openPopout(tool)}
      className="fb-hover fb-hover-bg"
      title="Open in a new window"
      style={{ border: '1px solid #e3e6ea', background: '#fff', borderRadius: 6, padding: '5px 9px', fontSize: 11.5, fontWeight: 600, color: '#5b5f67', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
    >
      <ArrowsOutSimple size={13} /> Pop out
    </button>
  );
}
