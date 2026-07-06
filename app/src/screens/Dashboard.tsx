import {
  Stack, TestTube, ListChecks, SealCheck, ArrowUp, ArrowRight, DotsThree, Funnel, ChartBar,
  SneakerMove, HandWaving, CompassTool, FirstAid, Lightning, Users,
} from '@phosphor-icons/react';
import { useAppState } from '../state/AppState';
import { concepts, memberById, tasks, activity } from '../data/seed';
import { Avatar, Card, Chip, SegmentBar, ThinBar } from '../components/ui';
import type { HomeVariant } from '../types';

const iconMap: Record<string, React.ElementType> = { SneakerMove, HandWaving, CompassTool, FirstAid, Lightning, Users };
const accentBg: Record<string, string> = { blue: '#eef7fc', teal: '#eef6f3', slate: '#f1f3f6' };
const accentFg: Record<string, string> = { blue: '#0073a8', teal: '#2ea38e', slate: '#5b6b7a' };
const chipStyle: Record<string, { color: string; bg: string; border: string }> = {
  blue: { color: '#0079b0', bg: '#eef7fc', border: '#cfe8f6' },
  teal: { color: '#25826f', bg: '#eef6f3', border: '#cfe9e2' },
  slate: { color: '#5b6b7a', bg: '#f1f3f6', border: '#e0e3e7' },
};

export function Dashboard() {
  const { home, setHome, go } = useAppState();

  const toggle = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
      <div className="serif" style={{ fontSize: 13, color: '#5e6168', fontStyle: 'italic' }}>Dashboard home — explore 3 layout directions:</div>
      <div style={{ display: 'inline-flex', background: '#fff', border: '1px solid #e3e6ea', borderRadius: 10, padding: 3, gap: 2 }}>
        {(['a', 'b', 'c'] as HomeVariant[]).map(v => {
          const labels: Record<HomeVariant, string> = { a: 'A · Mission control', b: 'B · Pipeline', c: 'C · Editorial' };
          const active = home === v;
          return (
            <button
              key={v}
              onClick={() => setHome(v)}
              style={{
                position: 'relative', border: 'none', background: active ? '#eef7fc' : 'transparent',
                padding: '6px 13px', borderRadius: 7, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                color: active ? '#0079b0' : '#5b5f67', boxShadow: active ? 'inset 0 0 0 1px #b9def0' : 'none',
              }}
            >
              {labels[v]}
            </button>
          );
        })}
      </div>
      <span style={{ fontSize: 11.5, color: '#767676', background: '#fff', border: '1px solid #e3e6ea', borderRadius: 20, padding: '3px 10px' }}>id 1a / 1b / 1c</span>
    </div>
  );

  return (
    <div className="fb-screen" style={{ maxWidth: 1240, margin: '0 auto' }}>
      {toggle}
      {home === 'a' && <VariantA />}
      {home === 'b' && <VariantB />}
      {home === 'c' && <VariantC />}
    </div>
  );

  function VariantA() {
    return (
      <div className="fb-screen">
        <div className="fb-grid4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
          <Card style={{ padding: '17px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#83878f' }}>Active concepts</span>
              <Stack size={17} color="#0073a8" />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.02em' }}>6</div>
            <div style={{ fontSize: 11.5, color: '#2ea38e', fontWeight: 600, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}><ArrowUp size={11} weight="bold" /> 2 added this sprint</div>
          </Card>
          <Card style={{ padding: '17px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#83878f' }}>Tests running</span>
              <TestTube size={17} color="#0073a8" />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.02em' }}>3</div>
            <div style={{ fontSize: 11.5, color: '#83878f', fontWeight: 500, marginTop: 3 }}>2 in field · 1 pretest</div>
          </Card>
          <Card style={{ padding: '17px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#83878f' }}>Assumptions tested</span>
              <ListChecks size={17} color="#0073a8" />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.02em' }}>24<span style={{ fontSize: 16, color: '#bcbfc4', fontWeight: 600 }}>/41</span></div>
            <div style={{ marginTop: 8 }}><ThinBar value={59} /></div>
          </Card>
          <Card style={{ padding: '17px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#83878f' }}>Validated</span>
              <SealCheck size={17} weight="fill" color="#2ea38e" />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.02em' }}>2</div>
            <div style={{ fontSize: 11.5, color: '#83878f', fontWeight: 500, marginTop: 3 }}>moved to build</div>
          </Card>
        </div>

        <div className="fb-grid2" style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 18 }}>
          <Card style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Concept portfolio</h3>
              <button onClick={() => go('concepts')} className="fb-link" style={{ border: 'none', background: 'transparent', color: '#0079b0', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                Value / Effort matrix <ArrowRight size={12} weight="bold" />
              </button>
            </div>
            <p className="serif" style={{ margin: '0 0 16px', fontSize: 12.5, color: '#83878f', fontStyle: 'italic' }}>Each concept moves through the five steps. Owners shown at right.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {concepts.filter(c => !c.shelved).map(c => {
                const Icon = iconMap[c.icon];
                const owner = memberById(c.ownerId);
                const cs = chipStyle[c.accent];
                return (
                  <div key={c.id} onClick={() => go('workspace')} className="fb-hover fb-hover-row" style={{ border: '1px solid #e7eaee', borderRadius: 12, padding: '13px 14px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 11 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: accentBg[c.accent], display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                        <Icon size={18} color={accentFg[c.accent]} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700 }}>{c.name}</div>
                        <div style={{ fontSize: 11.5, color: '#767676' }}>{c.subtitle}</div>
                      </div>
                      <Chip color={cs.color} bg={cs.bg} border={cs.border}>{c.stepLabel}</Chip>
                      <Avatar initials={owner.initials} color={owner.color} />
                    </div>
                    <SegmentBar segments={c.segments} />
                  </div>
                );
              })}
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Card style={{ padding: 19 }}>
              <h3 style={{ margin: '0 0 13px', fontSize: 15, fontWeight: 700 }}>Up next for you</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tasks.map(t => (
                  <div key={t.id} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: 6, flex: '0 0 auto', marginTop: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: t.done ? '#2ea38e' : 'transparent',
                      border: t.done ? 'none' : '1.5px solid #c9cbce',
                    }}>
                      {t.done && <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>✓</span>}
                    </span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: t.done ? '#767676' : undefined, textDecoration: t.done ? 'line-through' : 'none' }}>{t.label}</div>
                      <div style={{ fontSize: 11.5, color: '#767676' }}>{t.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card style={{ padding: 19, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Team activity</h3>
                <DotsThree size={18} color="#767676" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {activity.map(a => {
                  const m = memberById(a.memberId);
                  return (
                    <div key={a.id} style={{ display: 'flex', gap: 11 }}>
                      <Avatar initials={m.initials} color={m.color} size={28} />
                      <div style={{ fontSize: 12.5, color: '#4a4d55', lineHeight: 1.45 }}>
                        <span dangerouslySetInnerHTML={{ __html: a.html.replace(/class="link"/g, 'style="color:#0079b0"') }} />
                        <div style={{ fontSize: 11, color: '#b0b3b8', marginTop: 2 }}>{a.when}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  function VariantB() {
    const cols: { n: number; label: string; step: number; color: string }[] = [
      { n: 1, label: 'Frame idea', step: 1, color: '#2c2e35' },
      { n: 2, label: 'Evidence', step: 2, color: '#2c2e35' },
      { n: 3, label: 'Select test', step: 3, color: '#0073a8' },
      { n: 4, label: 'Prototype', step: 4, color: '#0073a8' },
      { n: 5, label: 'Execute', step: 5, color: '#2ea38e' },
    ];
    return (
      <div className="fb-screen">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#5e6168' }}>Pipeline</span>
          <span style={{ fontSize: 12, color: '#767676' }}>— concepts flowing through the five steps. Drag to advance.</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, background: '#fff', border: '1px solid #e3e6ea', borderRadius: 20, padding: '4px 11px', color: '#5b5f67', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Funnel size={12} /> All owners</span>
            <span style={{ fontSize: 11.5, fontWeight: 600, background: '#fff', border: '1px solid #e3e6ea', borderRadius: 20, padding: '4px 11px', color: '#5b5f67' }}>This quarter</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8 }}>
          {cols.map(col => {
            const items = concepts.filter(c => c.step === col.step);
            return (
              <div key={col.n} style={{ flex: '1 0 218px', minWidth: 218 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
                  <span style={{ width: 22, height: 22, borderRadius: 7, background: col.color, color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{col.n}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700 }}>{col.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: '#767676', fontWeight: 600 }}>{items.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.map(c => {
                    const owner = memberById(c.ownerId);
                    const cs = chipStyle[c.accent];
                    return (
                      <div key={c.id} onClick={() => go('workspace')} className="fb-hover fb-hover-row" style={{ background: '#fff', border: '1px solid #e7eaee', borderRadius: 12, padding: 13, cursor: 'pointer' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: '#767676', marginBottom: 9 }}>{c.subtitle}</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Chip color={cs.color} bg={cs.bg} border="transparent" style={{ border: 'none', padding: '2px 8px', fontSize: 10.5 }}>{c.quadrantLabel}</Chip>
                          <Avatar initials={owner.initials} color={owner.color} size={22} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function VariantC() {
    return (
      <div className="fb-screen">
        <div style={{ background: '#2c2e35', borderRadius: 18, padding: '30px 32px', color: '#fff', position: 'relative', overflow: 'hidden', marginBottom: 18 }}>
          <div style={{ position: 'absolute', right: -40, top: -40, width: 230, height: 230, borderRadius: '50%', background: 'radial-gradient(circle,#0073a8 0%,rgba(0,142,205,0) 70%)', opacity: .5 }} />
          <div style={{ position: 'relative', display: 'flex', gap: 26, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#7fccbb' }}>In the field now · Step 5</span>
              <h2 className="serif" style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-.02em', margin: '8px 0 8px', lineHeight: 1.08 }}>Welcome Host trial<br />is running at 8 stations.</h2>
              <p className="serif" style={{ fontSize: 14.5, color: '#b6b9c0', margin: '0 0 18px', maxWidth: 440, lineHeight: 1.5 }}>Over 13,000 customer interactions logged. Desirability assumptions are holding — the warm-welcome metric is well past threshold.</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button onClick={() => go('workspace')} className="fb-btn-primary" style={{ background: '#0073a8', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 17px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Open workspace</button>
                <button onClick={() => go('tests')} style={{ background: 'rgba(255,255,255,.08)', color: '#fff', border: '1px solid rgba(255,255,255,.18)', borderRadius: 10, padding: '11px 17px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>View results</button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 26 }}>
              <div><div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-.02em' }}>80<span style={{ fontSize: 18, color: '#8a8e97' }}>%</span></div><div style={{ fontSize: 11.5, color: '#8a8e97', maxWidth: 90 }}>staff enjoyed the trial</div></div>
              <div><div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-.02em' }}>62<span style={{ fontSize: 18, color: '#8a8e97' }}>%</span></div><div style={{ fontSize: 11.5, color: '#8a8e97', maxWidth: 90 }}>want to keep the new role</div></div>
            </div>
          </div>
        </div>
        <div className="fb-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          <Card style={{ padding: 19 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 13 }}><ListChecks size={18} color="#0073a8" /><h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>This week</h3></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {tasks.map(t => (
                <div key={t.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: 5, flex: '0 0 auto', marginTop: 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: t.done ? '#2ea38e' : 'transparent', border: t.done ? 'none' : '1.5px solid #c9cbce',
                  }}>{t.done && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}</span>
                  <span style={{ fontSize: 12.5, lineHeight: 1.35, color: t.done ? '#767676' : undefined, textDecoration: t.done ? 'line-through' : 'none' }}>{t.label}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card style={{ padding: 19 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 13 }}><Stack size={18} color="#0073a8" /><h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Portfolio</h3></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {concepts.filter(c => !c.shelved).slice(0, 4).map(c => {
                const cs = chipStyle[c.accent];
                return (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, flex: 1 }}>{c.name}</span>
                    <span style={{ fontSize: 10.5, color: cs.color, background: cs.bg, padding: '1px 7px', borderRadius: 20 }}>Step {c.step}</span>
                  </div>
                );
              })}
              <button onClick={() => go('concepts')} style={{ marginTop: 4, border: 'none', background: 'transparent', color: '#0079b0', fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'left', padding: 0 }}>See all 6 →</button>
            </div>
          </Card>
          <Card style={{ padding: 19 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 13 }}><ChartBar size={18} color="#2ea38e" /><h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Evidence snapshot</h3></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Warm welcome', status: 'past target', color: '#2ea38e', value: 86 },
                { label: 'Self-service uptake', status: 'on track', color: '#0079b0', value: 58 },
                { label: 'Leisure travel promo', status: 'below', color: '#c25a48', value: 14 },
              ].map(row => (
                <div key={row.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{row.label}</span>
                    <span style={{ color: row.color, fontWeight: 700 }}>{row.status}</span>
                  </div>
                  <ThinBar value={row.value} color={row.value < 30 ? '#d98a7c' : row.color === '#0079b0' ? '#0073a8' : row.color} height={6} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }
}
