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
        <h2 style={{ fontSize: '28px' }}>Ready for Processing</h2>
        <p className="section-lede">Quality-certified raw batches awaiting extraction and processing.</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ padding: '10px 18px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '10px', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-dim)' }}>Ready: </span>
          <strong style={{ color: 'var(--amber-400)' }}>{incoming.length}</strong>
        </div>
        <div style={{ padding: '10px 18px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '10px', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-dim)' }}>Processing: </span>
          <strong style={{ color: '#60a5fa' }}>{inProgress.length}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {incoming.map(batch => (
          <div key={batch.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--emerald-bg)', border: '1px solid var(--emerald-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald-400)' }}>
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--amber-400)' }}>{batch.id}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Hive: {batch.hiveId} | {batch.honeyType} | {batch.quantity} kg | Beekeeper: {batch.beekeeper || 'Unknown'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleStartProcessing(batch.id)}
                disabled={processing === batch.id}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: 'var(--gold-gradient)', border: 'none', borderRadius: '8px', color: '#0f0b04', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
              >
                {processing === batch.id ? 'Starting...' : 'Start Processing'} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}

        {inProgress.length > 0 && (
          <>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Progress</div>
            {inProgress.map(batch => (
              <div key={batch.id} style={{ background: 'var(--bg-card)', border: '1px solid rgba(96, 165, 250, 0.3)', borderRadius: '14px', padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(96, 165, 250, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                      <Clock size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#60a5fa' }}>{batch.id}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {batch.honeyType} | {batch.quantity} kg | Processing...
                      </div>
                    </div>
                  </div>
                  <button onClick={() => switchView('processing-log')} style={{ padding: '8px 16px', background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}>
                    Log Details →
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {incoming.length === 0 && inProgress.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-dim)', background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <Inbox size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>No Incoming Batches</div>
            <div style={{ fontSize: '12px' }}>Waiting for quality-certified batches from the lab.</div>
          </div>
        )}
      </div>
    </section>
  );
}
