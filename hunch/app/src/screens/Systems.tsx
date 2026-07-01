import type { ReactNode } from 'react';
import {
  Graph, Target, ArrowsClockwise, ArrowsCounterClockwise, Shapes, Star, Sparkle, Plus,
  ArrowBendUpRight, PlusCircle, Eye, Sliders, ArrowLeft,
} from '@phosphor-icons/react';
import { useAppState } from '../state/AppState';
import { archetypes, archetypeById, type GlyphSpec } from '../data/archetypes';
import type { SysTab } from '../types';
import { Card } from '../components/ui';

const tabs: { key: SysTab; label: string; icon: React.ElementType }[] = [
  { key: 'support', label: 'System Support Map', icon: Target },
  { key: 'loops', label: 'Feedback Loops', icon: ArrowsClockwise },
  { key: 'archetypes', label: 'Systems Archetypes', icon: Shapes },
];

export function Systems() {
  const { sysTab, setSysTab } = useAppState();

  return (
    <div className="fb-screen" style={{ maxWidth: 1180, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 600, color: '#25826f', background: '#eef6f3', border: '1px solid #cfe9e2', borderRadius: 20, padding: '4px 11px', marginBottom: 9 }}>
            <Graph size={14} weight="fill" /> Systems thinking
          </div>
          <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, letterSpacing: '-.01em' }}>Map the system around your idea</h2>
          <p className="serif" style={{ margin: 0, fontSize: 13.5, color: '#6b6e76', maxWidth: 600, lineHeight: 1.5 }}>
            Before you test, understand the <span style={{ fontStyle: 'italic' }}>system</span> your idea lives in — who it depends on, the feedback loops that drive behaviour, and the classic traps to watch for.
          </p>
        </div>
      </div>

      <div style={{ display: 'inline-flex', background: '#fff', border: '1px solid #e3e6ea', borderRadius: 11, padding: 4, gap: 3, marginBottom: 20, flexWrap: 'wrap' }}>
        {tabs.map(t => {
          const active = sysTab === t.key;
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setSysTab(t.key)}
              style={{
                position: 'relative', border: 'none', background: active ? '#eef7fc' : 'transparent',
                padding: '8px 15px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, color: '#5b5f67', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 7,
                boxShadow: active ? 'inset 0 0 0 1px #cfe8f6' : 'none',
              }}
            >
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>

      {sysTab === 'support' && <SupportMapTab />}
      {sysTab === 'loops' && <FeedbackLoopsTab />}
      {sysTab === 'archetypes' && <ArchetypesTab />}
    </div>
  );
}

function LegendRow({ swatch, border, children }: { swatch: string; border: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <span style={{ width: 16, height: 16, borderRadius: 4, background: swatch, border: `1px solid ${border}`, flex: '0 0 auto' }} />
      <span style={{ fontSize: 12.5 }}>{children}</span>
    </div>
  );
}

function Note({ top, left, bg, border, color, children, icon }: { top: string; left: string; bg: string; border: string; color: string; children: ReactNode; icon?: ReactNode }) {
  return (
    <div style={{
      position: 'absolute', top, left, transform: 'translate(-50%,-50%)', background: bg, border: `1px solid ${border}`,
      borderRadius: 7, padding: '5px 8px', fontSize: 9.5, fontWeight: 600, color, maxWidth: 86, lineHeight: 1.2,
      boxShadow: '0 2px 5px rgba(0,0,0,.06)', display: 'flex', alignItems: 'center', gap: 4,
    }}>
      {icon}{children}
    </div>
  );
}

function SupportMapTab() {
  return (
    <div className="fb-screen fb-grid2" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18 }}>
      <Card style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 700 }}>New-customer onboarding</h3>
          <span style={{ fontSize: 11, color: '#9b9c9f' }}>role-centred map</span>
        </div>
        <div style={{ position: 'relative', width: '100%', maxWidth: 520, margin: '6px auto 0', aspectRatio: '1/1' }}>
          <div style={{ position: 'absolute', inset: '1%', borderRadius: '50%', border: '1.5px solid #a9d4ef', background: 'rgba(191,224,245,.10)' }} />
          <div style={{ position: 'absolute', inset: '16%', borderRadius: '50%', border: '1.5px solid #efb0b0', background: 'rgba(255,194,194,.10)' }} />
          <div style={{ position: 'absolute', inset: '31%', borderRadius: '50%', border: '1.5px solid #eec18a', background: 'rgba(255,214,165,.12)' }} />
          <div style={{
            position: 'absolute', inset: '40%', borderRadius: '50%', background: '#fde6a9', border: '2px solid #ecc65f',
            display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: '0 3px 12px rgba(236,198,95,.3)',
          }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#7a5c11', lineHeight: 1.15 }}>Onboarding<br />Lead</span>
          </div>

          <span style={{ position: 'absolute', top: '2.5%', left: '50%', transform: 'translateX(-50%)', fontSize: 9.5, fontWeight: 700, letterSpacing: '.06em', color: '#4a90c2', background: '#fff', padding: '0 5px' }}>RESOURCES</span>
          <span style={{ position: 'absolute', top: '17%', left: '50%', transform: 'translateX(-50%)', fontSize: 9.5, fontWeight: 700, letterSpacing: '.06em', color: '#cc6b6b', background: '#fff', padding: '0 5px' }}>NEEDS</span>
          <span style={{ position: 'absolute', top: '32%', left: '50%', transform: 'translateX(-50%)', fontSize: 9.5, fontWeight: 700, letterSpacing: '.06em', color: '#c58a3f', background: '#fff', padding: '0 5px' }}>RESPONSIBILITIES</span>

          <Note top="39%" left="26%" bg="#ffd6a5" border="#eab26a" color="#6b4a1e">Run welcome calls</Note>
          <Note top="63%" left="66%" bg="#ffd6a5" border="#eab26a" color="#6b4a1e">Keep help docs current</Note>
          <Note top="22%" left="63%" bg="#ffc2c2" border="#e59595" color="#7a3838">Up-to-date product docs</Note>
          <Note top="74%" left="34%" bg="#ffc2c2" border="#e59595" color="#7a3838">Analytics access</Note>
          <Note top="9%" left="74%" bg="#bfe0f5" border="#86c3e6" color="#204a63" icon={<Star size={10} weight="fill" color="#2ea38e" />}>Help center</Note>
          <Note top="88%" left="20%" bg="#bfe0f5" border="#86c3e6" color="#204a63" icon={<Star size={10} weight="fill" color="#c25a48" />}>Legacy LMS</Note>
          <Note top="2%" left="16%" bg="#c3e8d7" border="#83ccae" color="#245c47" icon={<Sparkle size={9} weight="fill" color="#2ea38e" />}>Self-serve setup</Note>
          <Note top="93%" left="76%" bg="#c3e8d7" border="#83ccae" color="#245c47" icon={<Sparkle size={9} weight="fill" color="#2ea38e" />}>Shared activation dashboard</Note>
        </div>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card style={{ padding: 18, borderRadius: 14 }}>
          <h4 style={{ margin: '0 0 12px', fontSize: 13.5, fontWeight: 700 }}>Legend</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <LegendRow swatch="#fde6a9" border="#ecc65f"><b>Role</b> — you, at the centre</LegendRow>
            <LegendRow swatch="#ffd6a5" border="#eab26a"><b>Responsibilities</b> — what you do</LegendRow>
            <LegendRow swatch="#ffc2c2" border="#e59595"><b>Needs</b> — what each duty requires</LegendRow>
            <LegendRow swatch="#bfe0f5" border="#86c3e6"><b>Resources</b> — what you draw on</LegendRow>
            <LegendRow swatch="#c3e8d7" border="#83ccae"><b>Wishes</b> — what would help</LegendRow>
          </div>
          <div style={{ marginTop: 13, paddingTop: 12, borderTop: '1px solid #eef0f2', display: 'flex', gap: 14 }}>
            <span style={{ fontSize: 11, color: '#5b5f67', display: 'flex', alignItems: 'center', gap: 5 }}><Star size={12} weight="fill" color="#2ea38e" /> helpful</span>
            <span style={{ fontSize: 11, color: '#5b5f67', display: 'flex', alignItems: 'center', gap: 5 }}><Star size={12} weight="fill" color="#83878f" /> neutral</span>
            <span style={{ fontSize: 11, color: '#5b5f67', display: 'flex', alignItems: 'center', gap: 5 }}><Star size={12} weight="fill" color="#c25a48" /> unhelpful</span>
          </div>
        </Card>

        <Card style={{ padding: 18, borderRadius: 14 }}>
          <h4 style={{ margin: '0 0 10px', fontSize: 13.5, fontWeight: 700 }}>Add to the map</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            <button style={{ fontSize: 11.5, fontWeight: 600, color: '#6b4a1e', background: '#fff4e6', border: '1px solid #eab26a', borderRadius: 8, padding: '6px 11px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Plus size={11} /> Responsibility</button>
            <button style={{ fontSize: 11.5, fontWeight: 600, color: '#7a3838', background: '#fff0f0', border: '1px solid #e59595', borderRadius: 8, padding: '6px 11px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Plus size={11} /> Need</button>
            <button style={{ fontSize: 11.5, fontWeight: 600, color: '#204a63', background: '#eef7fc', border: '1px solid #86c3e6', borderRadius: 8, padding: '6px 11px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Plus size={11} /> Resource</button>
            <button style={{ fontSize: 11.5, fontWeight: 600, color: '#245c47', background: '#eef6f3', border: '1px solid #83ccae', borderRadius: 8, padding: '6px 11px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Plus size={11} /> Wish</button>
          </div>
        </Card>

        <div style={{ background: '#2c2e35', borderRadius: 14, padding: 18, color: '#c8cace' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Discussion prompts</div>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, lineHeight: 1.55, color: '#a9adb5' }}>
            <li>Are any responsibilities duplicated or missing?</li>
            <li>Which needs have inadequate resources?</li>
            <li>Which wishes are actually within reach?</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function PolarityChip({ left, top, sign, color }: { left: number; top: number; sign: '+' | '-'; color: 'blue' | 'teal' | 'warn' }) {
  const c = color === 'blue' ? '#008ecd' : color === 'teal' ? '#2ea38e' : '#c25a48';
  const tc = color === 'blue' ? '#0079b0' : color === 'teal' ? '#25826f' : '#c25a48';
  return (
    <span style={{
      position: 'absolute', left, top, transform: 'translate(-50%,-50%)', width: 18, height: 18, borderRadius: '50%',
      background: '#fff', border: `1.5px solid ${c}`, color: tc, fontSize: sign === '+' ? 12 : 13, fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{sign}</span>
  );
}

function LoopBadge({ left, top, kind }: { left: number; top: number; kind: 'R' | 'B' }) {
  const blue = kind === 'R';
  return (
    <div style={{ position: 'absolute', left, top, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, pointerEvents: 'none' }}>
      <span style={{
        width: 34, height: 34, borderRadius: '50%', background: blue ? '#eef7fc' : '#eef6f3', border: `1.5px solid ${blue ? '#008ecd' : '#2ea38e'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: blue ? '#0079b0' : '#25826f',
      }}>
        {blue ? <ArrowsClockwise size={16} weight="bold" /> : <ArrowsCounterClockwise size={16} weight="bold" />}
      </span>
      <span style={{ fontSize: 10, fontWeight: 800, color: blue ? '#0079b0' : '#25826f' }}>{kind}1</span>
    </div>
  );
}

function LoopNode({ left, top, label, tone }: { left: number; top: number; label: string; tone: 'neutral' | 'blue' | 'teal' }) {
  const styles = {
    neutral: { border: '1.5px solid #d4dbe1', color: '#2c2e35', shadow: '0 2px 8px rgba(0,0,0,.07)' },
    blue: { border: '1.5px solid #008ecd', color: '#0d3f57', shadow: '0 3px 10px rgba(0,142,205,.16)' },
    teal: { border: '1.5px solid #2ea38e', color: '#1f5f4e', shadow: '0 3px 10px rgba(46,163,142,.16)' },
  }[tone];
  return (
    <div style={{
      position: 'absolute', left, top, transform: 'translate(-50%,-50%)', background: '#fff', borderRadius: 22,
      padding: '8px 13px', fontSize: 11.5, fontWeight: 700, color: styles.color, whiteSpace: 'nowrap',
      boxShadow: styles.shadow, cursor: 'grab', border: styles.border,
    }}>{label}</div>
  );
}

function FeedbackLoopsTab() {
  return (
    <div className="fb-screen fb-grid2" style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 18 }}>
      <Card style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 4, background: '#f5f7f9', border: '1px solid #e3e6ea', borderRadius: 9, padding: 3 }}>
            <button style={{ border: '1px solid #e3e6ea', background: '#fff', borderRadius: 6, padding: '5px 9px', fontSize: 11.5, fontWeight: 600, color: '#5b5f67', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}><PlusCircle size={13} /> Element</button>
            <button style={{ border: 'none', background: 'transparent', borderRadius: 6, padding: '5px 9px', fontSize: 11.5, fontWeight: 600, color: '#5b5f67', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}><ArrowBendUpRight size={13} /> Link</button>
          </div>
          <div style={{ display: 'flex', gap: 4, background: '#f5f7f9', border: '1px solid #e3e6ea', borderRadius: 9, padding: 3 }}>
            <button style={{ border: '1px solid #cfe8f6', background: '#fff', borderRadius: 6, width: 26, height: 26, fontSize: 14, fontWeight: 700, color: '#0079b0', cursor: 'pointer' }}>+</button>
            <button style={{ border: 'none', background: 'transparent', borderRadius: 6, width: 26, height: 26, fontSize: 15, fontWeight: 700, color: '#5b5f67', cursor: 'pointer' }}>−</button>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 600, color: '#25826f', background: '#eef6f3', border: '1px solid #cfe9e2', borderRadius: 20, padding: '4px 11px' }}>Loops found: <b>R1</b> · <b>B1</b></span>
        </div>

        <div style={{ overflowX: 'auto', borderRadius: 12, background: 'radial-gradient(circle at 1px 1px,#e7ebee 1px,transparent 0)', backgroundSize: '22px 22px', border: '1px solid #eef0f2' }}>
          <div style={{ position: 'relative', width: 620, height: 420, margin: 'auto' }}>
            <svg viewBox="0 0 620 420" style={{ position: 'absolute', inset: 0, width: 620, height: 420, overflow: 'visible' }}>
              <defs>
                <marker id="ahBlue" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#008ecd" /></marker>
                <marker id="ahTeal" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#2ea38e" /></marker>
              </defs>
              <path d="M 288,66 Q 410,66 452,126" fill="none" stroke="#008ecd" strokeWidth="2" markerEnd="url(#ahBlue)" />
              <path d="M 476,186 Q 448,286 374,308" fill="none" stroke="#008ecd" strokeWidth="2" markerEnd="url(#ahBlue)" />
              <path d="M 298,312 Q 172,214 226,90" fill="none" stroke="#008ecd" strokeWidth="2" markerEnd="url(#ahBlue)" />
              <path d="M 452,178 Q 300,404 170,350" fill="none" stroke="#2ea38e" strokeWidth="2" markerEnd="url(#ahTeal)" />
              <path d="M 114,318 Q 66,250 80,202" fill="none" stroke="#2ea38e" strokeWidth="2" markerEnd="url(#ahTeal)" />
              <path d="M 128,160 Q 300,118 440,138" fill="none" stroke="#2ea38e" strokeWidth="2" markerEnd="url(#ahTeal)" />
            </svg>

            <PolarityChip left={372} top={50} sign="+" color="blue" />
            <PolarityChip left={470} top={250} sign="+" color="blue" />
            <PolarityChip left={182} top={186} sign="+" color="blue" />
            <PolarityChip left={300} top={392} sign="+" color="teal" />
            <PolarityChip left={66} top={250} sign="-" color="warn" />
            <PolarityChip left={300} top={120} sign="+" color="teal" />

            <LoopBadge left={362} top={180} kind="R" />
            <LoopBadge left={196} top={268} kind="B" />

            <LoopNode left={250} top={55} label="New signups" tone="neutral" />
            <LoopNode left={475} top={150} label="Active users" tone="blue" />
            <LoopNode left={335} top={325} label="Word of mouth" tone="neutral" />
            <LoopNode left={130} top={345} label="Support load" tone="neutral" />
            <LoopNode left={92} top={170} label="Onboarding quality" tone="teal" />
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card style={{ padding: 18, borderRadius: 14 }}>
          <h4 style={{ margin: '0 0 12px', fontSize: 13.5, fontWeight: 700 }}>How to read it</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#eef7fc', border: '1.5px solid #008ecd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0079b0', flex: '0 0 auto' }}><ArrowsClockwise size={13} weight="bold" /></span>
              <span style={{ fontSize: 12.5, lineHeight: 1.4 }}><b style={{ color: '#0079b0' }}>Reinforcing (R)</b> — the loop amplifies itself. Growth or collapse compounds.</span>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#eef6f3', border: '1.5px solid #2ea38e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25826f', flex: '0 0 auto' }}><ArrowsCounterClockwise size={13} weight="bold" /></span>
              <span style={{ fontSize: 12.5, lineHeight: 1.4 }}><b style={{ color: '#25826f' }}>Balancing (B)</b> — the loop pushes toward a goal and self-corrects.</span>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#fff', border: '1.5px solid #0079b0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0079b0', fontWeight: 700, flex: '0 0 auto' }}>+</span>
              <span style={{ fontSize: 12.5, lineHeight: 1.4 }}>moves the <b>same</b> direction</span>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#fff', border: '1.5px solid #c25a48', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c25a48', fontWeight: 700, flex: '0 0 auto' }}>−</span>
              <span style={{ fontSize: 12.5, lineHeight: 1.4 }}>moves the <b>opposite</b> direction</span>
            </div>
          </div>
        </Card>

        <Card style={{ padding: 18, borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 }}>
            <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 700 }}>Elements</h4>
            <span style={{ fontSize: 11, color: '#9b9c9f' }}>5</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { label: 'Active users', dot: '#008ecd' },
              { label: 'New signups', dot: '#9b9c9f' },
              { label: 'Word of mouth', dot: '#9b9c9f' },
              { label: 'Support load', dot: '#9b9c9f' },
              { label: 'Onboarding quality', dot: '#2ea38e' },
            ].map(el => (
              <div key={el.label} className="fb-hover fb-hover-bg" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, padding: '6px 8px', borderRadius: 7 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: el.dot }} />
                {el.label}
              </div>
            ))}
          </div>
        </Card>

        <div style={{ background: '#eef7fc', border: '1px solid #cfe8f6', borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0d3f57', marginBottom: 4 }}>What this tells you</div>
          <p style={{ margin: 0, fontSize: 12, color: '#33607a', lineHeight: 1.5 }}>
            <b>R1</b> is your growth engine — but <b>B1</b> caps it: as users grow, support load rises and onboarding quality drops. That's a{' '}
            <ArchLink id="limits">Limits to Growth</ArchLink> archetype.
          </p>
        </div>
      </div>
    </div>
  );
}

function ArchLink({ id, children }: { id: string; children: ReactNode }) {
  const { setSysTab, setSysArch } = useAppState();
  return (
    <a
      href="#"
      onClick={e => { e.preventDefault(); setSysTab('archetypes'); setSysArch(id); }}
      style={{ color: '#0079b0', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
    >
      {children}
    </a>
  );
}

function ArchGlyph({ glyph }: { glyph: GlyphSpec }) {
  const top = glyph.topColor === 'blue' ? '#008ecd' : '#2ea38e';
  const bottom = glyph.bottomColor === 'blue' ? '#008ecd' : '#2ea38e';
  const uid = `${glyph.c1Fill}${glyph.topColor}${glyph.bottomColor}`.replace(/[^a-zA-Z]/g, '');
  return (
    <svg viewBox="0 0 108 46" style={{ width: 88, height: 38 }}>
      <defs>
        <marker id={`gah-${uid}`} markerWidth="6" markerHeight="6" refX="4" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4 Z" fill={top} /></marker>
        <marker id={`gaht-${uid}`} markerWidth="6" markerHeight="6" refX="4" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4 Z" fill={bottom} /></marker>
      </defs>
      <circle cx="30" cy="23" r="14" fill={glyph.c1Fill} stroke={glyph.c1Stroke} />
      <circle cx="78" cy="23" r="14" fill={glyph.c2Fill} stroke={glyph.c2Stroke} />
      <path d="M42,17 Q54,8 66,17" fill="none" stroke={top} strokeWidth="1.6" markerEnd={`url(#gah-${uid})`} />
      <path d="M66,29 Q54,38 42,29" fill="none" stroke={bottom} strokeWidth="1.6" markerEnd={`url(#gaht-${uid})`} />
    </svg>
  );
}

function ArchetypesTab() {
  const { sysArch, setSysArch } = useAppState();

  if (sysArch) {
    const arch = archetypeById(sysArch);
    if (!arch) return null;
    return (
      <div className="fb-screen">
        <button onClick={() => setSysArch(null)} className="fb-hover fb-hover-bg" style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#fff', border: '1px solid #e3e6ea', borderRadius: 9, padding: '8px 13px', fontSize: 12.5, fontWeight: 600, color: '#5b5f67', cursor: 'pointer', marginBottom: 16 }}>
          <ArrowLeft size={13} weight="bold" /> All archetypes
        </button>
        <div className="fb-grid2" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18 }}>
          <Card style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 19, fontWeight: 700, letterSpacing: '-.01em' }}>{arch.name}</h3>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0079b0', background: '#eef7fc', border: '1px solid #cfe8f6', borderRadius: 20, padding: '3px 10px' }}>{arch.badge}</span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#83878f', letterSpacing: '.05em', marginBottom: 5 }}>THE PATTERN</div>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: '#3f434b' }}>{arch.pattern}</p>
            </div>
            <div style={{ marginBottom: 16, background: '#fff7ed', border: '1px solid #f2d9b8', borderRadius: 11, padding: '13px 15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: '#b5711e', letterSpacing: '.03em', marginBottom: 5 }}><Eye size={14} weight="fill" /> WATCH FOR IT WHEN</div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: '#7a5a2e' }}>{arch.watch}</p>
            </div>
            <div style={{ background: '#eef6f3', border: '1px solid #cfe9e2', borderRadius: 11, padding: '13px 15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: '#25826f', letterSpacing: '.03em', marginBottom: 5 }}><Sliders size={14} weight="fill" /> WHERE TO INTERVENE</div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: '#245c4d' }}>{arch.leverage}</p>
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 180, background: '#fbfcfd' }}>
              <svg viewBox="0 0 220 120" style={{ width: '100%', maxWidth: 220 }}>
                <defs>
                  <marker id="dah" markerWidth="8" markerHeight="8" refX="5" refY="2.6" orient="auto"><path d="M0,0 L5,2.6 L0,5.2 Z" fill="#008ecd" /></marker>
                  <marker id="daht" markerWidth="8" markerHeight="8" refX="5" refY="2.6" orient="auto"><path d="M0,0 L5,2.6 L0,5.2 Z" fill="#2ea38e" /></marker>
                </defs>
                <circle cx="66" cy="60" r="30" fill="#eef7fc" stroke="#a9d4ef" strokeWidth="1.5" />
                <circle cx="154" cy="60" r="30" fill="#eef6f3" stroke="#a9dbcf" strokeWidth="1.5" />
                <path d="M92,45 Q110,30 128,45" fill="none" stroke="#008ecd" strokeWidth="2" markerEnd="url(#dah)" />
                <path d="M128,75 Q110,90 92,75" fill="none" stroke="#2ea38e" strokeWidth="2" markerEnd="url(#daht)" />
                <text x="66" y="64" textAnchor="middle" fontSize="16" fontWeight="800" fill="#0079b0" fontFamily="Work Sans">R</text>
                <text x="154" y="64" textAnchor="middle" fontSize="16" fontWeight="800" fill="#25826f" fontFamily="Work Sans">B</text>
              </svg>
              <div style={{ fontSize: 11, color: '#9b9c9f', marginTop: 10, textAlign: 'center' }}>coupled loops — {arch.badge}</div>
            </Card>
            <Card style={{ padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Behaviour over time</div>
              <svg viewBox="0 0 240 90" style={{ width: '100%' }}>
                <line x1="18" y1="76" x2="230" y2="76" stroke="#d4d8dd" />
                <line x1="18" y1="8" x2="18" y2="76" stroke="#d4d8dd" />
                <polyline points="18,66 60,54 100,36 140,26 175,42 210,60" fill="none" stroke="#008ecd" strokeWidth="2.2" />
                <polyline points="18,50 230,50" fill="none" stroke="#9b9c9f" strokeWidth="1" strokeDasharray="3 3" />
              </svg>
              <div style={{ fontSize: 10.5, color: '#9b9c9f', marginTop: 4 }}>solid = actual · dashed = intended / limit</div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fb-screen">
      <p className="serif" style={{ margin: '0 0 16px', fontSize: 13.5, color: '#6b6e76', maxWidth: 640, lineHeight: 1.55 }}>
        Recurring structures that produce predictable trouble. Spot the one you're in, and you know where to push. <span style={{ fontStyle: 'italic' }}>Click any card.</span>
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 14 }}>
        {archetypes.map(a => (
          <button
            key={a.id}
            onClick={() => setSysArch(a.id)}
            className="fb-hover fb-hover-row"
            style={{ textAlign: 'left', background: '#fff', border: '1px solid #e3e6ea', borderRadius: 14, padding: 16, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <ArchGlyph glyph={a.glyph} />
              <span style={{ fontSize: 9.5, fontWeight: 700, color: '#5b5f67', background: '#f1f3f6', borderRadius: 20, padding: '2px 8px' }}>{a.cardBadge}</span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{a.name}</div>
              <div style={{ fontSize: 12, color: '#6b6e76', lineHeight: 1.4, marginTop: 3 }}>{a.summary}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
