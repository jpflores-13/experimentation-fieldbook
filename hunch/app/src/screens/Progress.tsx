import { Lightbulb, Check } from '@phosphor-icons/react';
import { useAppState } from '../state/AppState';
import { Card, SegmentBar } from '../components/ui';

const milestoneMeta = [
  { n: 1, title: 'Step 1 · Framed a testable idea', detail: 'Concept snapshot · Value/Effort · Storyboard' },
  { n: 2, title: 'Step 2 · Defined evidence', detail: 'Assumptions surfaced · Prioritized · Targets set' },
  { n: 3, title: 'Step 3 · Selected the test', detail: 'Data sort · Say/Do · Test type chosen' },
  { n: 4, title: 'Step 4 · Building the prototype', detail: 'Format selected · research guide underway' },
  { n: 5, title: 'Step 5 · Execute, analyze, iterate', detail: 'Audit · live status · results' },
] as const;

export function Progress() {
  const { concepts, activeConceptId } = useAppState();
  const active = concepts.find(c => c.id === activeConceptId) ?? concepts[0];
  const others = concepts.filter(c => c.id !== active?.id).slice(0, 3);

  if (!active) {
    return <div className="fb-screen" style={{ maxWidth: 980, margin: '80px auto 0', textAlign: 'center', color: '#9b9c9f' }}>No concepts yet — create one from the Concepts screen.</div>;
  }

  return (
    <div className="fb-screen" style={{ maxWidth: 980, margin: '0 auto' }}>
      <Card style={{ padding: '24px 26px', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 6 }}>
          <span style={{ width: 34, height: 34, borderRadius: 9, background: '#eef7fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lightbulb size={18} weight="fill" color="#008ecd" />
          </span>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{active.name} · Progress Tracker</h3>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9b9c9f' }}>Template 1</span>
        </div>
        <p className="serif" style={{ margin: '0 0 20px', fontSize: 13, color: '#6b6e76', fontStyle: 'italic' }}>One full cycle of testing, milestone by milestone.</p>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {milestoneMeta.map((m, i) => {
            const state: 'done' | 'current' | 'future' = m.n < active.step ? 'done' : m.n === active.step ? 'current' : 'future';
            return (
              <div key={m.n} style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{
                    width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
                    background: state === 'done' ? '#2ea38e' : state === 'current' ? '#008ecd' : '#eef1f4',
                    border: state === 'future' ? '1.5px solid #d8d9da' : 'none',
                    boxShadow: state === 'current' ? '0 0 0 4px #dcefff' : 'none',
                  }}>
                    {state === 'done' ? <Check size={15} weight="bold" color="#fff" /> : (
                      <span style={{ color: state === 'current' ? '#fff' : '#9b9c9f', fontSize: 13, fontWeight: 700 }}>{m.n}</span>
                    )}
                  </span>
                  {i < milestoneMeta.length - 1 && (
                    <span style={{ flex: 1, width: 2, background: state === 'done' ? '#2ea38e' : '#e3e6ea', margin: '2px 0' }} />
                  )}
                </div>
                <div style={{ paddingBottom: i < milestoneMeta.length - 1 ? 20 : 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: state === 'current' ? '#0079b0' : state === 'future' ? '#9b9c9f' : undefined }}>
                    {m.title}
                    {state === 'current' && <span style={{ fontSize: 10.5, fontWeight: 700, background: '#eef7fc', color: '#0079b0', padding: '2px 8px', borderRadius: 20, marginLeft: 4 }}>IN PROGRESS</span>}
                  </div>
                  <div style={{ fontSize: 12, color: state === 'future' ? '#b0b3b8' : '#83878f', marginTop: 2 }}>{state === 'future' ? 'Not started' : m.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="fb-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {others.map(c => (
          <Card key={c.id} style={{ padding: 16, borderRadius: 14 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>{c.name}</div>
            <div style={{ marginBottom: 8 }}><SegmentBar segments={c.segments} /></div>
            <div style={{ fontSize: 11, color: '#9b9c9f' }}>{c.stepLabel}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
