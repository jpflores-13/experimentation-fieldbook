import { useAppState } from '../state/AppState';
import { tests } from '../data/seed';
import { Card } from '../components/ui';

const statusColor: Record<string, string> = { blue: '#008ecd', muted: '#83878f' };
const resultColor: Record<string, string> = { teal: '#25826f', muted: '#9b9c9f', warn: '#c25a48' };

export function Tests() {
  const { go } = useAppState();
  return (
    <div className="fb-screen" style={{ maxWidth: 1180, margin: '0 auto' }}>
      <div className="fb-grid4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        <Card style={{ padding: '15px 17px' }}><div style={{ fontSize: 12, fontWeight: 600, color: '#83878f', marginBottom: 8 }}>Tests run</div><div style={{ fontSize: 24, fontWeight: 700 }}>11</div></Card>
        <Card style={{ padding: '15px 17px' }}><div style={{ fontSize: 12, fontWeight: 600, color: '#83878f', marginBottom: 8 }}>In field now</div><div style={{ fontSize: 24, fontWeight: 700, color: '#008ecd' }}>3</div></Card>
        <Card style={{ padding: '15px 17px' }}><div style={{ fontSize: 12, fontWeight: 600, color: '#83878f', marginBottom: 8 }}>Assumptions passed</div><div style={{ fontSize: 24, fontWeight: 700, color: '#2ea38e' }}>18</div></Card>
        <Card style={{ padding: '15px 17px' }}><div style={{ fontSize: 12, fontWeight: 600, color: '#83878f', marginBottom: 8 }}>Pivots triggered</div><div style={{ fontSize: 24, fontWeight: 700 }}>4</div></Card>
      </div>

      <Card style={{ overflow: 'hidden', overflowX: 'auto', borderRadius: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 14px' }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>All tests</h3>
          <span style={{ fontSize: 11, color: '#9b9c9f' }}>Template 14 · test tracker</span>
        </div>
        <div style={{ minWidth: 800 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '44px 1.4fr 1.1fr .8fr 1fr 1fr', background: '#f6f8fa', borderTop: '1px solid #e3e6ea', borderBottom: '1px solid #e3e6ea', fontSize: 10.5, fontWeight: 700, color: '#83878f', letterSpacing: '.04em' }}>
            <div style={{ padding: '11px 14px' }}>#</div>
            <div style={{ padding: '11px 14px' }}>CONCEPT</div>
            <div style={{ padding: '11px 14px' }}>TEST TYPE</div>
            <div style={{ padding: '11px 14px' }}>SAY/DO</div>
            <div style={{ padding: '11px 14px' }}>STATUS</div>
            <div style={{ padding: '11px 14px' }}>RESULT</div>
          </div>
          {tests.map((t, i) => (
            <div
              key={t.id}
              onClick={() => go('workspace')}
              className="fb-hover fb-hover-bg"
              style={{ display: 'grid', gridTemplateColumns: '44px 1.4fr 1.1fr .8fr 1fr 1fr', borderBottom: i < tests.length - 1 ? '1px solid #eef0f2' : 'none', fontSize: 12.5, cursor: 'pointer', alignItems: 'center' }}
            >
              <div style={{ padding: '12px 14px', color: '#9b9c9f', fontWeight: 700 }}>{t.id}</div>
              <div style={{ padding: '12px 14px', fontWeight: 600 }}>{t.concept}</div>
              <div style={{ padding: '12px 14px' }}>{t.testType}</div>
              <div style={{ padding: '12px 14px' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: t.sayDo === 'Say→Do' || t.sayDo === 'Archival' ? '#5b6b7a' : '#0079b0', background: t.sayDo === 'Say→Do' || t.sayDo === 'Archival' ? '#f1f3f6' : '#eef7fc', padding: '2px 7px', borderRadius: 20 }}>{t.sayDo}</span>
              </div>
              <div style={{ padding: '12px 14px' }}><span style={{ fontSize: 11, fontWeight: 600, color: statusColor[t.statusColor] }}>{t.status}</span></div>
              <div style={{ padding: '12px 14px', color: resultColor[t.resultColor], fontWeight: 600 }}>{t.result}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
