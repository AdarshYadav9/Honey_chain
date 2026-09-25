import React, { useState, useEffect } from 'react';
import { AlertTriangle, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

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
        <h2>Rejected &amp; Flagged Batches</h2>
        <p className="section-lede">Batches that failed quality thresholds. Review reasons and next steps.</p>
      </div>

      <div className="flex gap-12" style={{ marginBottom: '20px' }}>
        <div className="notice notice-danger">
          Rejected: <strong>{rejected.length}</strong>
        </div>
        <button onClick={fetchRejected} className="btn btn-soft btn-sm" style={{ marginLeft: 'auto' }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="state-loading">Loading rejected batches...</div>
      ) : rejected.length === 0 ? (
        <div className="panel result-hero">
          <RefreshCw size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: 'var(--emerald-400)' }}>All Clear</div>
          <div style={{ fontSize: '12px' }}>No rejected batches. All quality tests passed.</div>
        </div>
      ) : (
        <div className="flex-col gap-12">
          {rejected.map(batch => (
            <div key={batch.id} className="panel" style={{ borderColor: 'var(--rose-border)', overflow: 'hidden', padding: 0 }}>
              <div className="flex-between" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--rose-400)' }}>{batch.id}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Hive: {batch.hiveId} | {batch.honeyType} | {batch.quantity} kg | Beekeeper: {batch.beekeeper || 'Unknown'}
                  </div>
                </div>
                <button onClick={() => { window.__testingBatchId = batch.id; switchView('chain'); }} className="btn btn-soft btn-sm" style={{ color: 'var(--amber-400)' }}>
                  <ExternalLink size={11} /> Trace
                </button>
              </div>

              <div style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--rose-400)', marginBottom: '10px' }}>Rejection Reasons</div>
                <div className="flex-col gap-8" style={{ marginBottom: '16px' }}>
                  {(batch.rejectionReasons || []).map((reason, i) => {
                    const st = SEVERITY_STYLES[reason.severity] || SEVERITY_STYLES.critical;
                    return (
                      <div key={i} className="flex gap-12" style={{ padding: '10px 14px', background: st.bg, border: `1px solid ${st.border}`, borderRadius: '8px' }}>
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
                <div className="toolbar-group">
                  <button className="btn btn-soft btn-sm">
                    Re-test Batch
                  </button>
                  <button className="btn btn-soft btn-sm">
                    Flag Beekeeper for Inspection
                  </button>
                  <button className="btn btn-soft btn-sm">
                    Initiate Fraud Investigation
                  </button>
                  <button onClick={() => switchView('quality-test')} className="btn btn-gold btn-sm">
                    Submit New Test <ArrowRight size={12} />
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