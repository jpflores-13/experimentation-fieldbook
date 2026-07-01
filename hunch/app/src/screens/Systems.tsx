import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ReactFlow, ReactFlowProvider, Background, BackgroundVariant, Handle, Position, BaseEdge, EdgeLabelRenderer,
  useNodesState, useEdgesState, useReactFlow, useInternalNode,
  type Node, type Edge, type NodeProps, type EdgeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Graph, Target, ArrowsClockwise, ArrowsCounterClockwise, Shapes, Star, Sparkle, Plus,
  ArrowBendUpRight, PlusCircle, Eye, Sliders, ArrowLeft, X,
} from '@phosphor-icons/react';
import { useAppState } from '../state/AppState';
import { archetypes, archetypeById, type GlyphSpec } from '../data/archetypes';
import type { SysTab, Ring, StarRating, SupportNote, LoopGraph, Polarity } from '../types';
import { ACTIVE_MAP_ID } from '../data/systemsSeed';
import { detectLoops, loopBadgeText, loopColors } from '../state/loopAnalysis';
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
      className="fb-note"
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
        <span>{note.text}</span>
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

function SupportMapTab() {
  const { supportMaps, addSupportNote } = useAppState();
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 700 }}>{map.title}</h3>
          <span style={{ fontSize: 11, color: '#9b9c9f' }}>role-centred map · click a note to rename, drag to move</span>
        </div>
        <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: 520, margin: '6px auto 0', aspectRatio: '1/1' }}>
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
  const { addLoopNode, renameLoopNode, moveLoopNode, addLoopLink } = useAppState();
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
        <span style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 600, color: '#25826f', background: '#eef6f3', border: '1px solid #cfe9e2', borderRadius: 20, padding: '4px 11px' }}>
          Loops found: <b>{loopBadgeText(loops)}</b>
        </span>
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

function FeedbackLoopsTab() {
  const { loopGraphs, deleteLoopNode } = useAppState();
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
          <div style={{ fontSize: 10.5, color: '#9b9c9f', marginTop: 8 }}>Click an element to rename it; select a link and press Delete to remove it.</div>
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
