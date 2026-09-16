import React, { useState, useEffect } from 'react';
import { AlertTriangle, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const API_BASE = window.location.hostname !== 'localhost' ? '' : 'http://localhost:4000';

const SEVERITY_STYLES = {
  critical: { bg: 'var(--rose-bg)', color: 'var(--rose-400)', border: 'var(--rose-border)' },
  warning: { bg: 'rgba(251, 191, 36, 0.12)', color: 'var(--amber-400)', border: 'rgba(251, 191, 36, 0.3)' },
};

export default function RejectedBatches() {
  const { switchView } = useApp();
  const [rejected, setRejected] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRejected = () => {
    setLoading(true);
    fetch(`${API_BASE}/api/quality/rejected`)
      .then(r => r.json())
      .then(data => { if (data.ok) setRejected(data.batches); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRejected(); }, []);

  return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><AlertTriangle size={13} /> Rejected Batches</div>
        <h2 style={{ fontSize: '28px' }}>Rejected &amp; Flagged Batches</h2>
        <p className="section-lede">Batches that failed quality thresholds. Review reasons and next steps.</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ padding: '10px 18px', background: 'var(--rose-bg)', border: '1px solid var(--rose-border)', borderRadius: '10px', fontSize: '13px', color: 'var(--rose-400)' }}>
          Rejected: <strong>{rejected.length}</strong>
        </div>
        <button onClick={fetchRejected} style={{ marginLeft: 'auto', padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-dim)' }}>Loading rejected batches...</div>
      ) : rejected.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-dim)', background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
          <RefreshCw size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: 'var(--emerald-400)' }}>All Clear</div>
          <div style={{ fontSize: '12px' }}>No rejected batches. All quality tests passed.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {rejected.map(batch => (
            <div key={batch.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--rose-border)', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--rose-400)' }}>{batch.id}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Hive: {batch.hiveId} | {batch.honeyType} | {batch.quantity} kg | Beekeeper: {batch.beekeeper || 'Unknown'}
                  </div>
                </div>
                <button onClick={() => { window.__testingBatchId = batch.id; switchView('chain'); }} style={{ padding: '6px 12px', background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--amber-400)', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ExternalLink size={11} /> Trace
                </button>
              </div>

              <div style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--rose-400)', marginBottom: '10px' }}>Rejection Reasons</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {(batch.rejectionReasons || []).map((reason, i) => {
                    const st = SEVERITY_STYLES[reason.severity] || SEVERITY_STYLES.critical;
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: st.bg, border: `1px solid ${st.border}`, borderRadius: '8px' }}>
                        <AlertTriangle size={14} color={st.color} />
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: 700, fontSize: '12px', color: st.color }}>{reason.param}: </span>
                          <span style={{ fontSize: '12px' }}>{reason.value}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginLeft: '8px' }}>(Threshold: {reason.threshold})</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--amber-400)', marginBottom: '8px' }}>Next Steps</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button style={{ padding: '8px 16px', background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                    Re-test Batch
                  </button>
                  <button style={{ padding: '8px 16px', background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                    Flag Beekeeper for Inspection
                  </button>
                  <button style={{ padding: '8px 16px', background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                    Initiate Fraud Investigation
                  </button>
                  <button onClick={() => switchView('quality-test')} style={{ padding: '8px 16px', background: 'var(--gold-gradient)', border: 'none', borderRadius: '8px', color: '#0f0b04', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>
                    Submit New Test <ArrowRight size={12} style={{ verticalAlign: 'middle' }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
