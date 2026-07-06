import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ReactFlow, ReactFlowProvider, Background, BackgroundVariant, Handle, Position, BaseEdge, EdgeLabelRenderer,
  useNodesState, useEdgesState, useReactFlow, useInternalNode,
  type Node, type Edge, type NodeProps, type EdgeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Graph, Target, ArrowsClockwise, ArrowsCounterClockwise, Shapes, Star, Sparkle, Plus,
  ArrowBendUpRight, PlusCircle, Eye, Sliders, ArrowLeft, X, Trash,
  ChartPolar, CaretRight, Copy, LockSimple, LockSimpleOpen,
} from '@phosphor-icons/react';
import { useAppState } from '../state/AppState';
import { archetypes, archetypeById, type GlyphSpec } from '../data/archetypes';
import type { SysTab, Ring, StarRating, SupportNote, LoopGraph, Polarity, FiveRElement, FiveRDiagnostic } from '../types';
import { ACTIVE_MAP_ID } from '../data/systemsSeed';
import { detectLoops, loopBadgeText, loopColors } from '../state/loopAnalysis';
import { fiveRElements, fiveRMeta, fiveRQuestions } from '../data/fiveRsQuestions';
import { Card } from '../components/ui';
import { EditableText } from '../components/EditableText';
import { PopoutButton } from '../components/PopoutButton';

const tabs: { key: SysTab; label: string; icon: React.ElementType }[] = [
  { key: 'support', label: 'System Support Map', icon: Target },
  { key: 'loops', label: 'Feedback Loops', icon: ArrowsClockwise },
  { key: 'fiveRs', label: '5Rs Diagnostic', icon: ChartPolar },
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
      {sysTab === 'fiveRs' && <FiveRsTab />}
      {sysTab === 'archetypes' && <ArchetypesTab />}
    </div>
  );
}

function LegendRow({ swatch, border, onClear, children }: { swatch: string; border: string; onClear?: () => void; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <span style={{ width: 16, height: 16, borderRadius: 4, background: swatch, border: `1px solid ${border}`, flex: '0 0 auto' }} />
      <span style={{ fontSize: 12.5, flex: 1 }}>{children}</span>
      {onClear && (
        <button
          onClick={onClear}
          title="Clear"
          style={{ border: 'none', background: 'transparent', color: '#b0b3b8', cursor: 'pointer', padding: 2, display: 'flex', flex: '0 0 auto' }}
        >
          <Trash size={12} />
        </button>
      )}
    </div>
  );
}

const ringStyles: Record<Exclude<Ring, 'role'>, { bg: string; border: string; color: string }> = {
  responsibility: { bg: '#ffd6a5', border: '#eab26a', color: '#6b4a1e' },
  need: { bg: '#ffc2c2', border: '#e59595', color: '#7a3838' },
  resource: { bg: '#bfe0f5', border: '#86c3e6', color: '#204a63' },
  wish: { bg: '#c3e8d7', border: '#83ccae', color: '#245c47' },
};

const starColor: Record<StarRating, string> = { helpful: '#2ea38e', neutral: '#83878f', unhelpful: '#c25a48' };

function CenterRoleNote({ note }: { note: SupportNote }) {
  const { renameSupportNote } = useAppState();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.text);

  const commit = () => {
    renameSupportNote(ACTIVE_MAP_ID, note.id, draft);
    setEditing(false);
  };

  return (
    <div
      onClick={() => { if (!editing) { setDraft(note.text); setEditing(true); } }}
      style={{
        position: 'absolute', inset: '40%', borderRadius: '50%', background: '#fde6a9', border: '2px solid #ecc65f',
        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: '0 3px 12px rgba(236,198,95,.3)',
        cursor: editing ? 'text' : 'pointer', padding: 8,
      }}
    >
      {editing ? (
        <input
          autoFocus
          onFocus={e => e.target.select()}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') { setDraft(note.text); setEditing(false); }
          }}
          style={{ width: '90%', textAlign: 'center', fontSize: 11.5, fontWeight: 700, color: '#7a5c11', background: 'transparent', border: 'none', borderBottom: '1px solid #7a5c11', outline: 'none' }}
        />
      ) : (
        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#7a5c11', lineHeight: 1.15 }}>{note.text}</span>
      )}
    </div>
  );
}

function RingNote({ note, containerRef, startEditing, onEditStarted }: {
  note: SupportNote;
  containerRef: React.RefObject<HTMLDivElement | null>;
  startEditing: boolean;
  onEditStarted: () => void;
}) {
  const { renameSupportNote, moveSupportNote, deleteSupportNote, cycleSupportNoteStar } = useAppState();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.text);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const dragInfo = useRef<{ startX: number; startY: number; origX: number; origY: number; moved: boolean } | null>(null);

  useEffect(() => {
    if (startEditing) {
      setDraft(note.text);
      setEditing(true);
      onEditStarted();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startEditing]);

  const ring = note.ring as Exclude<Ring, 'role'>;
  const style = ringStyles[ring];
  const pos = dragPos ?? { x: note.x, y: note.y };

  const commit = () => {
    renameSupportNote(ACTIVE_MAP_ID, note.id, draft || note.text);
    setEditing(false);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (editing) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragInfo.current = { startX: e.clientX, startY: e.clientY, origX: note.x, origY: note.y, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragInfo.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dxPct = ((e.clientX - dragInfo.current.startX) / rect.width) * 100;
    const dyPct = ((e.clientY - dragInfo.current.startY) / rect.height) * 100;
    if (Math.abs(dxPct) + Math.abs(dyPct) > 0.6) dragInfo.current.moved = true;
    const nx = Math.min(97, Math.max(3, dragInfo.current.origX + dxPct));
    const ny = Math.min(97, Math.max(3, dragInfo.current.origY + dyPct));
    setDragPos({ x: nx, y: ny });
  };
  const onPointerUp = () => {
    if (!dragInfo.current) return;
    if (dragInfo.current.moved && dragPos) {
      moveSupportNote(ACTIVE_MAP_ID, note.id, dragPos.x, dragPos.y);
    } else if (!dragInfo.current.moved) {
      setDraft(note.text);
      setEditing(true);
    }
    dragInfo.current = null;
    setDragPos(null);
  };

  return (
    <div
      className="fb-note fb-support-note"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: 'absolute', top: `${pos.y}%`, left: `${pos.x}%`, transform: 'translate(-50%,-50%)',
        background: style.bg, border: `1px solid ${style.border}`, borderRadius: 7, padding: '5px 8px',
        fontSize: 9.5, fontWeight: 600, color: style.color, maxWidth: editing ? 170 : 90, lineHeight: 1.2,
        boxShadow: '0 2px 5px rgba(0,0,0,.06)', display: 'flex', alignItems: 'center', gap: 4,
        cursor: editing ? 'text' : 'grab', userSelect: 'none', touchAction: 'none', zIndex: editing || dragInfo.current ? 3 : 1,
      }}
    >
      {ring === 'resource' && !editing && (
        <button
          onPointerDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); cycleSupportNoteStar(ACTIVE_MAP_ID, note.id); }}
          style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', display: 'flex', flex: '0 0 auto' }}
          title="Cycle helpful / neutral / unhelpful"
        >
          <Star size={10} weight="fill" color={starColor[note.star ?? 'neutral']} />
        </button>
      )}
      {ring === 'wish' && !editing && <Sparkle size={9} weight="fill" color="#2ea38e" style={{ flex: '0 0 auto' }} />}
      {editing ? (
        <input
          autoFocus
          onFocus={e => e.target.select()}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') { setDraft(note.text); setEditing(false); }
          }}
          onPointerDown={e => e.stopPropagation()}
          style={{ fontSize: 9.5, fontWeight: 600, color: style.color, background: 'transparent', border: 'none', borderBottom: `1px solid ${style.color}`, outline: 'none', width: 140 }}
        />
      ) : (
        <span style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minWidth: 0, flex: '1 1 auto' }}>{note.text}</span>
      )}
      {!editing && (
        <button
          className="fb-note-delete"
          onPointerDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); deleteSupportNote(ACTIVE_MAP_ID, note.id); }}
          style={{
            border: 'none', background: 'rgba(0,0,0,.14)', borderRadius: '50%', width: 14, height: 14, flex: '0 0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: style.color,
            padding: 0, marginLeft: 1, opacity: 0,
          }}
          title="Delete"
        >
          <X size={8} weight="bold" />
        </button>
      )}
    </div>
  );
}

export function SupportMapTab() {
  const { supportMaps, addSupportNote, renameSupportMap, clearSupportRing, clearSupportMap } = useAppState();
  const map = supportMaps[ACTIVE_MAP_ID];
  const containerRef = useRef<HTMLDivElement>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const roleNote = map.notes.find(n => n.ring === 'role');
  const ringNotes = map.notes.filter(n => n.ring !== 'role');

  const handleAdd = (ring: Exclude<Ring, 'role'>) => {
    setJustAddedId(addSupportNote(ACTIVE_MAP_ID, ring));
  };

  return (
    <div className="fb-screen fb-grid2" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18 }}>
      <Card style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, gap: 10, flexWrap: 'wrap' }}>
          <EditableText
            value={map.title}
            onCommit={v => renameSupportMap(ACTIVE_MAP_ID, v)}
            placeholder="Untitled support map"
            style={{ fontSize: 14.5, fontWeight: 700 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: '#9b9c9f' }}>role-centred map · click a note to rename, drag to move</span>
            <button
              onClick={() => { if (window.confirm('Clear the whole map? All notes will be removed and the role reset.')) clearSupportMap(ACTIVE_MAP_ID); }}
              title="Clear map"
              style={{ border: '1px solid #f0d7d2', background: '#fff', borderRadius: 6, padding: '5px 9px', fontSize: 11.5, fontWeight: 600, color: '#b5502a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
            ><Trash size={13} /> Clear all</button>
            <PopoutButton tool="support" />
          </div>
        </div>
        <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: 520, margin: '16px auto 0', aspectRatio: '1/1' }}>
          <div style={{ position: 'absolute', inset: '1%', borderRadius: '50%', border: '1.5px solid #a9d4ef', background: 'rgba(191,224,245,.10)' }} />
          <div style={{ position: 'absolute', inset: '16%', borderRadius: '50%', border: '1.5px solid #efb0b0', background: 'rgba(255,194,194,.10)' }} />
          <div style={{ position: 'absolute', inset: '31%', borderRadius: '50%', border: '1.5px solid #eec18a', background: 'rgba(255,214,165,.12)' }} />

          <span style={{ position: 'absolute', top: '2.5%', left: '50%', transform: 'translateX(-50%)', fontSize: 9.5, fontWeight: 700, letterSpacing: '.06em', color: '#4a90c2', background: '#fff', padding: '0 5px' }}>RESOURCES</span>
          <span style={{ position: 'absolute', top: '17%', left: '50%', transform: 'translateX(-50%)', fontSize: 9.5, fontWeight: 700, letterSpacing: '.06em', color: '#cc6b6b', background: '#fff', padding: '0 5px' }}>NEEDS</span>
          <span style={{ position: 'absolute', top: '32%', left: '50%', transform: 'translateX(-50%)', fontSize: 9.5, fontWeight: 700, letterSpacing: '.06em', color: '#c58a3f', background: '#fff', padding: '0 5px' }}>RESPONSIBILITIES</span>

          {roleNote && <CenterRoleNote note={roleNote} />}
          {ringNotes.map(n => (
            <RingNote key={n.id} note={n} containerRef={containerRef} startEditing={justAddedId === n.id} onEditStarted={() => setJustAddedId(null)} />
          ))}
        </div>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card style={{ padding: 18, borderRadius: 14 }}>
          <h4 style={{ margin: '0 0 12px', fontSize: 13.5, fontWeight: 700 }}>Legend</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <LegendRow swatch="#fde6a9" border="#ecc65f" onClear={() => { if (window.confirm('Reset the role note to its default text?')) clearSupportRing(ACTIVE_MAP_ID, 'role'); }}><b>Role</b> — you, at the centre</LegendRow>
            <LegendRow swatch="#ffd6a5" border="#eab26a" onClear={() => { if (window.confirm('Clear all responsibility notes?')) clearSupportRing(ACTIVE_MAP_ID, 'responsibility'); }}><b>Responsibilities</b> — what you do</LegendRow>
            <LegendRow swatch="#ffc2c2" border="#e59595" onClear={() => { if (window.confirm('Clear all need notes?')) clearSupportRing(ACTIVE_MAP_ID, 'need'); }}><b>Needs</b> — what each duty requires</LegendRow>
            <LegendRow swatch="#bfe0f5" border="#86c3e6" onClear={() => { if (window.confirm('Clear all resource notes?')) clearSupportRing(ACTIVE_MAP_ID, 'resource'); }}><b>Resources</b> — what you draw on</LegendRow>
            <LegendRow swatch="#c3e8d7" border="#83ccae" onClear={() => { if (window.confirm('Clear all wish notes?')) clearSupportRing(ACTIVE_MAP_ID, 'wish'); }}><b>Wishes</b> — what would help</LegendRow>
          </div>
          <div style={{ marginTop: 13, paddingTop: 12, borderTop: '1px solid #eef0f2', display: 'flex', gap: 14 }}>
            <span style={{ fontSize: 11, color: '#5b5f67', display: 'flex', alignItems: 'center', gap: 5 }}><Star size={12} weight="fill" color="#2ea38e" /> helpful</span>
            <span style={{ fontSize: 11, color: '#5b5f67', display: 'flex', alignItems: 'center', gap: 5 }}><Star size={12} weight="fill" color="#83878f" /> neutral</span>
            <span style={{ fontSize: 11, color: '#5b5f67', display: 'flex', alignItems: 'center', gap: 5 }}><Star size={12} weight="fill" color="#c25a48" /> unhelpful</span>
          </div>
          <div style={{ fontSize: 10.5, color: '#9b9c9f', marginTop: 8 }}>Click a resource note's star to cycle it.</div>
        </Card>

        <Card style={{ padding: 18, borderRadius: 14 }}>
          <h4 style={{ margin: '0 0 10px', fontSize: 13.5, fontWeight: 700 }}>Add to the map</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            <button onClick={() => handleAdd('responsibility')} style={{ fontSize: 11.5, fontWeight: 600, color: '#6b4a1e', background: '#fff4e6', border: '1px solid #eab26a', borderRadius: 8, padding: '6px 11px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Plus size={11} /> Responsibility</button>
            <button onClick={() => handleAdd('need')} style={{ fontSize: 11.5, fontWeight: 600, color: '#7a3838', background: '#fff0f0', border: '1px solid #e59595', borderRadius: 8, padding: '6px 11px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Plus size={11} /> Need</button>
            <button onClick={() => handleAdd('resource')} style={{ fontSize: 11.5, fontWeight: 600, color: '#204a63', background: '#eef7fc', border: '1px solid #86c3e6', borderRadius: 8, padding: '6px 11px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Plus size={11} /> Resource</button>
            <button onClick={() => handleAdd('wish')} style={{ fontSize: 11.5, fontWeight: 600, color: '#245c47', background: '#eef6f3', border: '1px solid #83ccae', borderRadius: 8, padding: '6px 11px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Plus size={11} /> Wish</button>
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

const loopGraphId = ACTIVE_MAP_ID;

function rectIntersection(cx: number, cy: number, hw: number, hh: number, dx: number, dy: number) {
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const scaleX = dx !== 0 ? hw / Math.abs(dx) : Infinity;
  const scaleY = dy !== 0 ? hh / Math.abs(dy) : Infinity;
  const scale = Math.min(scaleX, scaleY);
  return { x: cx + dx * scale, y: cy + dy * scale };
}

function curvedEdgePath(sx: number, sy: number, tx: number, ty: number, curvature: number) {
  const mx = (sx + tx) / 2;
  const my = (sy + ty) / 2;
  const dx = tx - sx;
  const dy = ty - sy;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const offset = len * curvature;
  const cx = mx + nx * offset;
  const cy = my + ny * offset;
  const labelX = 0.25 * sx + 0.5 * cx + 0.25 * tx;
  const labelY = 0.25 * sy + 0.5 * cy + 0.25 * ty;
  return { path: `M ${sx},${sy} Q ${cx},${cy} ${tx},${ty}`, labelX, labelY };
}

const nodeToneStyle: Record<'neutral' | 'blue' | 'teal', { border: string; color: string; shadow: string }> = {
  neutral: { border: '1.5px solid #d4dbe1', color: '#2c2e35', shadow: '0 2px 8px rgba(0,0,0,.07)' },
  blue: { border: '1.5px solid #008ecd', color: '#0d3f57', shadow: '0 3px 10px rgba(0,142,205,.16)' },
  teal: { border: '1.5px solid #2ea38e', color: '#1f5f4e', shadow: '0 3px 10px rgba(46,163,142,.16)' },
};

interface LoopNodeData extends Record<string, unknown> {
  label: string;
  tone: 'neutral' | 'blue' | 'teal';
  editing: boolean;
  isPendingSource: boolean;
  onStartRename: () => void;
  onCommit: (v: string) => void;
  onCancel: () => void;
}

function LoopFlowNode({ data }: NodeProps<Node<LoopNodeData>>) {
  const style = nodeToneStyle[data.tone];
  return (
    <div
      style={{
        position: 'relative', background: '#fff', borderRadius: 22, padding: '8px 13px', fontSize: 11.5, fontWeight: 700,
        color: style.color, whiteSpace: 'nowrap', boxShadow: data.isPendingSource ? '0 0 0 3px #dcefff' : style.shadow,
        cursor: data.editing ? 'text' : 'grab', border: style.border,
      }}
    >
      <Handle type="source" position={Position.Top} id="a" style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle type="target" position={Position.Bottom} id="b" style={{ opacity: 0, pointerEvents: 'none' }} />
      {data.editing ? (
        <input
          autoFocus
          className="nodrag nopan"
          defaultValue={data.label}
          onFocus={e => e.target.select()}
          onBlur={e => data.onCommit(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') data.onCommit((e.target as HTMLInputElement).value);
            if (e.key === 'Escape') data.onCancel();
          }}
          style={{ fontSize: 11.5, fontWeight: 700, color: style.color, background: 'transparent', border: 'none', borderBottom: `1px solid ${style.color}`, outline: 'none', width: 130 }}
        />
      ) : (
        <span>{data.label}</span>
      )}
    </div>
  );
}

interface LoopEdgeData extends Record<string, unknown> {
  polarity: Polarity;
  color: 'blue' | 'teal' | 'neutral';
}

function LoopFlowEdge({ id, source, target, data }: EdgeProps<Edge<LoopEdgeData>>) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  if (!sourceNode || !targetNode) return null;

  const sw = sourceNode.measured?.width ?? 120;
  const sh = sourceNode.measured?.height ?? 34;
  const tw = targetNode.measured?.width ?? 120;
  const th = targetNode.measured?.height ?? 34;
  const scx = sourceNode.internals.positionAbsolute.x + sw / 2;
  const scy = sourceNode.internals.positionAbsolute.y + sh / 2;
  const tcx = targetNode.internals.positionAbsolute.x + tw / 2;
  const tcy = targetNode.internals.positionAbsolute.y + th / 2;
  const dx = tcx - scx;
  const dy = tcy - scy;
  const s = rectIntersection(scx, scy, sw / 2, sh / 2, dx, dy);
  const t = rectIntersection(tcx, tcy, tw / 2, th / 2, -dx, -dy);

  // Deterministic curvature per edge so parallel links fan out instead of overlapping.
  const seed = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const curvature = 0.18 + ((seed % 5) * 0.03);
  const { path, labelX, labelY } = curvedEdgePath(s.x, s.y, t.x, t.y, curvature);

  const tone = data?.color ?? 'neutral';
  const stroke = tone === 'blue' ? '#008ecd' : tone === 'teal' ? '#2ea38e' : '#9b9c9f';
  const chipColor = data?.polarity === '-' ? '#c25a48' : stroke;
  const chipTextColor = data?.polarity === '-' ? '#c25a48' : tone === 'blue' ? '#0079b0' : tone === 'teal' ? '#25826f' : '#5b5f67';

  return (
    <>
      <BaseEdge id={id} path={path} style={{ stroke, strokeWidth: 2 }} markerEnd={`url(#loop-arrow-${tone})`} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute', transform: `translate(-50%,-50%) translate(${labelX}px,${labelY}px)`,
            width: 18, height: 18, borderRadius: '50%', background: '#fff', border: `1.5px solid ${chipColor}`,
            color: chipTextColor, fontSize: data?.polarity === '-' ? 13 : 12, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
          }}
          className="nodrag nopan"
        >
          {data?.polarity ?? '+'}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

const rfNodeTypes = { loopNode: LoopFlowNode };
const rfEdgeTypes = { loopEdge: LoopFlowEdge };

function LoopArrowDefs() {
  return (
    <svg width={0} height={0} style={{ position: 'absolute' }}>
      <defs>
        <marker id="loop-arrow-blue" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#008ecd" /></marker>
        <marker id="loop-arrow-teal" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#2ea38e" /></marker>
        <marker id="loop-arrow-neutral" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#9b9c9f" /></marker>
      </defs>
    </svg>
  );
}

function LoopCanvas({ graph, loops }: { graph: LoopGraph; loops: ReturnType<typeof detectLoops> }) {
  const { addLoopNode, renameLoopNode, moveLoopNode, addLoopLink, clearLoopGraph, renameLoopGraph } = useAppState();
  const { zoomIn, zoomOut } = useReactFlow();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [linkMode, setLinkMode] = useState(false);
  const [pendingSource, setPendingSource] = useState<string | null>(null);
  const [pendingTarget, setPendingTarget] = useState<string | null>(null);

  const { nodeTone, linkColor } = loopColors(loops);

  const rfNodes: Node<LoopNodeData>[] = graph.nodes.map(n => ({
    id: n.id,
    type: 'loopNode',
    position: { x: n.x, y: n.y },
    data: {
      label: n.label,
      tone: nodeTone.get(n.id) ?? 'neutral',
      editing: editingId === n.id,
      isPendingSource: pendingSource === n.id,
      onStartRename: () => setEditingId(n.id),
      onCommit: (v: string) => { renameLoopNode(loopGraphId, n.id, v); setEditingId(null); },
      onCancel: () => setEditingId(null),
    },
  }));

  const rfEdges: Edge<LoopEdgeData>[] = graph.links.map(l => ({
    id: l.id,
    source: l.from,
    target: l.to,
    type: 'loopEdge',
    data: { polarity: l.polarity, color: linkColor.get(l.id) ?? 'neutral' },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes);
  const [edges, setEdges] = useEdgesState(rfEdges);

  useEffect(() => { setNodes(rfNodes); }, [graph, loops]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setEdges(rfEdges); }, [graph, loops]); // eslint-disable-line react-hooks/exhaustive-deps

  const sourceLabel = graph.nodes.find(n => n.id === pendingSource)?.label;
  const targetLabel = graph.nodes.find(n => n.id === pendingTarget)?.label;

  const exitLinkMode = () => { setLinkMode(false); setPendingSource(null); setPendingTarget(null); };

  const handleNodeClick = (_: unknown, node: Node) => {
    if (!linkMode) { setEditingId(node.id); return; }
    if (!pendingSource) { setPendingSource(node.id); return; }
    if (node.id === pendingSource) { setPendingSource(null); return; }
    setPendingTarget(node.id);
  };

  const finishLink = (polarity: Polarity) => {
    if (pendingSource && pendingTarget) addLoopLink(loopGraphId, pendingSource, pendingTarget, polarity);
    exitLinkMode();
  };

  return (
    <Card style={{ padding: '16px 18px' }}>
      <div style={{ marginBottom: 10 }}>
        <EditableText
          value={graph.title}
          onCommit={v => renameLoopGraph(loopGraphId, v)}
          placeholder="Untitled feedback loop"
          style={{ fontSize: 14.5, fontWeight: 700 }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4, background: '#f5f7f9', border: '1px solid #e3e6ea', borderRadius: 9, padding: 3 }}>
          <button
            onClick={() => setEditingId(addLoopNode(loopGraphId))}
            style={{ border: '1px solid #e3e6ea', background: '#fff', borderRadius: 6, padding: '5px 9px', fontSize: 11.5, fontWeight: 600, color: '#5b5f67', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
          ><PlusCircle size={13} /> Element</button>
          <button
            onClick={() => (linkMode ? exitLinkMode() : (setLinkMode(true), setEditingId(null)))}
            style={{ border: linkMode ? '1px solid #008ecd' : 'none', background: linkMode ? '#eef7fc' : 'transparent', borderRadius: 6, padding: '5px 9px', fontSize: 11.5, fontWeight: 600, color: linkMode ? '#0079b0' : '#5b5f67', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
          ><ArrowBendUpRight size={13} /> Link</button>
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#f5f7f9', border: '1px solid #e3e6ea', borderRadius: 9, padding: 3 }}>
          <button onClick={() => zoomIn()} style={{ border: '1px solid #cfe8f6', background: '#fff', borderRadius: 6, width: 26, height: 26, fontSize: 14, fontWeight: 700, color: '#0079b0', cursor: 'pointer' }}>+</button>
          <button onClick={() => zoomOut()} style={{ border: 'none', background: 'transparent', borderRadius: 6, width: 26, height: 26, fontSize: 15, fontWeight: 700, color: '#5b5f67', cursor: 'pointer' }}>−</button>
        </div>
        <button
          onClick={() => { if (window.confirm('Clear this canvas? All elements and links will be removed.')) clearLoopGraph(loopGraphId); }}
          title="Clear canvas"
          style={{ border: '1px solid #f0d7d2', background: '#fff', borderRadius: 6, padding: '5px 9px', fontSize: 11.5, fontWeight: 600, color: '#b5502a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
        ><Trash size={13} /> Clear</button>
        <span style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 600, color: '#25826f', background: '#eef6f3', border: '1px solid #cfe9e2', borderRadius: 20, padding: '4px 11px' }}>
          Loops found: <b>{loopBadgeText(loops)}</b>
        </span>
        <PopoutButton tool="loops" />
      </div>

      {linkMode && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, background: '#eef7fc', border: '1px solid #cfe8f6', borderRadius: 9, padding: '8px 12px', fontSize: 12, color: '#0d3f57' }}>
          {!pendingSource && <span>Click an element to start a link.</span>}
          {pendingSource && !pendingTarget && <span>Click another element to connect <b>{sourceLabel}</b> to.</span>}
          {pendingTarget && (
            <>
              <span><b>{sourceLabel}</b> → <b>{targetLabel}</b> — pick a polarity:</span>
              <button onClick={() => finishLink('+')} style={{ width: 24, height: 24, borderRadius: '50%', border: '1.5px solid #008ecd', background: '#fff', color: '#0079b0', fontWeight: 700, cursor: 'pointer' }}>+</button>
              <button onClick={() => finishLink('-')} style={{ width: 24, height: 24, borderRadius: '50%', border: '1.5px solid #c25a48', background: '#fff', color: '#c25a48', fontWeight: 700, cursor: 'pointer' }}>−</button>
            </>
          )}
          <button onClick={exitLinkMode} style={{ marginLeft: 'auto', border: 'none', background: 'transparent', color: '#5b5f67', fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
        </div>
      )}

      <div style={{ borderRadius: 12, border: '1px solid #eef0f2', height: 420, background: '#fff' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onNodeClick={handleNodeClick}
          onNodeDragStop={(_, node) => moveLoopNode(loopGraphId, node.id, node.position.x, node.position.y)}
          nodeTypes={rfNodeTypes}
          edgeTypes={rfEdgeTypes}
          fitView
          minZoom={0.4}
          maxZoom={2}
          proOptions={{ hideAttribution: false }}
          panOnDrag
          nodesConnectable={false}
        >
          <LoopArrowDefs />
          <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#e7ebee" />
        </ReactFlow>
      </div>
    </Card>
  );
}

export function FeedbackLoopsTab() {
  const { loopGraphs, deleteLoopNode, deleteLoopLink } = useAppState();
  const graph = loopGraphs[loopGraphId];
  const loops = useMemo(() => detectLoops(graph), [graph]);
  const { nodeTone } = loopColors(loops);
  const firstR = loops.find(l => l.type === 'R');
  const firstB = loops.find(l => l.type === 'B');

  return (
    <div className="fb-screen fb-grid2" style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 18 }}>
      <ReactFlowProvider>
        <LoopCanvas graph={graph} loops={loops} />
      </ReactFlowProvider>

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
          <div style={{ fontSize: 10.5, color: '#9b9c9f', marginTop: 8 }}>Click an element to rename it; delete elements or links from the lists on the right, or use Clear to start over.</div>
        </Card>

        <Card style={{ padding: 18, borderRadius: 14 }}>
          <h4 style={{ margin: '0 0 10px', fontSize: 13.5, fontWeight: 700 }}>How loops actually behave</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: '#4a4d55' }}>
              <b style={{ color: '#0079b0' }}>Reinforcing loops</b> are self-amplifying: a change compounds in the same direction each time around, like compound interest or a vicious cycle. Left alone, they accelerate without limit.
            </p>
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: '#4a4d55' }}>
              <b style={{ color: '#25826f' }}>Balancing loops</b> are goal-seeking: they sense a <b>gap</b> between the current state and a <b>goal</b>, then trigger a <b>corrective action</b> that closes it — the way a thermostat, an inventory system, or a budget stays in check. A <b>delay</b> in that correction is often what makes a system overshoot or oscillate.
            </p>
            <div style={{ background: '#f6f8fa', border: '1px solid #eef0f2', borderRadius: 9, padding: '9px 11px' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#83878f', letterSpacing: '.03em', marginBottom: 3 }}>HOW THIS TOOL LABELS A LOOP</div>
              <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.5, color: '#5b5f67' }}>
                Trace the loop and count its <b style={{ color: '#c25a48' }}>−</b> links. An even number (including zero) means every step reinforces the last — <b style={{ color: '#0079b0' }}>R</b>. An odd number means one link flips the signal, so the loop corrects itself — <b style={{ color: '#25826f' }}>B</b>.
              </p>
            </div>
            <a
              href="https://thesystemsthinker.com/balancing-loop-basics/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 11, fontWeight: 600, color: '#0079b0', textDecoration: 'underline' }}
            >
              More on loop basics at The Systems Thinker →
            </a>
          </div>
        </Card>

        <Card style={{ padding: 18, borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 }}>
            <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 700 }}>Elements</h4>
            <span style={{ fontSize: 11, color: '#9b9c9f' }}>{graph.nodes.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {graph.nodes.map(n => {
              const tone = nodeTone.get(n.id);
              const dot = tone === 'blue' ? '#008ecd' : tone === 'teal' ? '#2ea38e' : '#9b9c9f';
              return (
                <div key={n.id} className="fb-hover fb-hover-bg" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, padding: '6px 8px', borderRadius: 7 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot, flex: '0 0 auto' }} />
                  <span style={{ flex: 1 }}>{n.label}</span>
                  <button
                    onClick={() => deleteLoopNode(loopGraphId, n.id)}
                    style={{ border: 'none', background: 'transparent', color: '#b0b3b8', cursor: 'pointer', padding: 0, display: 'flex' }}
                    title="Delete"
                  >
                    <X size={11} />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>

        <Card style={{ padding: 18, borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 }}>
            <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 700 }}>Links</h4>
            <span style={{ fontSize: 11, color: '#9b9c9f' }}>{graph.links.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {graph.links.length === 0 && (
              <div style={{ fontSize: 11.5, color: '#b0b3b8', fontStyle: 'italic' }}>No links yet — use "Link" above to connect two elements.</div>
            )}
            {graph.links.map(l => {
              const fromLabel = graph.nodes.find(n => n.id === l.from)?.label ?? '?';
              const toLabel = graph.nodes.find(n => n.id === l.to)?.label ?? '?';
              return (
                <div key={l.id} className="fb-hover fb-hover-bg" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, padding: '6px 8px', borderRadius: 7 }}>
                  <span style={{
                    width: 16, height: 16, borderRadius: '50%', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1.5px solid ${l.polarity === '-' ? '#c25a48' : '#008ecd'}`, color: l.polarity === '-' ? '#c25a48' : '#0079b0', fontSize: 10, fontWeight: 700,
                  }}>{l.polarity}</span>
                  <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fromLabel} → {toLabel}</span>
                  <button
                    onClick={() => deleteLoopLink(loopGraphId, l.id)}
                    style={{ border: 'none', background: 'transparent', color: '#b0b3b8', cursor: 'pointer', padding: 0, display: 'flex' }}
                    title="Delete link"
                  >
                    <X size={11} />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>

        <div style={{ background: '#eef7fc', border: '1px solid #cfe8f6', borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0d3f57', marginBottom: 4 }}>What this tells you</div>
          {firstR && firstB ? (
            <p style={{ margin: 0, fontSize: 12, color: '#33607a', lineHeight: 1.5 }}>
              <b>{firstR.id}</b> is a reinforcing loop — but <b>{firstB.id}</b> caps it: a balancing loop shares an element with it, pulling the growth back down. That's a{' '}
              <ArchLink id="limits">Limits to Growth</ArchLink> archetype.
            </p>
          ) : firstR ? (
            <p style={{ margin: 0, fontSize: 12, color: '#33607a', lineHeight: 1.5 }}>
              <b>{firstR.id}</b> is a reinforcing loop with no balancing loop yet — it will keep compounding in whichever direction it's currently moving.
            </p>
          ) : firstB ? (
            <p style={{ margin: 0, fontSize: 12, color: '#33607a', lineHeight: 1.5 }}>
              <b>{firstB.id}</b> is a balancing loop — it will self-correct toward whatever it's regulating.
            </p>
          ) : (
            <p style={{ margin: 0, fontSize: 12, color: '#33607a', lineHeight: 1.5 }}>
              No closed loops yet. Add a link that leads back to an earlier element to form one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function radarPoint(index: number, value: number, cx: number, cy: number, r: number) {
  const angle = (-90 + index * (360 / 5)) * (Math.PI / 180);
  return { x: cx + r * value * Math.cos(angle), y: cy + r * value * Math.sin(angle) };
}

function RadarChart({ diagnostic }: { diagnostic: FiveRDiagnostic }) {
  const cx = 120;
  const cy = 122;
  const r = 90;
  const rings = [0.2, 0.4, 0.6, 0.8, 1];
  const dataPoints = fiveRElements.map((el, i) => radarPoint(i, diagnostic.elements[el].rating / 5, cx, cy, r));

  return (
    <svg viewBox="0 0 240 250" style={{ width: '100%', maxWidth: 260, display: 'block', margin: '0 auto' }}>
      {rings.map(ring => (
        <polygon
          key={ring}
          points={fiveRElements.map((_, i) => { const p = radarPoint(i, ring, cx, cy, r); return `${p.x},${p.y}`; }).join(' ')}
          fill="none" stroke="#e7eaee" strokeWidth={1}
        />
      ))}
      {fiveRElements.map((el, i) => {
        const edge = radarPoint(i, 1, cx, cy, r);
        return <line key={el} x1={cx} y1={cy} x2={edge.x} y2={edge.y} stroke="#e7eaee" strokeWidth={1} />;
      })}
      <polygon points={dataPoints.map(p => `${p.x},${p.y}`).join(' ')} fill="rgba(0,142,205,.16)" stroke="#008ecd" strokeWidth={2} />
      {dataPoints.map((p, i) => <circle key={fiveRElements[i]} cx={p.x} cy={p.y} r={3.5} fill="#008ecd" />)}
      {fiveRElements.map((el, i) => {
        const label = radarPoint(i, 1.22, cx, cy, r);
        return (
          <text key={el} x={label.x} y={label.y} fontSize={10.5} fontWeight={700} fill={fiveRMeta[el].textColor} textAnchor="middle" dominantBaseline="middle">
            {fiveRMeta[el].label}
          </text>
        );
      })}
    </svg>
  );
}

function RatingPicker({ value, onChange, color, readOnly }: { value: number; onChange: (v: number) => void; color: string; readOnly?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 5 }}>
      {[0, 1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          disabled={readOnly}
          onClick={() => onChange(n)}
          style={{
            width: 25, height: 25, borderRadius: 7, fontSize: 11.5, fontWeight: 700, cursor: readOnly ? 'default' : 'pointer',
            border: `1.5px solid ${n <= value ? color : '#e3e6ea'}`, background: n <= value ? color : '#fff', color: n <= value ? '#fff' : '#9b9c9f',
          }}
        >{n}</button>
      ))}
    </div>
  );
}

function FiveRElementCard({ diagnostic, element, readOnly }: { diagnostic: FiveRDiagnostic; element: FiveRElement; readOnly: boolean }) {
  const { setFiveRRating, updateFiveRAnswer, updateFiveRGapNote } = useAppState();
  const meta = fiveRMeta[element];
  const data = diagnostic.elements[element];
  const questions = fiveRQuestions[element];

  return (
    <Card style={{ borderTop: `3px solid ${meta.color}`, padding: 18, borderRadius: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: meta.textColor }}>{meta.label}</span>
        <RatingPicker value={data.rating} onChange={v => setFiveRRating(diagnostic.id, element, v)} color={meta.color} readOnly={readOnly} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
        {questions.map((q, i) => (
          <div key={i}>
            <div style={{ fontSize: 11.5, color: '#5b5f67', marginBottom: 5, lineHeight: 1.4 }}>{q}</div>
            {readOnly ? (
              <div style={{ fontSize: 12, color: data.answers[i] ? '#2c2e35' : '#b0b3b8', fontStyle: data.answers[i] ? 'normal' : 'italic', background: meta.bg, borderRadius: 8, padding: '8px 10px' }}>
                {data.answers[i] || 'No answer recorded.'}
              </div>
            ) : (
              <textarea
                value={data.answers[i]}
                onChange={e => updateFiveRAnswer(diagnostic.id, element, i, e.target.value)}
                placeholder="Answer this question…"
                rows={2}
                style={{ width: '100%', fontSize: 12, fontFamily: 'inherit', color: '#2c2e35', background: meta.bg, border: `1px solid ${meta.border}`, borderRadius: 8, padding: '8px 10px', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
              />
            )}
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: '#83878f', letterSpacing: '.04em', marginBottom: 5 }}>GAP / WHAT'S MISSING <span style={{ fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></div>
        {readOnly ? (
          <div style={{ fontSize: 12, color: data.gapNote ? '#2c2e35' : '#b0b3b8', fontStyle: data.gapNote ? 'normal' : 'italic' }}>{data.gapNote || 'None noted.'}</div>
        ) : (
          <textarea
            value={data.gapNote}
            onChange={e => updateFiveRGapNote(diagnostic.id, element, e.target.value)}
            placeholder="Note any gap for this element…"
            rows={2}
            style={{ width: '100%', fontSize: 12, fontFamily: 'inherit', color: '#2c2e35', background: '#fff', border: '1px solid #e3e6ea', borderRadius: 8, padding: '8px 10px', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
          />
        )}
      </div>
    </Card>
  );
}

function FiveRLibraryRow({ diagnostic, onOpen, onDuplicate, onDelete }: { diagnostic: FiveRDiagnostic; onOpen: () => void; onDuplicate: () => void; onDelete: () => void }) {
  const avg = fiveRElements.reduce((sum, el) => sum + diagnostic.elements[el].rating, 0) / 5;
  return (
    <div onClick={onOpen} className="fb-hover fb-hover-tint fb-note" style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #e7eaee', borderRadius: 11, padding: '13px 14px', cursor: 'pointer' }}>
      <span style={{ width: 34, height: 34, borderRadius: 9, background: '#eef7fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
        <ChartPolar size={17} color="#008ecd" />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{diagnostic.name}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: diagnostic.status === 'final' ? '#25826f' : '#0079b0', background: diagnostic.status === 'final' ? '#eef6f3' : '#eef7fc', borderRadius: 20, padding: '1px 7px' }}>
            {diagnostic.status === 'final' ? 'FINAL' : 'DRAFT'}
          </span>
        </div>
        <div style={{ fontSize: 11, color: '#9b9c9f', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {diagnostic.systemBoundary || 'No boundary noted'} · avg {avg.toFixed(1)}/5 · updated {new Date(diagnostic.updatedAt).toLocaleDateString()}
        </div>
      </div>
      <button onClick={e => { e.stopPropagation(); onDuplicate(); }} title="Duplicate" style={{ border: 'none', background: 'transparent', color: '#b0b3b8', cursor: 'pointer', padding: 4, display: 'flex', flex: '0 0 auto' }}>
        <Copy size={14} />
      </button>
      <button className="fb-note-delete" onClick={e => { e.stopPropagation(); onDelete(); }} title="Delete" style={{ border: 'none', background: 'transparent', color: '#b0b3b8', cursor: 'pointer', padding: 4, display: 'flex', flex: '0 0 auto', opacity: 0 }}>
        <X size={14} />
      </button>
      <CaretRight color="#c9cbce" />
    </div>
  );
}

export function FiveRsTab() {
  const {
    fiveRs, activeFiveRId, setActiveFiveR, createFiveRDiagnostic, deleteFiveRDiagnostic,
    duplicateFiveRDiagnostic, renameFiveRDiagnostic, updateFiveRBoundary, setFiveRStatus,
  } = useAppState();
  const active = fiveRs.find(d => d.id === activeFiveRId);

  if (!active) {
    return (
      <div className="fb-screen">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700 }}>5Rs System Diagnostic</h3>
            <p className="serif" style={{ margin: 0, fontSize: 13, color: '#6b6e76', maxWidth: 560, lineHeight: 1.5 }}>
              Listen to the "as is" system through Results, Roles, Relationships, Rules &amp; Resources — adapted from the USAID 5Rs Framework.
            </p>
          </div>
          <button onClick={() => createFiveRDiagnostic()} className="fb-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#008ecd', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 15px', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <Plus size={14} weight="bold" /> New diagnostic
          </button>
        </div>

        {fiveRs.length === 0 ? (
          <Card style={{ padding: '40px 24px', textAlign: 'center', color: '#9b9c9f' }}>
            <ChartPolar size={30} style={{ margin: '0 auto 10px', display: 'block' }} />
            <div style={{ fontSize: 13.5 }}>No diagnostics yet — create one to assess a local system.</div>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {fiveRs.map(d => (
              <FiveRLibraryRow
                key={d.id}
                diagnostic={d}
                onOpen={() => setActiveFiveR(d.id)}
                onDuplicate={() => duplicateFiveRDiagnostic(d.id)}
                onDelete={() => { if (window.confirm(`Delete "${d.name}"? This can't be undone.`)) deleteFiveRDiagnostic(d.id); }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const readOnly = active.status === 'final';

  return (
    <div className="fb-screen">
      <button onClick={() => setActiveFiveR(null)} className="fb-hover fb-hover-bg no-print" style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#fff', border: '1px solid #e3e6ea', borderRadius: 9, padding: '8px 13px', fontSize: 12.5, fontWeight: 600, color: '#5b5f67', cursor: 'pointer', marginBottom: 16 }}>
        <ArrowLeft size={13} weight="bold" /> All diagnostics
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6, flexWrap: 'wrap' }}>
            {readOnly ? (
              <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, letterSpacing: '-.01em' }}>{active.name}</h2>
            ) : (
              <input
                value={active.name}
                onChange={e => renameFiveRDiagnostic(active.id, e.target.value || active.name)}
                style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.01em', border: 'none', background: 'transparent', outline: 'none', minWidth: 160 }}
              />
            )}
            <span style={{ fontSize: 11, fontWeight: 700, color: readOnly ? '#25826f' : '#0079b0', background: readOnly ? '#eef6f3' : '#eef7fc', border: `1px solid ${readOnly ? '#cfe9e2' : '#cfe8f6'}`, borderRadius: 20, padding: '2px 9px' }}>
              {readOnly ? 'FINAL · VIEW ONLY' : 'DRAFT'}
            </span>
          </div>
          {readOnly ? (
            <div style={{ fontSize: 12.5, color: '#83878f' }}>{active.systemBoundary || 'No system boundary noted.'}</div>
          ) : (
            <input
              value={active.systemBoundary}
              onChange={e => updateFiveRBoundary(active.id, e.target.value)}
              placeholder="Describe the focal result / system boundary you're assessing…"
              style={{ fontSize: 12.5, color: '#5b5f67', border: 'none', background: 'transparent', outline: 'none', width: '100%', maxWidth: 520 }}
            />
          )}
        </div>
        <div className="no-print" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => setFiveRStatus(active.id, readOnly ? 'draft' : 'final')} className="fb-hover fb-hover-bg" style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #e3e6ea', background: '#fff', borderRadius: 8, padding: '7px 11px', fontSize: 11.5, fontWeight: 600, color: '#5b5f67', cursor: 'pointer' }}>
            {readOnly ? <LockSimpleOpen size={13} /> : <LockSimple size={13} />} {readOnly ? 'Unlock to edit' : 'Mark as final'}
          </button>
          <button onClick={() => duplicateFiveRDiagnostic(active.id)} className="fb-hover fb-hover-bg" style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #e3e6ea', background: '#fff', borderRadius: 8, padding: '7px 11px', fontSize: 11.5, fontWeight: 600, color: '#5b5f67', cursor: 'pointer' }}>
            <Copy size={13} /> Duplicate
          </button>
          <PopoutButton tool="fiveRs" />
        </div>
      </div>

      <div className="fb-grid2" style={{ display: 'grid', gridTemplateColumns: '.85fr 1.15fr', gap: 18, marginBottom: 18 }}>
        <Card style={{ padding: 18, borderRadius: 14 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 4 }}>System snapshot</div>
          <div style={{ fontSize: 11, color: '#9b9c9f', marginBottom: 14 }}>0 = not functioning · 5 = strong &amp; sustainable</div>
          <RadarChart diagnostic={active} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
            {fiveRElements.map(el => {
              const meta = fiveRMeta[el];
              return (
                <div key={el} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5 }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: meta.color, flex: '0 0 auto' }} />
                  <span style={{ flex: 1 }}>{meta.label}</span>
                  <span style={{ fontWeight: 700, color: meta.textColor }}>{active.elements[el].rating} / 5</span>
                </div>
              );
            })}
          </div>
        </Card>

        <div style={{ background: '#eef7fc', border: '1px solid #cfe8f6', borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0d3f57', marginBottom: 6 }}>About this tool</div>
          <p style={{ margin: '0 0 8px', fontSize: 12, color: '#33607a', lineHeight: 1.5 }}>
            Adapted from USAID's 5Rs Framework for listening to a local system "as is." Rate each element 0–5, answer the guiding questions from Table 1 of the technical note, and note any gaps you find.
          </p>
          <p style={{ margin: 0, fontSize: 11, color: '#5b8ba3', fontStyle: 'italic' }}>
            USAID, "<a href="https://beamexchange.org/documents/2975/5rs-framework-techncial_note_usaid.pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>The 5Rs Framework in the Program Cycle</a>," Technical Note, Version 2.1, October 2016.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {fiveRElements.map(el => (
          <FiveRElementCard key={el} diagnostic={active} element={el} readOnly={readOnly} />
        ))}
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

const loopToneColor: Record<'R' | 'B', { fill: string; stroke: string; text: string }> = {
  R: { fill: '#eef7fc', stroke: '#a9d4ef', text: '#0079b0' },
  B: { fill: '#eef6f3', stroke: '#a9dbcf', text: '#25826f' },
};

// Lays out one circle per loop encoded in the archetype's badge (e.g. "R + R + B"
// or a single "R"), so the diagram actually matches how many loops — and of
// which type — are coupled together in that archetype, instead of always
// showing a fixed two-circle R/B pair.
function CoupledLoopsDiagram({ badge }: { badge: string }) {
  const tokens = badge.split(/[+·]/).map(s => s.trim()).filter((t): t is 'R' | 'B' => t === 'R' || t === 'B');
  const w = 220, h = 120;
  const positions = tokens.length <= 1
    ? [{ x: w / 2, y: h / 2 }]
    : tokens.length === 2
    ? [{ x: 66, y: 60 }, { x: 154, y: 60 }]
    : [{ x: 60, y: 42 }, { x: 160, y: 42 }, { x: 110, y: 92 }];
  const r = tokens.length <= 1 ? 34 : tokens.length === 2 ? 30 : 26;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', maxWidth: 220 }}>
      <defs>
        <marker id="cld-arrow" markerWidth="8" markerHeight="8" refX="5" refY="2.6" orient="auto"><path d="M0,0 L5,2.6 L0,5.2 Z" fill="#b0b3b8" /></marker>
      </defs>
      {positions.map((p, i) => {
        const q = positions[(i + 1) % positions.length];
        if (positions.length < 2 || (positions.length === 2 && i > 0)) return null;
        const midX = (p.x + q.x) / 2;
        const midY = (p.y + q.y) / 2 - (positions.length === 2 ? 14 : 0);
        return <path key={i} d={`M${p.x},${p.y} Q${midX},${midY} ${q.x},${q.y}`} fill="none" stroke="#c7cbd1" strokeWidth="1.6" markerEnd="url(#cld-arrow)" />;
      })}
      {positions.map((p, i) => {
        const tone = loopToneColor[tokens[i]];
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={r} fill={tone.fill} stroke={tone.stroke} strokeWidth="1.5" />
            <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="16" fontWeight="800" fill={tone.text} fontFamily="Work Sans">{tokens[i]}</text>
          </g>
        );
      })}
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
              <CoupledLoopsDiagram badge={arch.badge} />
              <div style={{ fontSize: 11, color: '#9b9c9f', marginTop: 10, textAlign: 'center' }}>coupled loops — {arch.badge}</div>
            </Card>
            <Card style={{ padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Behaviour over time</div>
              <svg viewBox="0 0 240 90" style={{ width: '100%' }}>
                <line x1="18" y1="76" x2="230" y2="76" stroke="#d4d8dd" />
                <line x1="18" y1="8" x2="18" y2="76" stroke="#d4d8dd" />
                <polyline points={arch.behaviorPoints} fill="none" stroke="#008ecd" strokeWidth="2.2" />
              </svg>
              <div style={{ fontSize: 10.5, color: '#9b9c9f', marginTop: 4 }}>the shape this archetype actually produces over time</div>
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
