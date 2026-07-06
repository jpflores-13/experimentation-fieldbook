import type { CSSProperties, ReactNode } from 'react';

export function Card({ children, style, className, onClick }: { children: ReactNode; style?: CSSProperties; className?: string; onClick?: () => void }) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{ background: '#fff', border: '1px solid #e3e6ea', borderRadius: 16, ...style }}
    >
      {children}
    </div>
  );
}

export function Avatar({ initials, color, size = 26, style }: { initials: string; color: string; size?: number; style?: CSSProperties }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%', background: color, color: '#fff',
      fontSize: size * 0.38, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flex: '0 0 auto', ...style,
    }}>
      {initials}
    </span>
  );
}

export function Chip({ children, color = '#0079b0', bg = '#eef7fc', border = '#cfe8f6', style }: { children: ReactNode; color?: string; bg?: string; border?: string; style?: CSSProperties }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color, background: bg, border: `1px solid ${border}`, padding: '2px 9px', borderRadius: 20, flex: '0 0 auto', ...style }}>
      {children}
    </span>
  );
}

export function SegmentBar({ segments }: { segments: (0 | 0.5 | 1)[] }) {
  const colorFor = (v: 0 | 0.5 | 1) => (v === 1 ? '#0073a8' : v === 0.5 ? '#7cc4e6' : '#e7eaee');
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {segments.map((s, i) => (
        <span key={i} style={{ flex: 1, height: 5, borderRadius: 4, background: colorFor(s) }} />
      ))}
    </div>
  );
}

export function ThinBar({ value, color = '#0073a8', track = '#eef1f4', height = 5 }: { value: number; color?: string; track?: string; height?: number }) {
  return (
    <div style={{ height, background: track, borderRadius: 4, overflow: 'hidden' }}>
      <span style={{ display: 'block', height: '100%', width: `${value}%`, background: color, borderRadius: 4 }} />
    </div>
  );
}

export function SectionEyebrow({ step, children }: { step: number; children: ReactNode }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 600, color: '#0079b0', background: '#eef7fc', border: '1px solid #cfe8f6', borderRadius: 20, padding: '4px 11px', marginBottom: 9 }}>
      <span style={{ width: 18, height: 18, borderRadius: 6, background: '#0073a8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{step}</span>
      {children}
    </div>
  );
}

export function TemplateTag({ children }: { children: ReactNode }) {
  return <span style={{ fontSize: 11, color: '#767676' }}>{children}</span>;
}
