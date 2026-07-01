import { Plus, CaretRight, Lightbulb, X } from '@phosphor-icons/react';
import { useAppState } from '../state/AppState';
import { Card, SectionEyebrow } from '../components/ui';

const accentBg: Record<string, string> = { blue: '#eef7fc', teal: '#eef6f3', slate: '#f1f3f6' };
const accentFg: Record<string, string> = { blue: '#008ecd', teal: '#2ea38e', slate: '#5b6b7a' };
const dotColor: Record<string, string> = { blue: '#008ecd', teal: '#2ea38e', slate: '#5b6b7a' };

export function Concepts() {
  const { concepts, setActiveConcept, createConcept, deleteConcept, activeConceptId } = useAppState();

  return (
    <div className="fb-screen" style={{ maxWidth: 1240, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <SectionEyebrow step={1}>Step 1 · Frame a testable idea</SectionEyebrow>
          <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, letterSpacing: '-.01em' }}>Concept portfolio</h2>
          <p className="serif" style={{ margin: 0, fontSize: 13.5, color: '#6b6e76', maxWidth: 560, lineHeight: 1.5 }}>
            Map your ideas by the value they create and the effort to execute, then move a balanced portfolio into testing. <span style={{ fontStyle: 'italic' }}>Don't put all your eggs in one basket.</span>
          </p>
        </div>
        <button onClick={() => createConcept()} className="fb-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#008ecd', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 15px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={14} weight="bold" /> New concept
        </button>
      </div>

      <div className="fb-grid2" style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 18 }}>
        {/* MATRIX */}
        <Card style={{ padding: '20px 22px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 700 }}>Value / Effort Matrix</h3>
            <span style={{ fontSize: 11, color: '#9b9c9f' }}>Template 2</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#83878f', writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '.06em' }}>HIGH VALUE</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#008ecd', writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '.1em' }}>VALUE</span>
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
                  const top = 100 - c.value;
                  const left = c.effort;
                  const isActive = c.id === activeConceptId;
                  return (
                    <div key={c.id} title={c.name} onClick={() => setActiveConcept(c.id)} style={{
                      position: 'absolute', top: `${top}%`, left: `${left}%`, transform: 'translate(-50%,-50%)',
                      display: 'flex', alignItems: 'center', gap: 7, background: '#fff',
                      border: `1.5px solid ${isActive ? '#008ecd' : dotColor[c.accent] + '55'}`, borderRadius: 22,
                      padding: '4px 10px 4px 5px', boxShadow: isActive ? '0 3px 10px rgba(0,142,205,.18)' : '0 2px 8px rgba(0,0,0,.06)',
                      cursor: 'pointer', whiteSpace: 'nowrap',
                    }}>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', background: dotColor[c.accent], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Lightbulb size={10} weight="fill" color="#fff" />
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700 }}>{c.name.split(' ').slice(0, 2).join(' ')}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 7, padding: '0 2px' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#83878f', letterSpacing: '.06em' }}>EASY TO EXECUTE</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#008ecd', letterSpacing: '.1em' }}>EFFORT</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#83878f', letterSpacing: '.06em' }}>HARD TO EXECUTE</span>
              </div>
            </div>
          </div>
        </Card>

        {/* LIST */}
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 700 }}>All concepts</h3>
            <span style={{ fontSize: 11.5, color: '#9b9c9f', fontWeight: 600 }}>{concepts.length} total</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {concepts.map(c => (
              <div
                key={c.id}
                onClick={() => setActiveConcept(c.id)}
                className="fb-hover fb-hover-tint fb-note"
                style={{ display: 'flex', alignItems: 'center', gap: 11, border: '1px solid #e7eaee', borderRadius: 11, padding: '11px 12px', cursor: 'pointer', opacity: c.shelved ? 0.7 : 1 }}
              >
                <span style={{ width: 30, height: 30, borderRadius: 8, background: accentBg[c.accent], display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  <Lightbulb size={16} color={accentFg[c.accent]} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: '#9b9c9f' }}>{c.statusLine}</div>
                </div>
                <button
                  className="fb-note-delete"
                  onClick={e => { e.stopPropagation(); if (window.confirm(`Delete "${c.name}"? This can't be undone.`)) deleteConcept(c.id); }}
                  title="Delete concept"
                  style={{ border: 'none', background: 'transparent', color: '#b0b3b8', cursor: 'pointer', padding: 4, display: 'flex', flex: '0 0 auto', opacity: 0 }}
                >
                  <X size={14} />
                </button>
                <CaretRight color="#c9cbce" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
