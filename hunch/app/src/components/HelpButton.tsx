import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Question } from '@phosphor-icons/react';

export function HelpButton({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div ref={ref} className="no-print" style={{ position: 'relative', flex: '0 0 auto' }}>
      <button
        onClick={() => setOpen(o => !o)}
        title="What is this page?"
        style={{
          width: 24, height: 24, borderRadius: '50%', flex: '0 0 auto',
          border: `1px solid ${open ? '#008ecd' : '#cfe8f6'}`, background: open ? '#008ecd' : '#eef7fc', color: open ? '#fff' : '#0079b0',
          fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Question size={13} weight="bold" />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 30, left: 0, zIndex: 40, width: 'min(280px, calc(100vw - 48px))', background: '#fff', border: '1px solid #e3e6ea', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,.16)', padding: '14px 16px' }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6, color: '#2c2e35' }}>{title}</div>
          <div style={{ fontSize: 12, color: '#5b5f67', lineHeight: 1.5 }}>{children}</div>
        </div>
      )}
    </div>
  );
}
