import { SneakerMove, Check } from '@phosphor-icons/react';
import { concepts } from '../data/seed';
import { Card, SegmentBar } from '../components/ui';

const milestones = [
  { n: 1, title: 'Step 1 · Framed a testable idea', detail: 'Concept snapshot ✓ · Value/Effort ✓ · Storyboard ✓', state: 'done' as const },
  { n: 2, title: 'Step 2 · Defined evidence', detail: 'Assumptions surfaced ✓ · Prioritized ✓ · Targets set ✓', state: 'done' as const },
  { n: 3, title: 'Step 3 · Selected the test', detail: 'Data sort ✓ · Say/Do ✓ · Simulation chosen ✓', state: 'done' as const },
  { n: 4, title: 'Step 4 · Building the prototype', detail: 'Format selected · research guide underway', state: 'current' as const },
  { n: 5, title: 'Step 5 · Execute, analyze, iterate', detail: 'Not started', state: 'future' as const },
];

const otherConcepts = [
  { id: 'welcome-host', label: 'Welcome Host · analyzing trial 2' },
  { id: 'career-navigator', label: 'Career Navigator · designing test' },
  { id: 'er-fast-track', label: 'ER Fast-Track · surfacing assumptions' },
];

export function Progress() {
  return (
    <div className="fb-screen" style={{ maxWidth: 980, margin: '0 auto' }}>
      <Card style={{ padding: '24px 26px', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 6 }}>
          <span style={{ width: 34, height: 34, borderRadius: 9, background: '#eef7fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SneakerMove size={18} weight="fill" color="#008ecd" />
          </span>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Easykicks · Progress Tracker</h3>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#767676' }}>Template 1</span>
        </div>
        <p className="serif" style={{ margin: '0 0 20px', fontSize: 13, color: '#5e6168', fontStyle: 'italic' }}>One full cycle of testing, milestone by milestone.</p>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {milestones.map((m, i) => (
            <div key={m.n} style={{ display: 'flex', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{
                  width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
                  background: m.state === 'done' ? '#2ea38e' : m.state === 'current' ? '#008ecd' : '#eef1f4',
                  border: m.state === 'future' ? '1.5px solid #d8d9da' : 'none',
                  boxShadow: m.state === 'current' ? '0 0 0 4px #dcefff' : 'none',
                }}>
                  {m.state === 'done' ? <Check size={15} weight="bold" color="#fff" /> : (
                    <span style={{ color: m.state === 'current' ? '#fff' : '#767676', fontSize: 13, fontWeight: 700 }}>{m.n}</span>
                  )}
                </span>
                {i < milestones.length - 1 && (
                  <span style={{ flex: 1, width: 2, background: m.state === 'done' ? '#2ea38e' : '#e3e6ea', margin: '2px 0' }} />
                )}
              </div>
              <div style={{ paddingBottom: i < milestones.length - 1 ? 20 : 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: m.state === 'current' ? '#0079b0' : m.state === 'future' ? '#767676' : undefined }}>
                  {m.title}
                  {m.state === 'current' && <span style={{ fontSize: 10.5, fontWeight: 700, background: '#eef7fc', color: '#0079b0', padding: '2px 8px', borderRadius: 20, marginLeft: 4 }}>IN PROGRESS</span>}
                </div>
                <div style={{ fontSize: 12, color: m.state === 'future' ? '#b0b3b8' : '#83878f', marginTop: 2 }}>{m.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="fb-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {otherConcepts.map(oc => {
          const c = concepts.find(x => x.id === oc.id)!;
          return (
            <Card key={oc.id} style={{ padding: 16, borderRadius: 14 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>{c.name}</div>
              <div style={{ marginBottom: 8 }}><SegmentBar segments={c.segments} /></div>
              <div style={{ fontSize: 11, color: '#767676' }}>{oc.label}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
