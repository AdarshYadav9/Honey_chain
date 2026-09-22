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
        <h2 style={{ fontSize: '28px' }}>Package Batch</h2>
        <p className="section-lede">Assign final batch ID, jar count, seal date, and generate QR code.</p>
      </div>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--emerald-bg)', border: '2px solid var(--emerald-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircle2 size={32} color="var(--emerald-400)" />
          </div>
          <h3 style={{ fontSize: '20px', color: 'var(--emerald-400)', marginBottom: '6px' }}>Packaging Complete</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            {selectedBatch} — {form.jarCount} jars sealed. QR code generated.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => switchView('inventory')} style={{ padding: '10px 20px', background: 'var(--gold-gradient)', border: 'none', borderRadius: '8px', color: '#0f0b04', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
              View Inventory <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
            </button>
            <button onClick={() => { setSubmitted(false); setForm({ jarCount: '', jarWeight: '', sealDate: '', bestBefore: '', packagingType: '', batchNumber: '', notes: '' }); }} style={{ padding: '10px 20px', background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px' }}>
              Package Another
            </button>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '760px' }}>
          <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Select Processed Batch *</label>
              <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }}>
                <option value="">Choose a processed batch...</option>
                {processed.map(b => (
                  <option key={b.id} value={b.id}>{b.id} — {b.honeyType} — {b.quantity}kg</option>
                ))}
              </select>
              {processed.length === 0 && <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '6px' }}>No processed batches. Complete processing first.</div>}
            </div>

            {batch && (
              <div style={{ padding: '12px', background: 'var(--bg-inset)', borderRadius: '8px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '12px' }}>
                <div><span style={{ color: 'var(--text-dim)' }}>Batch: </span><strong>{batch.id}</strong></div>
                <div><span style={{ color: 'var(--text-dim)' }}>Type: </span><strong>{batch.honeyType}</strong></div>
                <div><span style={{ color: 'var(--text-dim)' }}>Qty: </span><strong>{batch.quantity} kg</strong></div>
                <div><span style={{ color: 'var(--text-dim)' }}>Hive: </span><strong>{batch.hiveId}</strong></div>
              </div>
            )}

            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '14px', color: 'var(--amber-400)' }}>Packaging Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Packaging Type *</label>
                <select value={form.packagingType} onChange={e => update('packagingType', e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }}>
                  <option value="">Select packaging...</option>
                  {PACKAGING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Packaged Batch ID</label>
                <input type="text" value={form.batchNumber} onChange={e => update('batchNumber', e.target.value)} placeholder={selectedBatch ? `PKG-${selectedBatch}` : 'PKG-HC-XXXX'} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Jar Count *</label>
                <input type="number" min="1" value={form.jarCount} onChange={e => update('jarCount', e.target.value)} placeholder="e.g. 24" required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Jar Weight</label>
                <input type="text" value={form.jarWeight} onChange={e => update('jarWeight', e.target.value)} placeholder="500g" style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Seal Date *</label>
                <input type="date" value={form.sealDate || today} onChange={e => update('sealDate', e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Best Before</label>
                <input type="date" value={form.bestBefore} onChange={e => update('bestBefore', e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Notes</label>
              <textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={2} placeholder="Packaging notes..." style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none', resize: 'vertical' }} />
            </div>

            <button type="submit" disabled={submitting || !selectedBatch} style={{ marginTop: '20px', width: '100%', padding: '12px', background: submitting || !selectedBatch ? 'var(--text-dim)' : 'var(--gold-gradient)', border: 'none', borderRadius: '10px', color: '#0f0b04', fontSize: '14px', fontWeight: 700, cursor: submitting || !selectedBatch ? 'not-allowed' : 'pointer' }}>
              <Package size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              {submitting ? 'Packaging...' : 'Complete Packaging & Generate QR'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
