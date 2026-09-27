import React from 'react';
import { Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Processing() {
  const { sharedBatches, handleProcessSubmit, handlePackageSubmit } = useApp();
  const queued = sharedBatches.filter(b => b.status === 'QUALITY_VERIFIED' || b.status === 'PROCESSED');

  return (
    <section className="view-pane active" id="view-processing">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><Layers size={13} /> Processing Unit</div>
        <h2>Batches Ready for Processing</h2>
      </div>

      <div className="flex-col gap-20">
        {queued.map(batch => (
          <div key={batch.id} className="glass-card">
            <div className="panel-head">
              <div>
                <h3 style={{ margin: 0, color: 'var(--amber-400)' }}>Batch: {batch.id}</h3>
                <div className="muted mt-8">
                  Hive: {batch.hiveId} • Type: {batch.honeyType} • Qty: {batch.quantity}kg
                </div>
              </div>
              <div className="status-badge pill" style={{ background: 'rgba(255,255,255,0.1)' }}>
                {batch.status}
              </div>
            </div>

            {batch.status === 'QUALITY_VERIFIED' && (
              <form onSubmit={(e) => handleProcessSubmit(e, batch.id)} style={{ background: 'var(--bg-input-subtle)', padding: '20px', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
                <div className="field">
                  <label className="field-label">Processing Center</label>
                  <input type="text" id="center" defaultValue="Satara Processing Unit" readOnly className="input" style={{ color: 'var(--text-muted)' }} />
                </div>
                <div className="field">
                  <label className="field-label">Quantity Processed (kg)</label>
                  <input type="number" id="qtyProcessed" defaultValue={batch.quantity} step="0.1" className="input" />
                </div>
                <button type="submit" className="btn-luxury btn-luxury-primary">Complete Processing</button>
              </form>
            )}

            {batch.status === 'PROCESSED' && (
              <button onClick={() => handlePackageSubmit(batch.id)} className="btn-luxury" style={{ background: 'var(--emerald-500)', borderColor: 'var(--emerald-400)', color: 'white' }}>
                Mark as Packaged &amp; Generate QR
              </button>
            )}
          </div>
        ))}
        {queued.length === 0 && (
          <div className="state-empty">No batches currently queued for processing.</div>
        )}
      </div>
    </section>
  );
}
