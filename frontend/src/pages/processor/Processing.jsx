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
        <h2 style={{ fontSize: '30px' }}>Batches Ready for Processing</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {queued.map(batch => (
          <div key={batch.id} className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, color: 'var(--amber-400)' }}>Batch: {batch.id}</h3>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Hive: {batch.hiveId} • Type: {batch.honeyType} • Qty: {batch.quantity}kg
                </div>
              </div>
              <div className="status-badge" style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '4px', fontSize: '12px' }}>
                {batch.status}
              </div>
            </div>

            {batch.status === 'QUALITY_VERIFIED' && (
              <form onSubmit={(e) => handleProcessSubmit(e, batch.id)} style={{ background: 'var(--bg-input-subtle)', padding: '20px', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: 'var(--text-muted)' }}>Processing Center</label>
                  <input type="text" id="center" defaultValue="Satara Processing Unit" readOnly style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-muted)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: 'var(--text-muted)' }}>Quantity Processed (kg)</label>
                  <input type="number" id="qtyProcessed" defaultValue={batch.quantity} step="0.1" style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-main)' }} />
                </div>
                <button type="submit" className="btn-luxury btn-luxury-primary" style={{ padding: '10px 16px', height: '42px' }}>Complete Processing</button>
              </form>
            )}

            {batch.status === 'PROCESSED' && (
              <button onClick={() => handlePackageSubmit(batch.id)} className="btn-luxury btn-luxury-primary" style={{ padding: '10px 20px', background: 'var(--emerald-500)', borderColor: 'var(--emerald-400)', color: 'white' }}>
                Mark as Packaged &amp; Generate QR
              </button>
            )}
          </div>
        ))}
        {queued.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No batches currently queued for processing.</div>
        )}
      </div>
    </section>
  );
}
