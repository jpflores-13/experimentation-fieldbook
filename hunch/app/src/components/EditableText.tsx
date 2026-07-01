import { useState, type CSSProperties } from 'react';

export function EditableText({ value, onCommit, placeholder, style }: {
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

export function EditableArea({ value, onCommit, placeholder, rows = 2, style }: {
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
