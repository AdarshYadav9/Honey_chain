import React from 'react';
import { Layers, QrCode } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ProcessorBatches() {
  const { sharedBatches, switchView, setBatchIdInput } = useApp();
  const handled = sharedBatches.filter(b => ['PROCESSED', 'PACKAGED', 'DISPATCHED'].includes(b.status));

  return (
    <section className="view-pane active" id="view-proc-batches">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><Layers size={13} /> Processing Unit Records</div>
        <h2>Batches</h2>
        <p className="section-lede">All batches that have passed through your processing unit, from extraction to packaging.</p>
      </div>

      <div className="glass-card">
        <table className="mm-table">
          <thead>
            <tr><th>Batch ID</th><th>Hive</th><th>Type</th><th>Qty</th><th>Status</th><th>QR</th><th></th></tr>
          </thead>
          <tbody>
            {handled.map(b => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.hiveId}</td>
                <td>{b.honeyType}</td>
                <td>{b.quantity} kg</td>
                <td className={b.status === 'PACKAGED' ? 'status-ok' : ''}>{b.status}</td>
                <td>
                  {b.status === 'PACKAGED'
                    ? <span className="pill" style={{ color: 'var(--emerald-400)' }}><QrCode size={14} /> Generated</span>
                    : <span className="muted">Pending</span>}
                </td>
                <td>
                  <button className="btn-luxury btn-luxury-ghost btn-sm" onClick={() => { setBatchIdInput(b.id); switchView('chain'); }}>
                    Track →
                  </button>
                </td>
              </tr>
            ))}
            {handled.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>No processed batches yet — check the Processing tab for incoming batches.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
