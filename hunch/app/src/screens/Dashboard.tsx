import {
  Stack, TestTube, ListChecks, SealCheck, ArrowUp, ArrowRight, Lightbulb,
  BookOpenText, ArrowSquareOut, X, Trash,
} from '@phosphor-icons/react';
import { useAppState } from '../state/AppState';
import { Card, Chip, SegmentBar, ThinBar } from '../components/ui';
import type { HomeVariant } from '../types';
import { GUIDE_URL } from '../config';

const accentBg: Record<string, string> = { blue: '#eef7fc', teal: '#eef6f3', slate: '#f1f3f6' };
const accentFg: Record<string, string> = { blue: '#008ecd', teal: '#2ea38e', slate: '#5b6b7a' };
const chipStyle: Record<string, { color: string; bg: string; border: string }> = {
  blue: { color: '#0079b0', bg: '#eef7fc', border: '#cfe8f6' },
  teal: { color: '#25826f', bg: '#eef6f3', border: '#cfe9e2' },
  slate: { color: '#5b6b7a', bg: '#f1f3f6', border: '#e0e3e7' },
};

export function Dashboard() {
  const { home, setHome, go, concepts, setActiveConcept, deleteConcept, clearConcepts } = useAppState();
  const activeCount = concepts.filter(c => !c.shelved).length;

  const toggle = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
      <div className="serif" style={{ fontSize: 13, color: '#6b6e76', fontStyle: 'italic' }}>Dashboard home — explore 2 layout directions:</div>
      <div style={{ display: 'inline-flex', background: '#fff', border: '1px solid #e3e6ea', borderRadius: 10, padding: 3, gap: 2 }}>
        {(['a', 'b'] as HomeVariant[]).map(v => {
          const labels: Record<HomeVariant, string> = { a: 'A · Mission control', b: 'B · Pipeline' };
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
      <span style={{ fontSize: 11.5, color: '#9b9c9f', background: '#fff', border: '1px solid #e3e6ea', borderRadius: 20, padding: '3px 10px' }}>id 1a / 1b</span>
      {concepts.length > 0 && (
        <button
          onClick={() => { if (window.confirm('Clear all concepts? This deletes every concept and its workspace data — this can\'t be undone.')) clearConcepts(); }}
          className="fb-hover fb-hover-bg"
          style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #e3e6ea', background: '#fff', borderRadius: 8, padding: '6px 10px', fontSize: 11.5, fontWeight: 600, color: '#5b5f67', cursor: 'pointer' }}
        >
          <Trash size={13} /> Clear all concepts
        </button>
      )}
      <a
        href={GUIDE_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#0079b0', textDecoration: 'none' }}
      >
        <BookOpenText size={14} /> New here? Read the guide <ArrowSquareOut size={12} />
      </a>
    </div>
  );

  return (
    <div className="fb-screen" style={{ maxWidth: 1240, margin: '0 auto' }}>
      {toggle}
      {home === 'a' && <VariantA />}
      {home === 'b' && <VariantB />}
      <SourcesFooter />
    </div>
  );

  function VariantA() {
    return (
      <div className="fb-screen">
        <div className="fb-grid4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
          <Card style={{ padding: '17px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#83878f' }}>Active concepts</span>
              <Stack size={17} color="#008ecd" />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.02em' }}>{activeCount}</div>
            <div style={{ fontSize: 11.5, color: '#2ea38e', fontWeight: 600, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}><ArrowUp size={11} weight="bold" /> {concepts.length} total</div>
          </Card>
          <Card style={{ padding: '17px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#83878f' }}>Tests running</span>
              <TestTube size={17} color="#008ecd" />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.02em' }}>3</div>
            <div style={{ fontSize: 11.5, color: '#83878f', fontWeight: 500, marginTop: 3 }}>2 in field · 1 pretest</div>
          </Card>
          <Card style={{ padding: '17px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#83878f' }}>Assumptions tested</span>
              <ListChecks size={17} color="#008ecd" />
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

        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Concept portfolio</h3>
            <button onClick={() => go('concepts')} className="fb-link" style={{ border: 'none', background: 'transparent', color: '#0079b0', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              Value / Effort matrix <ArrowRight size={12} weight="bold" />
            </button>
          </div>
          <p className="serif" style={{ margin: '0 0 16px', fontSize: 12.5, color: '#83878f', fontStyle: 'italic' }}>Each concept moves through the five steps.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {concepts.filter(c => !c.shelved).map(c => {
              const cs = chipStyle[c.accent];
              return (
                <div key={c.id} onClick={() => setActiveConcept(c.id)} className="fb-hover fb-hover-row fb-note" style={{ border: '1px solid #e7eaee', borderRadius: 12, padding: '13px 14px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 11 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: accentBg[c.accent], display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                      <Lightbulb size={18} color={accentFg[c.accent]} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700 }}>{c.name}</div>
                      <div style={{ fontSize: 11.5, color: '#9b9c9f' }}>{c.subtitle}</div>
                    </div>
                    <Chip color={cs.color} bg={cs.bg} border={cs.border}>{c.stepLabel}</Chip>
                    <button
                      className="fb-note-delete"
                      onClick={e => { e.stopPropagation(); if (window.confirm(`Delete "${c.name}"? This can't be undone.`)) deleteConcept(c.id); }}
                      title="Delete concept"
                      style={{ border: 'none', background: 'transparent', color: '#b0b3b8', cursor: 'pointer', padding: 4, display: 'flex', flex: '0 0 auto', opacity: 0 }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <SegmentBar segments={c.segments} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  function VariantB() {
    const cols: { n: number; label: string; step: number; color: string }[] = [
      { n: 1, label: 'Frame idea', step: 1, color: '#2c2e35' },
      { n: 2, label: 'Evidence', step: 2, color: '#2c2e35' },
      { n: 3, label: 'Select test', step: 3, color: '#008ecd' },
      { n: 4, label: 'Prototype', step: 4, color: '#008ecd' },
      { n: 5, label: 'Execute', step: 5, color: '#2ea38e' },
    ];
    return (
      <div className="fb-screen">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#6b6e76' }}>Pipeline</span>
          <span style={{ fontSize: 12, color: '#9b9c9f' }}>— concepts flowing through the five steps. Drag to advance.</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
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
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9b9c9f', fontWeight: 600 }}>{items.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.map(c => {
                    const cs = chipStyle[c.accent];
                    return (
                      <div key={c.id} onClick={() => setActiveConcept(c.id)} className="fb-hover fb-hover-row fb-note" style={{ position: 'relative', background: '#fff', border: '1px solid #e7eaee', borderRadius: 12, padding: 13, cursor: 'pointer' }}>
                        <button
                          className="fb-note-delete"
                          onClick={e => { e.stopPropagation(); if (window.confirm(`Delete "${c.name}"? This can't be undone.`)) deleteConcept(c.id); }}
                          title="Delete concept"
                          style={{ position: 'absolute', top: 6, right: 6, border: 'none', background: 'transparent', color: '#b0b3b8', cursor: 'pointer', padding: 4, display: 'flex', opacity: 0 }}
                        >
                          <X size={13} />
                        </button>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3, paddingRight: 16 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: '#9b9c9f', marginBottom: 9 }}>{c.subtitle}</div>
                        <Chip color={cs.color} bg={cs.bg} border="transparent" style={{ border: 'none', padding: '2px 8px', fontSize: 10.5 }}>{c.quadrantLabel}</Chip>
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

}

function SourcesFooter() {
  return (
    <div className="no-print" style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e7eaee', fontSize: 11, color: '#9b9c9f', lineHeight: 1.7 }}>
      Built on:{' '}
      <a href="https://cup.columbia.edu/book/the-experimentation-field-book/9780231214179/" target="_blank" rel="noopener noreferrer" style={{ color: '#0079b0', fontWeight: 600, textDecoration: 'none' }}>The Experimentation Field Book</a>
      {' '}(Liedtka, Chen, Foley &amp; Kester, Columbia Business School Publishing, 2024) — the five-step process &amp; templates ·{' '}
      <a href="https://rhntc.org/sites/default/files/resources/fpntc_sys_supp_2019-07_0.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#0079b0', fontWeight: 600, textDecoration: 'none' }}>Systems Support Mapping</a>
      {' '}(Family Planning National Training Center, 2019) — the System Support Map ·{' '}
      <span style={{ fontWeight: 600, color: '#5b5f67' }}>"The 5Rs Framework in the Program Cycle"</span> (USAID Technical Note, Version 2.1, 2016) — the 5Rs System Diagnostic.
    </div>
  );
}
