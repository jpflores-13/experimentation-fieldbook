import { PaperPlaneRight } from '@phosphor-icons/react';
import { members, comments, memberById } from '../data/seed';
import { Avatar, Card } from '../components/ui';

const roleColor: Record<string, { color: string; bg: string }> = {
  Owner: { color: '#0079b0', bg: '#eef7fc' },
  Editor: { color: '#5b5f67', bg: '#f1f3f6' },
  Viewer: { color: '#5b5f67', bg: '#f1f3f6' },
};

export function Team() {
  return (
    <div className="fb-screen" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div className="fb-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 18 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Members</h3>
            <button style={{ border: 'none', background: '#eef7fc', color: '#0079b0', fontSize: 12, fontWeight: 600, borderRadius: 8, padding: '6px 11px', cursor: 'pointer' }}>Invite</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {members.map(m => {
              const rc = roleColor[m.roleTag];
              return (
                <div key={m.id} className="fb-hover" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderRadius: 10 }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f7f9fb')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <Avatar initials={m.initials} color={m.color} size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</div>
                    <div style={{ fontSize: 11.5, color: '#767676' }}>{m.role}</div>
                  </div>
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: rc.color, background: rc.bg, padding: '2px 9px', borderRadius: 20 }}>{m.roleTag}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Recent comments</h3>
            <span style={{ fontSize: 11, color: '#767676' }}>across concepts</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {comments.map(c => {
              const author = memberById(c.authorId);
              return (
                <div key={c.id} style={{ display: 'flex', gap: 11 }}>
                  <Avatar initials={author.initials} color={author.color} size={30} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, marginBottom: 5 }}>
                      <b>{author.name.split(' ')[0]}</b> on <b style={{ color: '#0079b0' }}>{c.target}</b> <span style={{ color: '#b0b3b8', fontSize: 11 }}>· {c.when}</span>
                    </div>
                    <div style={{ background: '#f6f8fa', border: '1px solid #eef0f2', borderRadius: 10, borderTopLeftRadius: 2, padding: '9px 11px', fontSize: 12, lineHeight: 1.45, color: '#4a4d55' }}>{c.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 9, alignItems: 'center', borderTop: '1px solid #eef0f2', paddingTop: 14 }}>
            <Avatar initials="MA" color="#0073a8" size={28} />
            <div style={{ flex: 1, background: '#f1f3f6', border: '1px solid #e3e6ea', borderRadius: 20, padding: '8px 14px', fontSize: 12, color: '#767676' }}>Add a comment…</div>
            <button style={{ width: 34, height: 34, borderRadius: 9, border: 'none', background: '#0073a8', color: '#fff', cursor: 'pointer', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PaperPlaneRight size={15} weight="fill" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
