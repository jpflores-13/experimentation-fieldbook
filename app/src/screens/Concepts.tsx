import { Plus, CaretRight, SneakerMove, HandWaving, CompassTool, FirstAid, Lightning, Users } from '@phosphor-icons/react';
import { useAppState } from '../state/AppState';
import { concepts } from '../data/seed';
import { Card, SectionEyebrow } from '../components/ui';

const iconMap: Record<string, React.ElementType> = { SneakerMove, HandWaving, CompassTool, FirstAid, Lightning, Users };
const accentBg: Record<string, string> = { blue: '#eef7fc', teal: '#eef6f3', slate: '#f1f3f6' };
const accentFg: Record<string, string> = { blue: '#0073a8', teal: '#2ea38e', slate: '#5b6b7a' };
const dotColor: Record<string, string> = { blue: '#0073a8', teal: '#2ea38e', slate: '#5b6b7a' };

export function Concepts() {
  const { go } = useAppState();

  return (
    <div className="fb-screen" style={{ maxWidth: 1240, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <SectionEyebrow step={1}>Step 1 · Frame a testable idea</SectionEyebrow>
          <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, letterSpacing: '-.01em' }}>Concept portfolio</h2>
          <p className="serif" style={{ margin: 0, fontSize: 13.5, color: '#5e6168', maxWidth: 560, lineHeight: 1.5 }}>
            Map your ideas by the value they create and the effort to execute, then move a balanced portfolio into testing. <span style={{ fontStyle: 'italic' }}>Don't put all your eggs in one basket.</span>
          </p>
        </div>
        <button onClick={() => go('workspace')} className="fb-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0073a8', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 15px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={14} weight="bold" /> New concept
        </button>
      </div>

      <div className="fb-grid2" style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 18 }}>
        {/* MATRIX */}
        <Card style={{ padding: '20px 22px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 700 }}>Value / Effort Matrix</h3>
            <span style={{ fontSize: 11, color: '#767676' }}>Template 2</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#83878f', writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '.06em' }}>HIGH VALUE</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#0073a8', writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '.1em' }}>VALUE</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#83878f', writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '.06em' }}>LOW VALUE</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ position: 'relative', width: '100%', paddingTop: '92%', border: '1px solid #e3e6ea', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }}>
                  <div style={{ background: '#eef7fc', borderRight: '1px dashed #cdd6dc', borderBottom: '1px dashed #cdd6dc', display: 'flex', alignItems: 'flex-start', padding: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#0079b0', background: '#fff', borderRadius: 6, padding: '2px 7px', boxShadow: '0 1px 3px rgba(0,0,0,.05)' }}>QUICK WINS</span>
                  </div>
                  <div style={{ borderBottom: '1px dashed #cdd6dc', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#5b6b7a' }}>STRATEGIC BETS</span>
                  </div>
                  <div style={{ borderRight: '1px dashed #cdd6dc', display: 'flex', alignItems: 'flex-end', padding: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#b0b3b8' }}>FILL-INS</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#b0b3b8' }}>AVOID</span>
                  </div>
                </div>
                {concepts.map(c => {
                  const Icon = iconMap[c.icon];
                  const top = 100 - c.value;
                  const left = c.effort;
                  const isTop = c.id === 'easykicks';
                  return (
                    <div key={c.id} title={c.name} style={{
                      position: 'absolute', top: `${top}%`, left: `${left}%`, transform: 'translate(-50%,-50%)',
                      display: 'flex', alignItems: 'center', gap: 7, background: '#fff',
                      border: `1.5px solid ${isTop ? '#0073a8' : dotColor[c.accent] + '55'}`, borderRadius: 22,
                      padding: '4px 10px 4px 5px', boxShadow: isTop ? '0 3px 10px rgba(0,142,205,.18)' : '0 2px 8px rgba(0,0,0,.06)',
                      cursor: 'grab', whiteSpace: 'nowrap',
                    }}>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', background: dotColor[c.accent], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={10} weight="fill" color="#fff" />
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700 }}>{c.name.split(' ').slice(0, 2).join(' ')}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 7, padding: '0 2px' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#83878f', letterSpacing: '.06em' }}>EASY TO EXECUTE</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#0073a8', letterSpacing: '.1em' }}>EFFORT</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#83878f', letterSpacing: '.06em' }}>HARD TO EXECUTE</span>
              </div>
            </div>
          </div>
        </Card>

        {/* LIST */}
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 700 }}>All concepts</h3>
            <span style={{ fontSize: 11.5, color: '#767676', fontWeight: 600 }}>{concepts.length} total</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {concepts.map(c => {
              const Icon = iconMap[c.icon];
              return (
                <div key={c.id} onClick={() => go('workspace')} className="fb-hover fb-hover-tint" style={{ display: 'flex', alignItems: 'center', gap: 11, border: '1px solid #e7eaee', borderRadius: 11, padding: '11px 12px', cursor: 'pointer', opacity: c.shelved ? 0.7 : 1 }}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: accentBg[c.accent], display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                    <Icon size={16} color={accentFg[c.accent]} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: '#767676' }}>{c.statusLine}</div>
                  </div>
                  <CaretRight color="#c9cbce" />
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
