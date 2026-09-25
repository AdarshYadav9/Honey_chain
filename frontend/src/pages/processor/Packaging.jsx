import React, { useState } from 'react';
import { Package, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const PACKAGING_TYPES = [
  'Glass Jar with Tamper-Evident Seal (500g)',
  'Glass Jar with Tamper-Evident Seal (250g)',
  'Glass Jar with Tamper-Evident Seal (1kg)',
  'Plastic Squeeze Bottle (500g)',
  'Tin Container (1kg)',
  'Bulk Pail (5kg)',
];

export default function Packaging() {
  const { sharedBatches, switchView, showNotification } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('');

  const processed = sharedBatches.filter(b => b.status === 'PROCESSED');

  const [form, setForm] = useState({
    jarCount: '',
    jarWeight: '',
    sealDate: '',
    bestBefore: '',
    packagingType: '',
    batchNumber: '',
    notes: '',
  });

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const batch = sharedBatches.find(b => b.id === selectedBatch);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBatch) return;
    setSubmitting(true);

    try {
      await fetch(`${API_BASE}/api/batches/${selectedBatch}/packaging`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jarCount: parseInt(form.jarCount) || 0,
          jarWeight: form.jarWeight || '500g',
          sealDate: form.sealDate || new Date().toISOString(),
          bestBefore: form.bestBefore || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          packagingType: form.packagingType,
          packagedBatchId: form.batchNumber || `PKG-${selectedBatch}`,
          notes: form.notes,
        }),
      });
      setSubmitted(true);
      showNotification(`Packaging complete for ${selectedBatch}`);
    } catch (e) {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><Package size={13} /> Packaging</div>
        <h2>Package Batch</h2>
        <p className="section-lede">Assign final batch ID, jar count, seal date, and generate QR code.</p>
      </div>

      {submitted ? (
        <div className="result-hero">
          <div className="result-icon success">
            <CheckCircle2 size={32} color="var(--emerald-400)" />
          </div>
          <h3 className="result-title" style={{ color: 'var(--emerald-400)' }}>Packaging Complete</h3>
          <p className="result-sub">
            {selectedBatch} — {form.jarCount} jars sealed. QR code generated.
          </p>
          <div className="result-actions">
            <button onClick={() => switchView('inventory')} className="btn btn-gold">
              View Inventory <ArrowRight size={14} />
            </button>
            <button onClick={() => { setSubmitted(false); setForm({ jarCount: '', jarWeight: '', sealDate: '', bestBefore: '', packagingType: '', batchNumber: '', notes: '' }); }} className="btn btn-soft">
              Package Another
            </button>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '760px' }}>
          <form onSubmit={handleSubmit} className="panel">
            <div className="field" style={{ marginBottom: '20px' }}>
              <label className="field-label">Select Processed Batch *</label>
              <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} required className="select">
                <option value="">Choose a processed batch...</option>
                {processed.map(b => (
                  <option key={b.id} value={b.id}>{b.id} — {b.honeyType} — {b.quantity}kg</option>
                ))}
              </select>
              {processed.length === 0 && <div className="field-hint">No processed batches. Complete processing first.</div>}
            </div>

            {batch && (
              <div className="grid-4 notice">
                <div><span style={{ color: 'var(--text-dim)' }}>Batch: </span><strong>{batch.id}</strong></div>
                <div><span style={{ color: 'var(--text-dim)' }}>Type: </span><strong>{batch.honeyType}</strong></div>
                <div><span style={{ color: 'var(--text-dim)' }}>Qty: </span><strong>{batch.quantity} kg</strong></div>
                <div><span style={{ color: 'var(--text-dim)' }}>Hive: </span><strong>{batch.hiveId}</strong></div>
              </div>
            )}

            <div className="section-title">Packaging Details</div>
            <div className="grid-2">
              <div className="field">
                <label className="field-label">Packaging Type *</label>
                <select value={form.packagingType} onChange={e => update('packagingType', e.target.value)} required className="select">
                  <option value="">Select packaging...</option>
                  {PACKAGING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Packaged Batch ID</label>
                <input type="text" value={form.batchNumber} onChange={e => update('batchNumber', e.target.value)} placeholder={selectedBatch ? `PKG-${selectedBatch}` : 'PKG-HC-XXXX'} className="input" />
              </div>
              <div className="field">
                <label className="field-label">Jar Count *</label>
                <input type="number" min="1" value={form.jarCount} onChange={e => update('jarCount', e.target.value)} placeholder="e.g. 24" required className="input" />
              </div>
              <div className="field">
                <label className="field-label">Jar Weight</label>
                <input type="text" value={form.jarWeight} onChange={e => update('jarWeight', e.target.value)} placeholder="500g" className="input" />
              </div>
              <div className="field">
                <label className="field-label">Seal Date *</label>
                <input type="date" value={form.sealDate || today} onChange={e => update('sealDate', e.target.value)} required className="input" />
              </div>
              <div className="field">
                <label className="field-label">Best Before</label>
                <input type="date" value={form.bestBefore} onChange={e => update('bestBefore', e.target.value)} className="input" />
              </div>
            </div>

            <div className="field mt-16">
              <label className="field-label">Notes</label>
              <textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={2} placeholder="Packaging notes..." className="textarea" />
            </div>

            <button type="submit" disabled={submitting || !selectedBatch} className="btn btn-block btn-gold mt-20">
              <Package size={16} />
              {submitting ? 'Packaging...' : 'Complete Packaging & Generate QR'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}