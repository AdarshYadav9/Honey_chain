import React, { useState } from 'react';
import { Inbox, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function IncomingBatches() {
  const { sharedBatches, switchView } = useApp();
  const [processing, setProcessing] = useState(null);

  const incoming = sharedBatches.filter(b => b.status === 'QUALITY_VERIFIED' || b.status === 'CERTIFIED');
  const inProgress = sharedBatches.filter(b => b.status === 'PROCESSED');

  const handleStartProcessing = async (batchId) => {
    setProcessing(batchId);
    try {
      await fetch(`${API_BASE}/api/batches/${batchId}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startedAt: new Date().toISOString() }),
      });
    } catch (e) {}
    setProcessing(null);
  };

  return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><Inbox size={13} /> Incoming Batches</div>
        <h2>Ready for Processing</h2>
        <p className="section-lede">Quality-certified raw batches awaiting extraction and processing.</p>
      </div>

      <div className="summary-strip">
        <span>Ready: <strong style={{ color: 'var(--amber-400)' }}>{incoming.length}</strong></span>
        <span>Processing: <strong style={{ color: '#60a5fa' }}>{inProgress.length}</strong></span>
      </div>

      <div className="flex-col gap-12">
        {incoming.map(batch => (
          <div key={batch.id} className="glass-card">
            <div className="flex-between">
              <div className="flex gap-12">
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--emerald-bg)', border: '1px solid var(--emerald-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald-400)' }}>
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--amber-400)' }}>{batch.id}</div>
                  <div className="muted">
                    Hive: {batch.hiveId} | {batch.honeyType} | {batch.quantity} kg | Beekeeper: {batch.beekeeper || 'Unknown'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleStartProcessing(batch.id)}
                disabled={processing === batch.id}
                className="btn btn-gold"
              >
                {processing === batch.id ? 'Starting...' : 'Start Processing'} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}

        {inProgress.length > 0 && (
          <>
            <div className="panel-title mt-8">In Progress</div>
            {inProgress.map(batch => (
              <div key={batch.id} className="glass-card" style={{ borderColor: 'rgba(96, 165, 250, 0.3)' }}>
                <div className="flex-between">
                  <div className="flex gap-12">
                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(96, 165, 250, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                      <Clock size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#60a5fa' }}>{batch.id}</div>
                      <div className="muted">
                        {batch.honeyType} | {batch.quantity} kg | Processing...
                      </div>
                    </div>
                  </div>
                  <button onClick={() => switchView('processing-log')} className="btn btn-soft btn-sm">
                    Log Details →
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {incoming.length === 0 && inProgress.length === 0 && (
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <Inbox size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>No Incoming Batches</div>
            <div className="muted">Waiting for quality-certified batches from the lab.</div>
          </div>
        )}
      </div>
    </section>
  );
}
