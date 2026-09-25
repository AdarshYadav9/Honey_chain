import React, { useMemo, useState } from 'react';
import { Activity, Layers, Cpu, Users, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockActivityLog } from '../../data/mockData';

const typeIcon = {
  BATCH: Layers,
  HIVE: Cpu,
  USER: Users,
  QUALITY: ShieldCheck,
};

const levelColor = {
  INFO: 'var(--text-muted)',
  SUCCESS: 'var(--emerald-400)',
  WARNING: 'var(--amber-400)',
};

export default function ActivityLog() {
  const { sharedBatches } = useApp();
  const [filter, setFilter] = useState('ALL');

  // Merge static demo events with anything live in sharedBatches, sorted newest first.
  const combined = useMemo(() => {
    const fromBatches = sharedBatches.flatMap(b =>
      (b.transactions || []).map(tx => ({
        id: `${b.id}-${tx.event}`,
        type: 'BATCH',
        actor: tx.actor,
        message: `${tx.event} — batch ${b.id}`,
        time: new Date(tx.date).toLocaleString(),
        level: 'SUCCESS',
        _ts: new Date(tx.date).getTime(),
      }))
    );
    const fromMock = mockActivityLog.map((a, i) => ({ ...a, _ts: Date.now() - i * 1000 * 60 * 20 }));
    return [...fromBatches, ...fromMock].sort((a, b) => b._ts - a._ts);
  }, [sharedBatches]);

  const filtered = filter === 'ALL' ? combined : combined.filter(a => a.type === filter);

  return (
    <section className="view-pane active" id="view-activity">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><Activity size={13} /> System Audit Trail</div>
        <h2>Activity Log</h2>
        <p className="section-lede">Every batch, hive alert, quality decision and account change across the platform, in one place.</p>
      </div>

      <div className="toolbar-group" style={{ marginBottom: '18px' }}>
        {['ALL', 'BATCH', 'HIVE', 'QUALITY', 'USER'].map(t => (
          <button key={t} className={`chart-toggle ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>
            {t === 'ALL' ? 'All Events' : t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="glass-card">
        <div className="mm-timeline">
          {filtered.map((a, i) => {
            const Icon = typeIcon[a.type] || Activity;
            return (
              <div className="mm-tl-item" key={a.id || i}>
                <div className={`mm-tl-dot ${a.level === 'WARNING' ? '' : 'ok'}`} style={a.level === 'WARNING' ? { background: 'var(--amber-400)' } : {}}></div>
                <div className="mm-tl-content flex-between">
                  <div>
                    <div className="mm-tl-desc flex gap-8">
                      <Icon size={14} color={levelColor[a.level] || 'var(--text-muted)'} />
                      {a.message}
                    </div>
                    <div className="mm-tl-time">by {a.actor}</div>
                  </div>
                  <div className="mm-tl-time" style={{ whiteSpace: 'nowrap' }}>{a.time}</div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="state-empty">No events for this filter yet.</div>
          )}
        </div>
      </div>
    </section>
  );
}
