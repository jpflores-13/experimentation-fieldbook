import type { ReactNode } from 'react';
import {
  SneakerMove, ArrowLeft, ArrowRight, Image, PlusCircle, Heart, Wrench, ChartLineUp, Check,
  Cards, ImageSquare, Package, DeviceMobile, RocketLaunch, Broadcast, ArrowsClockwise, Brain, ChatsCircle, Storefront, CursorClick, Flask,
} from '@phosphor-icons/react';
import { useAppState, recommendation } from '../state/AppState';
import type { Step as StepNum } from '../types';
import { Card } from '../components/ui';

const iconMap: Record<string, React.ElementType> = { Brain, ChatsCircle, Storefront, CursorClick, Flask };

const steps: { n: StepNum; label: string }[] = [
  { n: 1, label: 'Frame' },
  { n: 2, label: 'Evidence' },
  { n: 3, label: 'Select test' },
  { n: 4, label: 'Prototype' },
  { n: 5, label: 'Execute' },
];

export function Workspace() {
  const { step, setStep } = useAppState();

  return (
    <div className="fb-screen" style={{ maxWidth: 1180, margin: '0 auto' }}>
      <div className="no-print">
        <ConceptHeader />

        <Card style={{ padding: '14px 10px', marginBottom: 18, display: 'flex', alignItems: 'center', overflowX: 'auto' }}>
          {steps.map((s, i) => {
            const active = step === s.n;
            const done = step > s.n;
            return (
              <button key={s.n} onClick={() => setStep(s.n)} style={{ flex: 1, minWidth: 120, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, padding: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <span style={{ flex: 1, height: 2, background: i === 0 ? 'transparent' : '#e3e6ea' }} />
                  <span style={{
                    width: 30, height: 30, borderRadius: '50%', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: active ? '#008ecd' : done ? '#2ea38e' : '#eef1f4',
                    color: active || done ? '#fff' : '#9b9c9f',
                    border: !active && !done ? '1.5px solid #d8d9da' : 'none',
                    boxShadow: active ? '0 0 0 4px #dcefff' : 'none',
                  }}>
                    {done ? <Check size={15} weight="bold" /> : s.n}
                  </span>
                  <span style={{ flex: 1, height: 2, background: i === steps.length - 1 ? 'transparent' : '#e3e6ea' }} />
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: active ? '#2c2e35' : '#83878f' }}>{s.label}</span>
              </button>
            );
          })}
        </Card>

        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
        {step === 4 && <Step4 />}
        {step === 5 && <Step5 />}
      </div>

      <div className="print-only">
        <PrintCoverPage />
        <div className="fb-print-page"><PrintStepBanner n={1} label="Frame a testable idea" /><Step1 /></div>
        <div className="fb-print-page"><PrintStepBanner n={2} label="Define evidence" /><Step2 /></div>
        <div className="fb-print-page"><PrintStepBanner n={3} label="Select your test" /><Step3 /></div>
        <div className="fb-print-page"><PrintStepBanner n={4} label="Build the prototype" /><Step4 /></div>
        <div className="fb-print-page"><PrintStepBanner n={5} label="Execute · Analyze · Iterate" /><Step5 /></div>
      </div>
    </div>
  );
}

function ConceptHeader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 18, flexWrap: 'wrap' }}>
      <span style={{ width: 44, height: 44, borderRadius: 11, background: '#eef7fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
        <SneakerMove size={23} weight="fill" color="#008ecd" />
      </span>
      <div style={{ flex: 1, minWidth: 180 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, letterSpacing: '-.01em' }}>Easykicks subscription</h2>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#25826f', background: '#eef6f3', border: '1px solid #cfe9e2', padding: '2px 9px', borderRadius: 20 }}>Recycling component</span>
        </div>
        <div style={{ fontSize: 12.5, color: '#83878f' }}>Nike · testing whether parents will return old shoes</div>
      </div>
    </div>
  );
}

function PrintStepBanner({ n, label }: { n: number; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid #2c2e35' }}>
      <span style={{ width: 22, height: 22, borderRadius: 6, background: '#2c2e35', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>{n}</span>
      <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.02em', textTransform: 'uppercase' }}>Step {n} · {label}</span>
    </div>
  );
}

function PrintCoverPage() {
  return (
    <div className="fb-print-page">
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 28 }}>
        <img src="/scintilla-mark.svg" width={22} height={22} alt="" />
        <span style={{ fontFamily: "'Work Sans',sans-serif", fontSize: 15, fontWeight: 800, color: '#2c2e35', letterSpacing: '-.03em' }}>scintilla</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#0079b0', letterSpacing: '.05em', textTransform: 'uppercase' }}>· Experimentation workbook</span>
      </div>
      <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 700, letterSpacing: '-.01em' }}>Easykicks subscription</h1>
      <div style={{ fontSize: 13, color: '#5b5f67' }}>Nike · Recycling component · testing whether parents will return old shoes</div>
      <div style={{ fontSize: 11, color: '#9b9c9f', marginTop: 18 }}>Steps 1–5, filled in {new Date().toLocaleDateString()}.</div>
    </div>
  );
}

function StepFooter({ backLabel, onBack, nextLabel, onNext, nextColor = '#008ecd', nextHover = '#0079b0' }: { backLabel: string; onBack: () => void; nextLabel: string; onNext: () => void; nextColor?: string; nextHover?: string }) {
  return (
    <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, paddingTop: 18, borderTop: '1px solid #e7eaee' }}>
      <button onClick={onBack} className="fb-hover fb-hover-bg" style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#fff', border: '1px solid #e3e6ea', borderRadius: 10, padding: '10px 15px', fontSize: 13, fontWeight: 600, color: '#5b5f67', cursor: 'pointer' }}>
        <ArrowLeft size={14} weight="bold" /> {backLabel}
      </button>
      <button
        onClick={onNext}
        onMouseEnter={e => (e.currentTarget.style.background = nextHover)}
        onMouseLeave={e => (e.currentTarget.style.background = nextColor)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: nextColor, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
      >
        {nextLabel} <ArrowRight size={14} weight="bold" />
      </button>
    </div>
  );
}

function SectionHeading({ title, note }: { title: string; note: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{title}</h3>
      <span className="serif" style={{ fontSize: 12, color: '#9b9c9f', fontStyle: 'italic' }}>{note}</span>
    </div>
  );
}

function CardHeading({ title, tag }: { title: string; tag: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 700 }}>{title}</h4>
      <span style={{ fontSize: 11, color: '#9b9c9f' }}>{tag}</span>
    </div>
  );
}

function RowGroup({ label, sub, u1, u2 }: { label: string; sub: string; u1: ReactNode; u2: ReactNode }) {
  return (
    <>
      <div style={{ padding: '14px 16px', fontSize: 12.5, fontWeight: 700, background: '#fafbfc', borderBottom: '1px solid #eef0f2' }}>{label}<div style={{ fontSize: 10.5, color: '#9b9c9f', fontWeight: 500, fontStyle: 'italic' }}>{sub}</div></div>
      <div style={{ padding: 14, fontSize: 12, lineHeight: 1.5, borderLeft: '1px solid #eef0f2', borderBottom: '1px solid #eef0f2', color: '#4a4d55' }}>{u1}</div>
      <div style={{ padding: 14, fontSize: 12, lineHeight: 1.5, borderLeft: '1px solid #eef0f2', borderBottom: '1px solid #eef0f2', color: '#4a4d55' }}>{u2}</div>
    </>
  );
}

function Step1() {
  const { go, setStep } = useAppState();
  const snapshotRows = [
    { label: 'For', sub: 'target user', u1: 'Kids who play sports and outgrow shoes fast', u2: 'Parents managing cost, hassle & sustainability' },
    { label: 'Who want', sub: 'unmet needs', u1: 'More control & agency in their shoe choices; the right fit & performance; a pleasant, less painful shopping experience', u2: 'Confidence kids have the right shoes; less time spent shopping; fewer conflicts & stress' },
  ];
  const storyboard = [
    { n: 1, text: 'Parent sees Easykicks and signs their kid up online', blank: false },
    { n: 2, text: 'First box arrives; kid tries on the shoes', blank: false },
    { n: 3, text: '(blank on purpose)', blank: true },
    { n: 4, text: 'Outgrown shoes go back in the prepaid bag', blank: false },
    { n: 5, text: '(blank on purpose)', blank: true },
  ];
  return (
    <div className="fb-screen">
      <SectionHeading title="Concept Snapshot" note="Template 3 — specific, fresh & worth testing" />
      <Card style={{ overflow: 'hidden', marginBottom: 20, borderRadius: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 1fr' }}>
          <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '150px 1fr 1fr', background: '#f6f8fa', borderBottom: '1px solid #e3e6ea' }}>
            <div style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#83878f', letterSpacing: '.05em' }}>CONCEPT</div>
            <div style={{ padding: '12px 14px', fontSize: 11, fontWeight: 700, color: '#0079b0', borderLeft: '1px solid #e3e6ea' }}>USER 1 · Young Athletes (8–12)</div>
            <div style={{ padding: '12px 14px', fontSize: 11, fontWeight: 700, color: '#0079b0', borderLeft: '1px solid #e3e6ea' }}>USER 2 · Their Parents</div>
          </div>
          {snapshotRows.map(row => <RowGroup key={row.label} {...row} />)}
          <div style={{ padding: '14px 16px', fontSize: 12.5, fontWeight: 700, background: '#fafbfc', borderBottom: '1px solid #eef0f2' }}>We will offer<div style={{ fontSize: 10.5, color: '#9b9c9f', fontWeight: 500, fontStyle: 'italic' }}>offering</div></div>
          <div style={{ gridColumn: '2 / -1', padding: 14, fontSize: 12.5, lineHeight: 1.5, borderLeft: '1px solid #eef0f2', borderBottom: '1px solid #eef0f2', color: '#4a4d55' }}>A subscription that delivers the right shoes when kids need them, with a simple return-and-recycle loop for outgrown pairs.</div>
          <div style={{ padding: '14px 16px', fontSize: 12.5, fontWeight: 700, background: '#fafbfc', borderBottom: '1px solid #eef0f2' }}>That provides<div style={{ fontSize: 10.5, color: '#9b9c9f', fontWeight: 500, fontStyle: 'italic' }}>benefits</div></div>
          <div style={{ padding: 14, fontSize: 12, lineHeight: 1.5, borderLeft: '1px solid #eef0f2', borderBottom: '1px solid #eef0f2', color: '#4a4d55' }}>Self-expression, confidence & a special feeling when they perform</div>
          <div style={{ padding: 14, fontSize: 12, lineHeight: 1.5, borderLeft: '1px solid #eef0f2', borderBottom: '1px solid #eef0f2', color: '#4a4d55' }}>The shoes their athletes need, when they need them — with less shopping pain</div>
          <div style={{ padding: '14px 16px', fontSize: 12.5, fontWeight: 700, background: '#eef7fc' }}>Uniquely<div style={{ fontSize: 10.5, color: '#9b9c9f', fontWeight: 500, fontStyle: 'italic' }}>differentiation</div></div>
          <div style={{ gridColumn: '2 / -1', padding: 14, fontSize: 12, lineHeight: 1.5, borderLeft: '1px solid #eef0f2', background: '#eef7fc', color: '#0d3f57' }}>A sustainable, cyclical buy-return process with accurate fit assessment and a 1:1 ongoing relationship — a service experience wrapped around the shoe.</div>
        </div>
      </Card>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Storyboard</h3>
        <span className="serif" style={{ fontSize: 12, color: '#9b9c9f', fontStyle: 'italic' }}>Template 4 — blank frames are intentional, to co-create with users</span>
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 6 }}>
        {storyboard.map(f => (
          <div key={f.n} style={{ flex: '0 0 190px' }}>
            {f.blank ? (
              <div style={{ height: 118, borderRadius: 11, border: '1.5px dashed #cdd6dc', background: '#fafbfc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#b0b3b8', gap: 5 }}>
                <PlusCircle size={24} />
                <span style={{ fontSize: 10.5, fontWeight: 600 }}>co-create with user</span>
              </div>
            ) : (
              <div style={{ height: 118, borderRadius: 11, border: '1px solid #e3e6ea', background: 'repeating-linear-gradient(45deg,#f4f6f8,#f4f6f8 8px,#eef1f4 8px,#eef1f4 16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a9aaad' }}>
                <Image size={26} />
              </div>
            )}
            <div style={{ fontSize: 11.5, color: f.blank ? '#b0b3b8' : '#5b5f67', marginTop: 7, lineHeight: 1.35 }}>{f.n} · {f.text}</div>
          </div>
        ))}
      </div>

      <StepFooter backLabel="Value/Effort Matrix" onBack={() => go('concepts')} nextLabel="Continue to Step 2 · Evidence" onNext={() => setStep(2)} />
    </div>
  );
}

function Step2() {
  const { setStep } = useAppState();
  const assumptionCols = [
    { title: 'Desirability', color: '#008ecd', textColor: '#0079b0', icon: Heart, bg: '#eef7fc', border: '#d6ecf8', items: ["Parents want to recycle their kids' outgrown shoes", 'A prepaid return bag removes the friction of sending back'] },
    { title: 'Feasibility', color: '#2ea38e', textColor: '#25826f', icon: Wrench, bg: '#eef6f3', border: '#d4ebe4', items: ['Parents will actually mail the old shoes back', 'Returns can be processed at existing facilities'] },
    { title: 'Viability', color: '#5b6b7a', textColor: '#4c5966', icon: ChartLineUp, bg: '#f3f5f7', border: '#e3e7ea', items: ['Cost to process each returned pair stays low enough', 'Recovered materials offset the processing cost'] },
  ];
  const evidenceRows = [
    { a: 'Parents will return old shoes', e: '% of buyers who mail back within 60 days', t: '≥ 30%', asp: '60%', s: 'Prepaid-bag tracking' },
    { a: 'Parents value recycling', e: 'Unprompted positive mentions in interviews', t: '50%', asp: '80%', s: 'Intercept interviews' },
    { a: 'Processing stays viable', e: 'Fully-loaded cost per returned pair', t: '< $4', asp: '< $2', s: 'Ops finance log' },
  ];
  return (
    <div className="fb-screen">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Defining evidence</h3>
        <span className="serif" style={{ fontSize: 12, color: '#9b9c9f', fontStyle: 'italic' }}>test the assumptions, not the concept</span>
      </div>
      <p className="serif" style={{ margin: '0 0 18px', fontSize: 13, color: '#6b6e76', maxWidth: 640, lineHeight: 1.5 }}>
        Surface the beliefs that make this concept a <span style={{ fontStyle: 'italic' }}>wow</span>, prioritise the make-or-break ones, then define observable, countable evidence with threshold &amp; aspirational targets.
      </p>

      <h4 style={{ margin: '0 0 11px', fontSize: 13.5, fontWeight: 700 }}>Surfacing Assumptions <span style={{ fontWeight: 500, color: '#9b9c9f', fontSize: 11.5 }}>· Template 5</span></h4>
      <div className="fb-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
        {assumptionCols.map(col => {
          const Icon = col.icon;
          return (
            <Card key={col.title} style={{ borderTop: `3px solid ${col.color}`, padding: 16, borderRadius: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Icon size={16} weight="fill" color={col.color} />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: col.textColor }}>{col.title}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {col.items.map(item => (
                  <div key={item} style={{ background: col.bg, border: `1px solid ${col.border}`, borderRadius: 9, padding: '9px 11px', fontSize: 12, lineHeight: 1.4, fontWeight: 500 }}>{item}</div>
                ))}
                <div style={{ background: '#f6f8fa', border: '1px dashed #cdd6dc', borderRadius: 9, padding: '9px 11px', fontSize: 11.5, color: '#9b9c9f', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <PlusCircle size={12} /> add assumption
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="fb-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 18, borderRadius: 14 }}>
          <CardHeading title="Prioritizing Assumptions" tag="Template 6" />
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '2px 0' }}>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: '#83878f', writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '.05em' }}>MOST CRITICAL</span>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: '#83878f', writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '.05em' }}>LEAST</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ position: 'relative', width: '100%', paddingTop: '78%', border: '1px solid #e3e6ea', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }}>
                  <div style={{ borderRight: '1px dashed #d8dee3', borderBottom: '1px dashed #d8dee3' }} />
                  <div style={{ background: '#fff7ed', borderBottom: '1px dashed #d8dee3' }} />
                  <div style={{ borderRight: '1px dashed #d8dee3' }} />
                  <div />
                </div>
                <div style={{ position: 'absolute', top: '22%', left: '70%', transform: 'translate(-50%,-50%)', background: '#fff', border: '1.5px solid #e8956b', borderRadius: 9, padding: '5px 8px', boxShadow: '0 3px 9px rgba(232,149,107,.22)', maxWidth: 120 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, lineHeight: 1.25, color: '#b5502a' }}>Parents will mail shoes back</div>
                  <div style={{ fontSize: 8.5, color: '#c98a6f', fontWeight: 600, marginTop: 2 }}>TEST FIRST</div>
                </div>
                <div style={{ position: 'absolute', top: '34%', left: '33%', transform: 'translate(-50%,-50%)', background: '#fff', border: '1.5px solid #cfe8f6', borderRadius: 9, padding: '5px 8px', boxShadow: '0 2px 6px rgba(0,0,0,.06)', maxWidth: 110 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, lineHeight: 1.25 }}>Parents value recycling</div>
                </div>
                <div style={{ position: 'absolute', top: '70%', left: '64%', transform: 'translate(-50%,-50%)', background: '#fff', border: '1.5px solid #d8d9da', borderRadius: 9, padding: '5px 8px', boxShadow: '0 2px 6px rgba(0,0,0,.05)', maxWidth: 110 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, lineHeight: 1.25, color: '#6b6e76' }}>Existing facilities suffice</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontSize: 9.5, fontWeight: 700, color: '#83878f' }}>MORE KNOWN</span>
                <span style={{ fontSize: 9.5, fontWeight: 700, color: '#83878f' }}>MORE UNKNOWN</span>
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ padding: 18, borderRadius: 14, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 700 }}>The Wow Zone</h4>
            <span style={{ fontSize: 11, color: '#9b9c9f' }}>desirable · feasible · viable</span>
          </div>
          <div style={{ flex: 1, position: 'relative', minHeight: 170 }}>
            <div style={{ position: 'absolute', top: '14%', left: '50%', transform: 'translateX(-50%)', width: 118, height: 118, borderRadius: '50%', background: 'rgba(0,142,205,.22)', border: '1.5px solid #008ecd', display: 'flex', justifyContent: 'center', paddingTop: 12 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#0079b0' }}>Desirable</span>
            </div>
            <div style={{ position: 'absolute', top: '44%', left: '27%', width: 118, height: 118, borderRadius: '50%', background: 'rgba(46,163,142,.22)', border: '1.5px solid #2ea38e', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 14 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#25826f' }}>Feasible</span>
            </div>
            <div style={{ position: 'absolute', top: '44%', right: '27%', width: 118, height: 118, borderRadius: '50%', background: 'rgba(91,107,122,.2)', border: '1.5px solid #5b6b7a', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 14 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#4c5966' }}>Viable</span>
            </div>
            <div style={{ position: 'absolute', top: '47%', left: '50%', transform: 'translate(-50%,-50%)', width: 34, height: 34, borderRadius: '50%', background: '#fff', border: '1.5px solid #2c2e35', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.15)', zIndex: 2 }}>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '-.02em' }}>WOW</span>
            </div>
          </div>
        </Card>
      </div>

      <h4 style={{ margin: '0 0 11px', fontSize: 13.5, fontWeight: 700 }}>Assumptions → Evidence <span style={{ fontWeight: 500, color: '#9b9c9f', fontSize: 11.5 }}>· Template 7</span></h4>
      <Card style={{ overflow: 'hidden', overflowX: 'auto', borderRadius: 14 }}>
        <div style={{ minWidth: 720 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.5fr 1.2fr 1fr', background: '#f6f8fa', borderBottom: '1px solid #e3e6ea', fontSize: 10.5, fontWeight: 700, color: '#83878f', letterSpacing: '.04em' }}>
            <div style={{ padding: '11px 14px' }}>ASSUMPTION</div>
            <div style={{ padding: '11px 14px', borderLeft: '1px solid #e9ecef' }}>EVIDENCE</div>
            <div style={{ padding: '11px 14px', borderLeft: '1px solid #e9ecef' }}>THRESHOLD → ASPIRATIONAL</div>
            <div style={{ padding: '11px 14px', borderLeft: '1px solid #e9ecef' }}>SOURCE</div>
          </div>
          {evidenceRows.map((r, i) => (
            <div key={r.a} style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.5fr 1.2fr 1fr', borderBottom: i < evidenceRows.length - 1 ? '1px solid #eef0f2' : 'none', fontSize: 12, lineHeight: 1.45 }}>
              <div style={{ padding: '13px 14px', fontWeight: 600 }}>{r.a}</div>
              <div style={{ padding: '13px 14px', borderLeft: '1px solid #f0f2f4', color: '#4a4d55' }}>{r.e}</div>
              <div style={{ padding: '13px 14px', borderLeft: '1px solid #f0f2f4' }}><span style={{ fontWeight: 700, color: '#0079b0' }}>{r.t}</span> <span style={{ color: '#9b9c9f' }}>→ {r.asp}</span></div>
              <div style={{ padding: '13px 14px', borderLeft: '1px solid #f0f2f4', color: '#4a4d55' }}>{r.s}</div>
            </div>
          ))}
        </div>
      </Card>

      <StepFooter backLabel="Step 1" onBack={() => setStep(1)} nextLabel="Continue to Step 3 · Select test" onNext={() => setStep(3)} />
    </div>
  );
}

function QRow({ label, question, options }: { label: string; question: string; options: { key: string; text: string; active: boolean; onClick: () => void }[] }) {
  return (
    <div style={{ marginBottom: 15 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#5b5f67', marginBottom: 8 }}><span style={{ color: '#008ecd', fontWeight: 700 }}>{label}.</span> {question}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {options.map(o => (
          <button key={o.key} onClick={o.onClick} style={{
            position: 'relative', flex: 1, border: `1.5px solid ${o.active ? '#008ecd' : '#e3e6ea'}`,
            background: o.active ? '#eef7fc' : '#fff', borderRadius: 9, padding: 9, fontSize: 12, fontWeight: 600,
            cursor: 'pointer', color: '#5b5f67',
          }}>{o.text}</button>
        ))}
      </div>
    </div>
  );
}

function Step3() {
  const { setStep, q1, q2, q3, setQ1, setQ2, setQ3, saydo, setSaydo } = useAppState();
  const rec = recommendation(q1, q2, q3);
  const RecIcon = rec ? iconMap[rec.icon] : Flask;

  return (
    <div className="fb-screen">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 18 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Selecting your test</h3>
        <span className="serif" style={{ fontSize: 12, color: '#9b9c9f', fontStyle: 'italic' }}>a funnel of four questions → one test type</span>
      </div>

      <div className="fb-grid2" style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20, borderRadius: 14 }}>
          <CardHeading title="Test Decision Flow" tag="Template 10 · interactive" />
          <QRow label="Q1" question="Does data already exist to test this critical assumption?" options={[
            { key: 'yes', text: 'Yes — analyze it', active: q1 === 'yes', onClick: () => setQ1('yes') },
            { key: 'no', text: 'No — go to field', active: q1 === 'no', onClick: () => setQ1('no') },
          ]} />
          <QRow label="Q2" question="Test a component, or the whole concept?" options={[
            { key: 'component', text: 'Component', active: q2 === 'component', onClick: () => setQ2('component') },
            { key: 'whole', text: 'Whole concept', active: q2 === 'whole', onClick: () => setQ2('whole') },
          ]} />
          <QRow label="Q3" question="Do you need Say data or Do data?" options={[
            { key: 'say', text: 'Say data', active: q3 === 'say', onClick: () => setQ3('say') },
            { key: 'do', text: 'Do data', active: q3 === 'do', onClick: () => setQ3('do') },
          ]} />
        </Card>

        <div style={{ borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', background: '#2c2e35', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -30, top: -30, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle,#008ecd,rgba(0,142,205,0) 70%)', opacity: .45 }} />
          <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#7fb8d6', position: 'relative' }}>Recommended test</span>
          {rec ? (
            <div style={{ position: 'relative', marginTop: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <RecIcon size={24} color="#fff" />
              </div>
              <div className="serif" style={{ fontSize: 23, fontWeight: 600, letterSpacing: '-.01em', marginBottom: 8 }}>{rec.name}</div>
              <p style={{ margin: 0, fontSize: 12.5, color: '#b6b9c0', lineHeight: 1.5 }}>{rec.note}</p>
            </div>
          ) : (
            <div style={{ position: 'relative', marginTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center', color: '#8a8e97' }}>
              <ArrowLeft size={24} style={{ marginBottom: 8 }} />
              <span style={{ fontSize: 12.5, maxWidth: 180, lineHeight: 1.45 }}>Answer the questions to see your recommended test type.</span>
            </div>
          )}
        </div>
      </div>

      <div className="fb-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: '18px 20px', borderRadius: 14 }}>
          <CardHeading title="Say / Do Continuum" tag="Template 9" />
          <div style={{ marginBottom: 14 }}>
            <input type="range" min={0} max={100} value={saydo} onChange={e => setSaydo(Number(e.target.value))} style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#5b6b7a' }}>SAY · generative</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0079b0' }}>DO · evaluative</span>
            </div>
          </div>
          <div className="serif" style={{ fontSize: 12.5, color: '#6b6e76', fontStyle: 'italic', lineHeight: 1.5 }}>The farther right, the more you need Do data — actual behaviour, a more complete prototype, more time &amp; money.</div>
        </Card>
        <Card style={{ padding: '18px 20px', borderRadius: 14 }}>
          <CardHeading title="Data Sort" tag="Template 8" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[
              { tag: 'KNOW NOW', color: '#25826f', bg: '#eef6f3', text: 'Shoe recycling rates from prior CSR data' },
              { tag: 'KNOWABLE', color: '#0079b0', bg: '#eef7fc', text: 'Return-shipping cost per parcel' },
              { tag: 'FIELD ONLY', color: '#b5502a', bg: '#fdf1ea', text: 'Whether parents actually mail shoes back' },
            ].map(row => (
              <div key={row.tag} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: row.color, background: row.bg, borderRadius: 6, padding: '3px 7px', flex: '0 0 auto', width: 96, textAlign: 'center' }}>{row.tag}</span>
                <span style={{ fontSize: 11.5 }}>{row.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <h4 style={{ margin: '0 0 11px', fontSize: 13.5, fontWeight: 700 }}>Test Digest <span style={{ fontWeight: 500, color: '#9b9c9f', fontSize: 11.5 }}>· Template 11 — the one-page test summary</span></h4>
      <Card style={{ padding: 20, borderRadius: 14 }}>
        <div className="fb-grid4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {[
            { k: 'TEST TYPE', v: 'Simulation', sub: 'Wizard-of-Oz returns', vColor: '#0079b0' },
            { k: 'PROTOTYPE', v: 'Prepaid return bag', sub: 'Physical mock-up' },
            { k: 'PARTICIPANTS', v: "Parents buying kids' shoes", sub: 'Recruited in-store' },
            { k: 'SAMPLE · TIMEFRAME', v: '40 buyers · 60 days', sub: 'Return window' },
          ].map(cell => (
            <div key={cell.k}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#83878f', letterSpacing: '.04em', marginBottom: 5 }}>{cell.k}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: cell.vColor }}>{cell.v}</div>
              <div style={{ fontSize: 11, color: '#9b9c9f', marginTop: 2 }}>{cell.sub}</div>
            </div>
          ))}
        </div>
      </Card>

      <StepFooter backLabel="Step 2" onBack={() => setStep(2)} nextLabel="Continue to Step 4 · Prototype" onNext={() => setStep(4)} />
    </div>
  );
}

function Step4() {
  const { setStep, fidelity, setFidelity } = useAppState();
  const formats = [
    { icon: Cards, label: 'Storyboard', sub: 'low-fi', selected: false },
    { icon: ImageSquare, label: 'Poster', sub: 'low-fi', selected: false },
    { icon: Package, label: 'Physical mock-up', sub: 'selected · mid-fi', selected: true },
    { icon: DeviceMobile, label: 'Digital mock-up', sub: 'mid-fi', selected: false },
    { icon: RocketLaunch, label: 'MVP', sub: 'high-fi', selected: false },
  ];
  return (
    <div className="fb-screen">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 18 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Building the prototype</h3>
        <span className="serif" style={{ fontSize: 12, color: '#9b9c9f', fontStyle: 'italic' }}>the simplest stimulus that does the job</span>
      </div>

      <div className="fb-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20, borderRadius: 14 }}>
          <CardHeading title="Prototype Format Selection" tag="Template 12" />
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: '#5b5f67', marginBottom: 6 }}>How real does it need to look &amp; feel?</div>
            <input type="range" min={0} max={100} value={fidelity} onChange={e => setFidelity(Number(e.target.value))} style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#5b6b7a' }}>LOW FIDELITY</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0079b0' }}>HIGH FIDELITY</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[{ label: 'Form', hint: 'how it looks', v: 40 }, { label: 'Function', hint: 'how it works', v: 55 }, { label: 'Interactivity', hint: 'how it engages', v: 62 }].map(row => (
              <div key={row.label}>
                <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>{row.label} <span style={{ color: '#9b9c9f' }}>· {row.hint}</span></div>
                <div style={{ height: 5, background: '#eef1f4', borderRadius: 4, overflow: 'hidden' }}>
                  <span style={{ display: 'block', height: '100%', width: `${row.v}%`, background: '#008ecd', borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ padding: 20, borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 700 }}>Research Guide</h4>
            <span style={{ fontSize: 11, color: '#9b9c9f' }}>consistent testers, right data</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {[
              { text: 'Roles of researcher & participant defined', done: true },
              { text: 'Interview guide & probing questions drafted', done: true },
              { text: 'Privacy notice / consent form ready', done: false },
              { text: 'Recruiting plans A, B & C in place', done: false },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{
                  width: 18, height: 18, borderRadius: 5, flex: '0 0 auto', marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: item.done ? '#2ea38e' : 'transparent', border: item.done ? 'none' : '1.5px solid #c9cbce',
                }}>{item.done && <Check size={11} weight="bold" color="#fff" />}</span>
                <span style={{ fontSize: 12.5, lineHeight: 1.35 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <h4 style={{ margin: '0 0 11px', fontSize: 13.5, fontWeight: 700 }}>Choose a format <span style={{ fontWeight: 500, color: '#9b9c9f', fontSize: 11.5 }}>· pick the fastest one that does the job</span></h4>
      <div className="fb-grid4" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
        {formats.map(f => {
          const Icon = f.icon;
          return (
            <div key={f.label} style={{
              background: f.selected ? '#eef7fc' : '#fff', border: f.selected ? '1.5px solid #008ecd' : '1px solid #e7eaee',
              borderRadius: 12, padding: 14, textAlign: 'center', opacity: f.selected ? 1 : .75,
              boxShadow: f.selected ? '0 3px 12px rgba(0,142,205,.14)' : 'none',
            }}>
              <Icon size={22} weight={f.selected ? 'fill' : 'regular'} color={f.selected ? '#008ecd' : '#5b6b7a'} style={{ margin: '0 auto', display: 'block' }} />
              <div style={{ fontSize: 12, fontWeight: 700, marginTop: 8, color: f.selected ? '#0079b0' : undefined }}>{f.label}</div>
              <div style={{ fontSize: 10, color: f.selected ? '#0079b0' : '#9b9c9f', marginTop: 2, fontWeight: f.selected ? 600 : 400 }}>{f.sub}</div>
            </div>
          );
        })}
      </div>

      <StepFooter backLabel="Step 3" onBack={() => setStep(3)} nextLabel="Continue to Step 5 · Execute" onNext={() => setStep(5)} />
    </div>
  );
}

function Step5() {
  const { setStep, go } = useAppState();
  const results = [
    { label: 'Return rate', actual: '41%', vs: 'vs ≥30%', pass: true, width: 68 },
    { label: 'Value recycling (mentions)', actual: '63%', vs: 'vs 50%', pass: true, width: 63 },
    { label: 'Cost per pair', actual: '$4.60', vs: 'vs <$4', pass: false, width: 44 },
  ];
  return (
    <div className="fb-screen">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 18 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Executing · Analyzing · Iterating</h3>
        <span className="serif" style={{ fontSize: 12, color: '#9b9c9f', fontStyle: 'italic' }}>audit → pretest → run → analyze → iterate</span>
      </div>

      <div className="fb-grid2" style={{ display: 'grid', gridTemplateColumns: '.9fr 1.1fr', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20, borderRadius: 14 }}>
          <CardHeading title="Test Audit Checklist" tag="Template 13" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { text: 'Prototype tests the critical assumption', done: true },
              { text: 'Data capture plan works end-to-end', done: true },
              { text: 'Pretested with 3 friendly proxies', done: true },
              { text: 'Documentation running in parallel', done: false },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{
                  width: 18, height: 18, borderRadius: 5, flex: '0 0 auto', marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: item.done ? '#2ea38e' : 'transparent', border: item.done ? 'none' : '1.5px solid #c9cbce',
                }}>{item.done && <Check size={11} weight="bold" color="#fff" />}</span>
                <span style={{ fontSize: 12.5, lineHeight: 1.35 }}>{item.text}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #eef0f2', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 32, height: 32, borderRadius: 9, background: '#eef6f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Broadcast size={17} weight="fill" color="#2ea38e" />
            </span>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>Test is live</div>
              <div style={{ fontSize: 11, color: '#9b9c9f' }}>Day 3 of 60 · 14 bags returned so far</div>
            </div>
          </div>
        </Card>

        <Card style={{ padding: 20, borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 700 }}>Results — threshold vs. actual</h4>
            <span style={{ fontSize: 11, color: '#9b9c9f' }}>projected</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {results.map(r => (
              <div key={r.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{r.label}</span>
                  <span style={{ fontSize: 12 }}>
                    <b style={{ color: r.pass ? '#2ea38e' : '#c25a48' }}>{r.actual}</b> <span style={{ color: '#9b9c9f' }}>{r.vs}</span>{' '}
                    <span style={{ fontSize: 10, fontWeight: 700, color: r.pass ? '#25826f' : '#b5502a', background: r.pass ? '#eef6f3' : '#fdf1ea', borderRadius: 20, padding: '1px 7px', marginLeft: 4 }}>{r.pass ? 'PASS' : 'BELOW'}</span>
                  </span>
                </div>
                <div style={{ height: 7, background: '#eef1f4', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                  <span style={{ display: 'block', height: '100%', width: `${r.width}%`, background: r.pass ? '#2ea38e' : '#d98a7c', borderRadius: 4 }} />
                  <span style={{ position: 'absolute', top: -2, bottom: -2, left: '50%', width: 2, background: '#2c2e35' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ background: '#eef7fc', border: '1px solid #cfe8f6', borderRadius: 14, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <span style={{ width: 36, height: 36, borderRadius: 10, background: '#008ecd', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
          <ArrowsClockwise size={19} weight="fill" color="#fff" />
        </span>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0d3f57', marginBottom: 3 }}>Iterate: desirability confirmed, viability needs work</div>
          <p style={{ margin: 0, fontSize: 12.5, color: '#33607a', lineHeight: 1.5, maxWidth: 680 }}>
            Parents clearly want to recycle and will return shoes — move this component forward to a <b>smoke test</b> on the full subscription value proposition. But processing cost missed threshold: redesign the returns flow to consolidate shipments before the next round.
          </p>
        </div>
        <button onClick={() => go('tests')} className="fb-btn-primary" style={{ flex: '0 0 auto', background: '#008ecd', color: '#fff', border: 'none', borderRadius: 9, padding: '9px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Design next test</button>
      </div>

      <StepFooter backLabel="Step 4" onBack={() => setStep(4)} nextLabel="Log progress" onNext={() => go('progress')} nextColor="#2ea38e" nextHover="#25826f" />
    </div>
  );
}
