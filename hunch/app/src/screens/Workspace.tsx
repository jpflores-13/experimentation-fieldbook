import { useState, type ReactNode, type CSSProperties } from 'react';
import {
  Lightbulb, ArrowLeft, ArrowRight, Image, PlusCircle, Heart, Wrench, ChartLineUp, Check, X,
  Cards, ImageSquare, Package, DeviceMobile, RocketLaunch, Broadcast, Brain, ChatsCircle, Storefront, CursorClick, Flask,
} from '@phosphor-icons/react';
import { useAppState, recommendation } from '../state/AppState';
import type { Step as StepNum, SnapshotRow, AssumptionCategory } from '../types';
import { Card } from '../components/ui';
import { formatOptions } from '../data/workspaceSeed';

const iconMap: Record<string, React.ElementType> = { Brain, ChatsCircle, Storefront, CursorClick, Flask };
const formatIconMap: Record<string, React.ElementType> = { Cards, ImageSquare, Package, DeviceMobile, RocketLaunch };

const steps: { n: StepNum; label: string }[] = [
  { n: 1, label: 'Frame' },
  { n: 2, label: 'Evidence' },
  { n: 3, label: 'Select test' },
  { n: 4, label: 'Prototype' },
  { n: 5, label: 'Execute' },
];

export function Workspace() {
  const { step, setStep, concepts, activeConceptId, createConcept } = useAppState();
  const concept = concepts.find(c => c.id === activeConceptId);

  if (!concept) {
    return (
      <div className="fb-screen" style={{ maxWidth: 560, margin: '90px auto 0', textAlign: 'center', color: '#83878f' }}>
        <p style={{ marginBottom: 16, fontSize: 13.5 }}>No concepts yet — create one to start the guided workflow.</p>
        <button
          onClick={() => createConcept()}
          className="fb-btn-primary"
          style={{ background: '#008ecd', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          Create your first concept
        </button>
      </div>
    );
  }

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

// ---- Inline click-to-edit primitives ------------------------------------

function EditableText({ value, onCommit, placeholder, style }: {
  value: string; onCommit: (v: string) => void; placeholder?: string; style?: CSSProperties;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const commit = () => { onCommit(draft); setEditing(false); };

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onFocus={e => e.target.select()}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') { setDraft(value); setEditing(false); }
        }}
        style={{ font: 'inherit', color: 'inherit', background: '#fff', border: '1.5px solid #9fd0ea', borderRadius: 6, padding: '2px 6px', outline: 'none', minWidth: 0, ...style }}
      />
    );
  }
  return (
    <span onClick={() => { setDraft(value); setEditing(true); }} style={{ cursor: 'text', ...style }}>
      {value ? value : <span style={{ color: '#b0b3b8', fontStyle: 'italic' }}>{placeholder ?? 'click to add…'}</span>}
    </span>
  );
}

function EditableArea({ value, onCommit, placeholder, rows = 2, style }: {
  value: string; onCommit: (v: string) => void; placeholder?: string; rows?: number; style?: CSSProperties;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const commit = () => { onCommit(draft); setEditing(false); };

  if (editing) {
    return (
      <textarea
        autoFocus
        rows={rows}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onFocus={e => e.target.select()}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
        style={{ font: 'inherit', color: 'inherit', lineHeight: 'inherit', background: '#fff', border: '1.5px solid #9fd0ea', borderRadius: 6, padding: 6, outline: 'none', width: '100%', resize: 'vertical', ...style }}
      />
    );
  }
  return (
    <div onClick={() => { setDraft(value); setEditing(true); }} style={{ cursor: 'text', minHeight: 18, ...style }}>
      {value ? value : <span style={{ color: '#b0b3b8', fontStyle: 'italic' }}>{placeholder ?? 'click to add…'}</span>}
    </div>
  );
}

function AddRowButton({ label, onClick, style }: { label: string; onClick: () => void; style?: CSSProperties }) {
  return (
    <button
      onClick={onClick}
      style={{ background: '#f6f8fa', border: '1px dashed #cdd6dc', borderRadius: 9, padding: '9px 11px', fontSize: 11.5, color: '#9b9c9f', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'inherit', ...style }}
    >
      <PlusCircle size={12} /> {label}
    </button>
  );
}

function RowDelete({ onClick, style }: { onClick: () => void; style?: CSSProperties }) {
  return (
    <button
      className="fb-note-delete"
      onClick={e => { e.stopPropagation(); onClick(); }}
      title="Delete"
      style={{ border: 'none', background: 'transparent', color: '#b0b3b8', cursor: 'pointer', padding: 4, display: 'flex', flex: '0 0 auto', opacity: 0, ...style }}
    >
      <X size={13} />
    </button>
  );
}

function ConceptHeader() {
  const { concepts, activeConceptId, updateConcept } = useAppState();
  const concept = concepts.find(c => c.id === activeConceptId);
  if (!concept) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 18, flexWrap: 'wrap' }}>
      <span style={{ width: 44, height: 44, borderRadius: 11, background: '#eef7fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
        <Lightbulb size={23} weight="fill" color="#008ecd" />
      </span>
      <div style={{ flex: 1, minWidth: 180 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
          <EditableText
            value={concept.name}
            onCommit={v => updateConcept(concept.id, { name: v.trim() || concept.name })}
            placeholder="Concept name"
            style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.01em' }}
          />
          <EditableText
            value={concept.org}
            onCommit={v => updateConcept(concept.id, { org: v })}
            placeholder="add organization"
            style={{ fontSize: 11, fontWeight: 600, color: '#25826f', background: '#eef6f3', border: '1px solid #cfe9e2', padding: '2px 9px', borderRadius: 20 }}
          />
        </div>
        <EditableText
          value={concept.description}
          onCommit={v => updateConcept(concept.id, { description: v })}
          placeholder="add a one-line description of what you're testing…"
          style={{ fontSize: 12.5, color: '#83878f' }}
        />
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
  const { concepts, activeConceptId } = useAppState();
  const concept = concepts.find(c => c.id === activeConceptId);
  const metaLine = [concept?.org, concept?.description].filter(Boolean).join(' · ');
  return (
    <div className="fb-print-page">
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 28 }}>
        <img src="/scintilla-mark.svg" width={22} height={22} alt="" />
        <span style={{ fontFamily: "'Work Sans',sans-serif", fontSize: 15, fontWeight: 800, color: '#2c2e35', letterSpacing: '-.03em' }}>scintilla</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#0079b0', letterSpacing: '.05em', textTransform: 'uppercase' }}>· Experimentation workbook</span>
      </div>
      <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 700, letterSpacing: '-.01em' }}>{concept?.name ?? 'Untitled concept'}</h1>
      <div style={{ fontSize: 13, color: '#5b5f67' }}>{metaLine}</div>
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

function CardHeading({ title, tag }: { title: string; tag: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 10, flexWrap: 'wrap' }}>
      <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 700 }}>{title}</h4>
      <span style={{ fontSize: 11, color: '#9b9c9f' }}>{tag}</span>
    </div>
  );
}

function SnapshotRowView({ row, onChangeU1, onChangeU2 }: { row: SnapshotRow; onChangeU1: (v: string) => void; onChangeU2: (v: string) => void }) {
  const tinted = row.id === 'uniquely';
  const labelBg = tinted ? '#eef7fc' : '#fafbfc';
  const valueBg = tinted ? '#eef7fc' : undefined;
  const valueColor = tinted ? '#0d3f57' : '#4a4d55';

  if (row.spanBoth) {
    return (
      <>
        <div style={{ padding: '14px 16px', fontSize: 12.5, fontWeight: 700, background: labelBg, borderBottom: '1px solid #eef0f2' }}>
          {row.label}<div style={{ fontSize: 10.5, color: '#9b9c9f', fontWeight: 500, fontStyle: 'italic' }}>{row.sub}</div>
        </div>
        <div style={{ gridColumn: '2 / -1', padding: 14, fontSize: 12.5, lineHeight: 1.5, borderLeft: '1px solid #eef0f2', borderBottom: '1px solid #eef0f2', background: valueBg, color: valueColor }}>
          <EditableArea value={row.u1} onCommit={onChangeU1} placeholder="describe this…" rows={2} />
        </div>
      </>
    );
  }
  return (
    <>
      <div style={{ padding: '14px 16px', fontSize: 12.5, fontWeight: 700, background: '#fafbfc', borderBottom: '1px solid #eef0f2' }}>
        {row.label}<div style={{ fontSize: 10.5, color: '#9b9c9f', fontWeight: 500, fontStyle: 'italic' }}>{row.sub}</div>
      </div>
      <div style={{ padding: 14, fontSize: 12, lineHeight: 1.5, borderLeft: '1px solid #eef0f2', borderBottom: '1px solid #eef0f2', color: '#4a4d55' }}>
        <EditableArea value={row.u1} onCommit={onChangeU1} placeholder="describe this…" rows={2} />
      </div>
      <div style={{ padding: 14, fontSize: 12, lineHeight: 1.5, borderLeft: '1px solid #eef0f2', borderBottom: '1px solid #eef0f2', color: '#4a4d55' }}>
        <EditableArea value={row.u2} onCommit={onChangeU2} placeholder="describe this…" rows={2} />
      </div>
    </>
  );
}

function Step1() {
  const {
    go, setStep, concepts, activeConceptId, workspaceData,
    updateSnapshotUserLabel, updateSnapshotField, updateStoryboardCaption, toggleStoryboardBlank,
  } = useAppState();
  const concept = concepts.find(c => c.id === activeConceptId);
  const data = workspaceData[activeConceptId];
  if (!concept || !data) return null;
  const { snapshot, storyboard, user1Label, user2Label } = data.step1;

  return (
    <div className="fb-screen">
      <SectionHeading title="Concept Snapshot" note="Template 3 — specific, fresh & worth testing" />
      <Card style={{ overflow: 'hidden', marginBottom: 20, borderRadius: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 1fr' }}>
          <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '150px 1fr 1fr', background: '#f6f8fa', borderBottom: '1px solid #e3e6ea' }}>
            <div style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#83878f', letterSpacing: '.05em' }}>CONCEPT</div>
            <div style={{ padding: '12px 14px', fontSize: 11, fontWeight: 700, color: '#0079b0', borderLeft: '1px solid #e3e6ea', display: 'flex', gap: 4 }}>
              USER 1 · <EditableText value={user1Label} onCommit={v => updateSnapshotUserLabel(concept.id, 'user1Label', v)} placeholder="label this user" />
            </div>
            <div style={{ padding: '12px 14px', fontSize: 11, fontWeight: 700, color: '#0079b0', borderLeft: '1px solid #e3e6ea', display: 'flex', gap: 4 }}>
              USER 2 · <EditableText value={user2Label} onCommit={v => updateSnapshotUserLabel(concept.id, 'user2Label', v)} placeholder="label this user" />
            </div>
          </div>
          {snapshot.map(row => (
            <SnapshotRowView
              key={row.id}
              row={row}
              onChangeU1={v => updateSnapshotField(concept.id, row.id, 'u1', v)}
              onChangeU2={v => updateSnapshotField(concept.id, row.id, 'u2', v)}
            />
          ))}
        </div>
      </Card>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Storyboard</h3>
        <span className="serif" style={{ fontSize: 12, color: '#9b9c9f', fontStyle: 'italic' }}>Template 4 — click a frame to mark it blank for co-creation</span>
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 6 }}>
        {storyboard.map((f, i) => (
          <div key={f.id} style={{ flex: '0 0 190px' }}>
            <div onClick={() => toggleStoryboardBlank(concept.id, f.id)} style={{ cursor: 'pointer' }}>
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
            </div>
            <div style={{ fontSize: 11.5, color: f.blank ? '#b0b3b8' : '#5b5f67', marginTop: 7, lineHeight: 1.35, display: 'flex', gap: 4 }}>
              <span>{i + 1} ·</span>
              <EditableText
                value={f.caption}
                onCommit={v => updateStoryboardCaption(concept.id, f.id, v)}
                placeholder={f.blank ? '(blank on purpose)' : 'describe this frame…'}
                style={{ flex: 1 }}
              />
            </div>
          </div>
        ))}
      </div>

      <StepFooter backLabel="Value/Effort Matrix" onBack={() => go('concepts')} nextLabel="Continue to Step 2 · Evidence" onNext={() => setStep(2)} />
    </div>
  );
}

const assumptionMeta: Record<AssumptionCategory, { title: string; color: string; textColor: string; icon: React.ElementType; bg: string; border: string }> = {
  desirability: { title: 'Desirability', color: '#008ecd', textColor: '#0079b0', icon: Heart, bg: '#eef7fc', border: '#d6ecf8' },
  feasibility: { title: 'Feasibility', color: '#2ea38e', textColor: '#25826f', icon: Wrench, bg: '#eef6f3', border: '#d4ebe4' },
  viability: { title: 'Viability', color: '#5b6b7a', textColor: '#4c5966', icon: ChartLineUp, bg: '#f3f5f7', border: '#e3e7ea' },
};
const assumptionCategories: AssumptionCategory[] = ['desirability', 'feasibility', 'viability'];

function Step2() {
  const {
    setStep, concepts, activeConceptId, workspaceData,
    addAssumption, updateAssumption, deleteAssumption, addEvidenceRow, updateEvidenceField, deleteEvidenceRow,
  } = useAppState();
  const concept = concepts.find(c => c.id === activeConceptId);
  const data = workspaceData[activeConceptId];
  if (!concept || !data) return null;
  const { assumptions, evidence } = data.step2;

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
        {assumptionCategories.map(cat => {
          const meta = assumptionMeta[cat];
          const Icon = meta.icon;
          const items = assumptions[cat];
          return (
            <Card key={cat} style={{ borderTop: `3px solid ${meta.color}`, padding: 16, borderRadius: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Icon size={16} weight="fill" color={meta.color} />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: meta.textColor }}>{meta.title}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.map(item => (
                  <div key={item.id} className="fb-note" style={{ position: 'relative', background: meta.bg, border: `1px solid ${meta.border}`, borderRadius: 9, padding: '9px 26px 9px 11px', fontSize: 12, lineHeight: 1.4, fontWeight: 500 }}>
                    <EditableArea value={item.text} onCommit={v => updateAssumption(concept.id, cat, item.id, v)} rows={1} placeholder="new assumption…" />
                    <RowDelete onClick={() => deleteAssumption(concept.id, cat, item.id)} style={{ position: 'absolute', top: 4, right: 4 }} />
                  </div>
                ))}
                <AddRowButton label="add assumption" onClick={() => addAssumption(concept.id, cat)} />
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
                  <div style={{ fontSize: 10, fontWeight: 700, lineHeight: 1.25, color: '#b5502a' }}>Most critical, most unknown</div>
                  <div style={{ fontSize: 8.5, color: '#c98a6f', fontWeight: 600, marginTop: 2 }}>TEST FIRST</div>
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
      <Card style={{ overflow: 'hidden', overflowX: 'auto', borderRadius: 14, marginBottom: 10 }}>
        <div style={{ minWidth: 760 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.5fr 1.2fr 1fr 40px', background: '#f6f8fa', borderBottom: '1px solid #e3e6ea', fontSize: 10.5, fontWeight: 700, color: '#83878f', letterSpacing: '.04em' }}>
            <div style={{ padding: '11px 14px' }}>ASSUMPTION</div>
            <div style={{ padding: '11px 14px', borderLeft: '1px solid #e9ecef' }}>EVIDENCE</div>
            <div style={{ padding: '11px 14px', borderLeft: '1px solid #e9ecef' }}>THRESHOLD → ASPIRATIONAL</div>
            <div style={{ padding: '11px 14px', borderLeft: '1px solid #e9ecef' }}>SOURCE</div>
            <div />
          </div>
          {evidence.map((r, i) => (
            <div key={r.id} className="fb-note fb-hover fb-hover-bg" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.5fr 1.2fr 1fr 40px', borderBottom: i < evidence.length - 1 ? '1px solid #eef0f2' : 'none', fontSize: 12, lineHeight: 1.45, alignItems: 'center' }}>
              <div style={{ padding: '13px 14px', fontWeight: 600 }}><EditableText value={r.assumption} onCommit={v => updateEvidenceField(concept.id, r.id, 'assumption', v)} /></div>
              <div style={{ padding: '13px 14px', borderLeft: '1px solid #f0f2f4', color: '#4a4d55' }}><EditableText value={r.evidence} onCommit={v => updateEvidenceField(concept.id, r.id, 'evidence', v)} /></div>
              <div style={{ padding: '13px 14px', borderLeft: '1px solid #f0f2f4', display: 'flex', alignItems: 'center', gap: 4 }}>
                <EditableText value={r.threshold} onCommit={v => updateEvidenceField(concept.id, r.id, 'threshold', v)} style={{ fontWeight: 700, color: '#0079b0' }} />
                <span style={{ color: '#9b9c9f' }}>→</span>
                <EditableText value={r.aspirational} onCommit={v => updateEvidenceField(concept.id, r.id, 'aspirational', v)} style={{ color: '#9b9c9f' }} />
              </div>
              <div style={{ padding: '13px 14px', borderLeft: '1px solid #f0f2f4', color: '#4a4d55' }}><EditableText value={r.source} onCommit={v => updateEvidenceField(concept.id, r.id, 'source', v)} /></div>
              <RowDelete onClick={() => deleteEvidenceRow(concept.id, r.id)} style={{ margin: '0 auto' }} />
            </div>
          ))}
        </div>
      </Card>
      <AddRowButton label="add evidence row" onClick={() => addEvidenceRow(concept.id)} style={{ marginBottom: 24 }} />

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

const dataSortColor: Record<string, string> = { 'KNOW NOW': '#25826f', KNOWABLE: '#0079b0', 'FIELD ONLY': '#b5502a' };
const dataSortBg: Record<string, string> = { 'KNOW NOW': '#eef6f3', KNOWABLE: '#eef7fc', 'FIELD ONLY': '#fdf1ea' };

function Step3() {
  const {
    setStep, go, concepts, activeConceptId, workspaceData,
    setConceptQ1, setConceptQ2, setConceptQ3, setConceptSaydo, updateDigestField, confirmTest,
  } = useAppState();
  const concept = concepts.find(c => c.id === activeConceptId);
  const data = workspaceData[activeConceptId];
  const [confirmed, setConfirmed] = useState(false);
  if (!concept || !data) return null;
  const { q1, q2, q3, saydo, dataSort, digest } = data.step3;
  const rec = recommendation(q1, q2, q3);
  const RecIcon = rec ? iconMap[rec.icon] : Flask;

  const digestCells: { k: string; field: 'testType' | 'prototype' | 'participants' | 'sampleTimeframe'; subField: 'testTypeSub' | 'prototypeSub' | 'participantsSub' | 'sampleTimeframeSub' }[] = [
    { k: 'TEST TYPE', field: 'testType', subField: 'testTypeSub' },
    { k: 'PROTOTYPE', field: 'prototype', subField: 'prototypeSub' },
    { k: 'PARTICIPANTS', field: 'participants', subField: 'participantsSub' },
    { k: 'SAMPLE · TIMEFRAME', field: 'sampleTimeframe', subField: 'sampleTimeframeSub' },
  ];

  return (
    <div className="fb-screen">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 18 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Selecting your test</h3>
        <span className="serif" style={{ fontSize: 12, color: '#9b9c9f', fontStyle: 'italic' }}>a funnel of three questions → one test type</span>
      </div>

      <div className="fb-grid2" style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20, borderRadius: 14 }}>
          <CardHeading title="Test Decision Flow" tag="Template 10 · interactive" />
          <QRow label="Q1" question="Does data already exist to test this critical assumption?" options={[
            { key: 'yes', text: 'Yes — analyze it', active: q1 === 'yes', onClick: () => setConceptQ1(concept.id, 'yes') },
            { key: 'no', text: 'No — go to field', active: q1 === 'no', onClick: () => setConceptQ1(concept.id, 'no') },
          ]} />
          <QRow label="Q2" question="Test a component, or the whole concept?" options={[
            { key: 'component', text: 'Component', active: q2 === 'component', onClick: () => setConceptQ2(concept.id, 'component') },
            { key: 'whole', text: 'Whole concept', active: q2 === 'whole', onClick: () => setConceptQ2(concept.id, 'whole') },
          ]} />
          <QRow label="Q3" question="Do you need Say data or Do data?" options={[
            { key: 'say', text: 'Say data', active: q3 === 'say', onClick: () => setConceptQ3(concept.id, 'say') },
            { key: 'do', text: 'Do data', active: q3 === 'do', onClick: () => setConceptQ3(concept.id, 'do') },
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
              <button
                onClick={() => updateDigestField(concept.id, 'testType', rec.name)}
                style={{ position: 'relative', marginTop: 14, alignSelf: 'flex-start', fontSize: 11, fontWeight: 600, color: '#0d3f57', background: '#fff', border: 'none', borderRadius: 20, padding: '5px 11px', cursor: 'pointer' }}
              >
                Use in Test Digest
              </button>
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
            <input type="range" min={0} max={100} value={saydo} onChange={e => setConceptSaydo(concept.id, Number(e.target.value))} style={{ width: '100%' }} />
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
            {dataSort.length === 0 && (
              <div style={{ fontSize: 11.5, color: '#b0b3b8', fontStyle: 'italic' }}>No data-sort notes yet for this concept.</div>
            )}
            {dataSort.map(row => (
              <div key={row.id} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: dataSortColor[row.tag], background: dataSortBg[row.tag], borderRadius: 6, padding: '3px 7px', flex: '0 0 auto', width: 96, textAlign: 'center' }}>{row.tag}</span>
                <span style={{ fontSize: 11.5 }}>{row.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <h4 style={{ margin: '0 0 11px', fontSize: 13.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
        Test Digest <span style={{ fontWeight: 500, color: '#9b9c9f', fontSize: 11.5 }}>· Template 11 — the one-page test summary</span>
      </h4>
      <Card style={{ padding: 20, borderRadius: 14, marginBottom: 14 }}>
        <div className="fb-grid4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {digestCells.map(cell => (
            <div key={cell.k}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#83878f', letterSpacing: '.04em', marginBottom: 5 }}>{cell.k}</div>
              <EditableText value={digest[cell.field]} onCommit={v => updateDigestField(concept.id, cell.field, v)} placeholder="add…" style={{ fontSize: 13, fontWeight: 700, color: '#0079b0', display: 'block' }} />
              <EditableText value={digest[cell.subField]} onCommit={v => updateDigestField(concept.id, cell.subField, v)} placeholder="add detail…" style={{ fontSize: 11, color: '#9b9c9f', display: 'block', marginTop: 2 }} />
            </div>
          ))}
        </div>
      </Card>

      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <span className="serif" style={{ fontSize: 11.5, color: '#9b9c9f', fontStyle: 'italic' }}>Confirming logs this test into your Tests tracker as "In field."</span>
        <button
          onClick={() => { confirmTest(concept.id); setConfirmed(true); }}
          className="fb-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#008ecd', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 16px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          <Flask size={14} weight="fill" /> Confirm test → log to Tests
        </button>
      </div>
      {confirmed && (
        <div className="no-print" style={{ marginTop: -14, marginBottom: 24, background: '#eef6f3', border: '1px solid #cfe9e2', borderRadius: 9, padding: '9px 12px', fontSize: 12, color: '#25826f', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Check size={14} weight="bold" /> Logged.{' '}
          <span onClick={() => go('tests')} style={{ cursor: 'pointer', textDecoration: 'underline', color: '#0079b0', fontWeight: 600 }}>View it in Tests →</span>
        </div>
      )}

      <StepFooter backLabel="Step 2" onBack={() => setStep(2)} nextLabel="Continue to Step 4 · Prototype" onNext={() => setStep(4)} />
    </div>
  );
}

function Step4() {
  const {
    setStep, concepts, activeConceptId, workspaceData,
    setConceptFidelity, selectFormat, toggleResearchGuideItem,
  } = useAppState();
  const concept = concepts.find(c => c.id === activeConceptId);
  const data = workspaceData[activeConceptId];
  if (!concept || !data) return null;
  const { fidelity, selectedFormat, researchGuide } = data.step4;

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
            <input type="range" min={0} max={100} value={fidelity} onChange={e => setConceptFidelity(concept.id, Number(e.target.value))} style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#5b6b7a' }}>LOW FIDELITY</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0079b0' }}>HIGH FIDELITY</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[{ label: 'Form', hint: 'how it looks', v: Math.max(6, fidelity - 12) }, { label: 'Function', hint: 'how it works', v: fidelity }, { label: 'Interactivity', hint: 'how it engages', v: Math.min(100, fidelity + 12) }].map(row => (
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
          <CardHeading title="Research Guide" tag="consistent testers, right data" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {researchGuide.map(item => (
              <div key={item.id} onClick={() => toggleResearchGuideItem(concept.id, item.id)} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                <span style={{
                  width: 18, height: 18, borderRadius: 5, flex: '0 0 auto', marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: item.done ? '#2ea38e' : 'transparent', border: item.done ? 'none' : '1.5px solid #c9cbce',
                }}>{item.done && <Check size={11} weight="bold" color="#fff" />}</span>
                <span style={{ fontSize: 12.5, lineHeight: 1.35 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <h4 style={{ margin: '0 0 11px', fontSize: 13.5, fontWeight: 700 }}>Choose a format <span style={{ fontWeight: 500, color: '#9b9c9f', fontSize: 11.5 }}>· pick the fastest one that does the job</span></h4>
      <div className="fb-grid4" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
        {formatOptions.map(f => {
          const Icon = formatIconMap[f.icon];
          const selected = f.id === selectedFormat;
          return (
            <div key={f.id} onClick={() => selectFormat(concept.id, f.id)} style={{
              cursor: 'pointer',
              background: selected ? '#eef7fc' : '#fff', border: selected ? '1.5px solid #008ecd' : '1px solid #e7eaee',
              borderRadius: 12, padding: 14, textAlign: 'center', opacity: selected ? 1 : .75,
              boxShadow: selected ? '0 3px 12px rgba(0,142,205,.14)' : 'none',
            }}>
              <Icon size={22} weight={selected ? 'fill' : 'regular'} color={selected ? '#008ecd' : '#5b6b7a'} style={{ margin: '0 auto', display: 'block' }} />
              <div style={{ fontSize: 12, fontWeight: 700, marginTop: 8, color: selected ? '#0079b0' : undefined }}>{f.label}</div>
              <div style={{ fontSize: 10, color: selected ? '#0079b0' : '#9b9c9f', marginTop: 2, fontWeight: selected ? 600 : 400 }}>{f.sub}{selected ? ' · selected' : ''}</div>
            </div>
          );
        })}
      </div>

      <StepFooter backLabel="Step 3" onBack={() => setStep(3)} nextLabel="Continue to Step 5 · Execute" onNext={() => setStep(5)} />
    </div>
  );
}

function Step5() {
  const {
    setStep, go, concepts, activeConceptId, workspaceData,
    toggleAuditItem, updateResultField, addResultRow, deleteResultRow, updateIterateNote, updateLiveStatus,
  } = useAppState();
  const concept = concepts.find(c => c.id === activeConceptId);
  const data = workspaceData[activeConceptId];
  if (!concept || !data) return null;
  const { audit, liveStatusLabel, liveStatusNote, results, iterateNote } = data.step5;

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
            {audit.map(item => (
              <div key={item.id} onClick={() => toggleAuditItem(concept.id, item.id)} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                <span style={{
                  width: 18, height: 18, borderRadius: 5, flex: '0 0 auto', marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: item.done ? '#2ea38e' : 'transparent', border: item.done ? 'none' : '1.5px solid #c9cbce',
                }}>{item.done && <Check size={11} weight="bold" color="#fff" />}</span>
                <span style={{ fontSize: 12.5, lineHeight: 1.35 }}>{item.label}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #eef0f2', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 32, height: 32, borderRadius: 9, background: liveStatusLabel === 'Not started' ? '#f1f3f6' : '#eef6f3', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
              <Broadcast size={17} weight="fill" color={liveStatusLabel === 'Not started' ? '#9b9c9f' : '#2ea38e'} />
            </span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <EditableText value={liveStatusLabel} onCommit={v => updateLiveStatus(concept.id, v, liveStatusNote)} style={{ fontSize: 12.5, fontWeight: 700, display: 'block' }} placeholder="status" />
              <EditableText value={liveStatusNote} onCommit={v => updateLiveStatus(concept.id, liveStatusLabel, v)} style={{ fontSize: 11, color: '#9b9c9f', display: 'block' }} placeholder="add a status note…" />
            </div>
          </div>
        </Card>

        <Card style={{ padding: 20, borderRadius: 14 }}>
          <CardHeading title="Results — threshold vs. actual" tag="projected" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 12 }}>
            {results.length === 0 && <div style={{ fontSize: 11.5, color: '#b0b3b8', fontStyle: 'italic' }}>No results logged yet.</div>}
            {results.map(r => {
              const pass = r.comparison === 'gte' ? r.actual >= r.threshold : r.actual <= r.threshold;
              const ratio = r.comparison === 'gte' ? (r.threshold ? r.actual / r.threshold : 0) : (r.actual ? r.threshold / r.actual : 0);
              const width = Math.max(6, Math.min(100, ratio * 55));
              return (
                <div key={r.id} className="fb-note">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5, gap: 8 }}>
                    <EditableText value={r.label} onCommit={v => updateResultField(concept.id, r.id, 'label', v)} style={{ fontSize: 12, fontWeight: 600 }} />
                    <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, flex: '0 0 auto' }}>
                      <b style={{ color: pass ? '#2ea38e' : '#c25a48', display: 'flex', alignItems: 'center' }}>
                        <EditableText value={String(r.actual)} onCommit={v => updateResultField(concept.id, r.id, 'actual', Number(v) || 0)} style={{ width: 44, display: 'inline-block', textAlign: 'right' }} />
                        {r.unit}
                      </b>
                      <span style={{ color: '#9b9c9f', display: 'flex', alignItems: 'center', gap: 3 }}>
                        vs {r.comparison === 'gte' ? '≥' : '≤'}
                        <EditableText value={String(r.threshold)} onCommit={v => updateResultField(concept.id, r.id, 'threshold', Number(v) || 0)} style={{ width: 40, display: 'inline-block' }} />
                        {r.unit}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: pass ? '#25826f' : '#b5502a', background: pass ? '#eef6f3' : '#fdf1ea', borderRadius: 20, padding: '1px 7px' }}>{pass ? 'PASS' : 'BELOW'}</span>
                      <RowDelete onClick={() => deleteResultRow(concept.id, r.id)} />
                    </span>
                  </div>
                  <div style={{ height: 7, background: '#eef1f4', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                    <span style={{ display: 'block', height: '100%', width: `${width}%`, background: pass ? '#2ea38e' : '#d98a7c', borderRadius: 4 }} />
                    <span style={{ position: 'absolute', top: -2, bottom: -2, left: '50%', width: 2, background: '#2c2e35' }} />
                  </div>
                </div>
              );
            })}
          </div>
          <AddRowButton label="add result" onClick={() => addResultRow(concept.id)} />
        </Card>
      </div>

      <div style={{ background: '#eef7fc', border: '1px solid #cfe8f6', borderRadius: 14, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <span style={{ width: 36, height: 36, borderRadius: 10, background: '#008ecd', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
          <Check size={19} weight="bold" color="#fff" />
        </span>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0d3f57', marginBottom: 5 }}>Iterate</div>
          <EditableArea
            value={iterateNote}
            onCommit={v => updateIterateNote(concept.id, v)}
            rows={3}
            placeholder="What did you learn? What moves forward, what needs to change?"
            style={{ fontSize: 12.5, color: '#33607a', lineHeight: 1.5, maxWidth: 680 }}
          />
        </div>
        <button onClick={() => go('tests')} className="fb-btn-primary" style={{ flex: '0 0 auto', background: '#008ecd', color: '#fff', border: 'none', borderRadius: 9, padding: '9px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Design next test</button>
      </div>

      <StepFooter backLabel="Step 4" onBack={() => setStep(4)} nextLabel="Log progress" onNext={() => go('progress')} nextColor="#2ea38e" nextHover="#25826f" />
    </div>
  );
}
