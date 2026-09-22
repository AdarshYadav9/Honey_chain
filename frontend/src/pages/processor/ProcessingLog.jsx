import React, { useState } from 'react';
import { Settings, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const EXTRACTION_UNITS = [
  'SS Centrifugal Extractor — Unit A',
  'SS Centrifugal Extractor — Unit B',
  'Manual Crush & Strain Station',
  'Flow Hive Gravity Drain System',
];

export default function ProcessingLog() {
  const { sharedBatches, switchView, showNotification } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('');

  const processing = sharedBatches.filter(b => b.status === 'PROCESSED' || b.status === 'QUALITY_VERIFIED' || b.status === 'CERTIFIED');

  const [form, setForm] = useState({
    extractionUnit: '',
    inputQty: '',
    outputQty: '',
    poolingNote: '',
    temperature: '',
    duration: '',
    notes: '',
  });

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const batch = sharedBatches.find(b => b.id === selectedBatch);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBatch) return;
    setSubmitting(true);

    try {
      await fetch(`${API_BASE}/api/batches/${selectedBatch}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          extractionUnit: form.extractionUnit,
          inputQuantity: parseFloat(form.inputQty) || batch?.quantity || 0,
          outputQuantity: parseFloat(form.outputQty) || 0,
          poolingNote: form.poolingNote,
          processingTemp: form.temperature ? parseFloat(form.temperature) : null,
          durationMinutes: form.duration ? parseInt(form.duration) : null,
          notes: form.notes,
          processedAt: new Date().toISOString(),
          processor: 'Satara Processing Unit',
        }),
      });
      setSubmitted(true);
      showNotification(`Processing logged for ${selectedBatch}`);
    } catch (e) {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><Settings size={13} /> Processing Log</div>
        <h2 style={{ fontSize: '28px' }}>Record Processing</h2>
        <p className="section-lede">Log extraction details: unit used, inputs pooled, output quantity.</p>
      </div>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--emerald-bg)', border: '2px solid var(--emerald-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircle2 size={32} color="var(--emerald-400)" />
          </div>
          <h3 style={{ fontSize: '20px', color: 'var(--emerald-400)', marginBottom: '6px' }}>Processing Logged</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            {selectedBatch} — extraction complete. Ready for packaging.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => switchView('packaging')} style={{ padding: '10px 20px', background: 'var(--gold-gradient)', border: 'none', borderRadius: '8px', color: '#0f0b04', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
              Proceed to Packaging <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
            </button>
            <button onClick={() => { setSubmitted(false); setForm({ extractionUnit: '', inputQty: '', outputQty: '', poolingNote: '', temperature: '', duration: '', notes: '' }); }} style={{ padding: '10px 20px', background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px' }}>
              Log Another
            </button>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '760px' }}>
          <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Select Batch *</label>
              <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }}>
                <option value="">Choose a batch to process...</option>
                {processing.map(b => (
                  <option key={b.id} value={b.id}>{b.id} — {b.hiveId} — {b.honeyType} — {b.quantity}kg — {b.status}</option>
                ))}
              </select>
            </div>

            {batch && (
              <div style={{ padding: '12px', background: 'var(--bg-inset)', borderRadius: '8px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '12px' }}>
                <div><span style={{ color: 'var(--text-dim)' }}>Hive: </span><strong>{batch.hiveId}</strong></div>
                <div><span style={{ color: 'var(--text-dim)' }}>Type: </span><strong>{batch.honeyType}</strong></div>
                <div><span style={{ color: 'var(--text-dim)' }}>Input Qty: </span><strong>{batch.quantity} kg</strong></div>
              </div>
            )}

            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '14px', color: 'var(--amber-400)' }}>Extraction Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Extraction Unit *</label>
                <select value={form.extractionUnit} onChange={e => update('extractionUnit', e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }}>
                  <option value="">Select unit...</option>
                  {EXTRACTION_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Processing Temp (°C)</label>
                <input type="number" step="0.1" value={form.temperature} onChange={e => update('temperature', e.target.value)} placeholder="e.g. 32 (must be below 35°C)" style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Input Quantity (kg) *</label>
                <input type="number" step="0.1" min="0" value={form.inputQty} onChange={e => update('inputQty', e.target.value)} placeholder={batch ? String(batch.quantity) : '0'} required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Output Quantity (kg) *</label>
                <input type="number" step="0.1" min="0" value={form.outputQty} onChange={e => update('outputQty', e.target.value)} placeholder="e.g. 11.2 (after filtering loss)" required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Duration (minutes)</label>
                <input type="number" min="0" value={form.duration} onChange={e => update('duration', e.target.value)} placeholder="e.g. 45" style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Pooling Note</label>
                <input type="text" value={form.poolingNote} onChange={e => update('poolingNote', e.target.value)} placeholder="e.g. Pooled from HIVE-BOX-01 & 02" style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Notes</label>
              <textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={3} placeholder="Any observations during processing..." style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none', resize: 'vertical' }} />
            </div>

            <button type="submit" disabled={submitting || !selectedBatch} style={{ marginTop: '20px', width: '100%', padding: '12px', background: submitting || !selectedBatch ? 'var(--text-dim)' : 'var(--gold-gradient)', border: 'none', borderRadius: '10px', color: '#0f0b04', fontSize: '14px', fontWeight: 700, cursor: submitting || !selectedBatch ? 'not-allowed' : 'pointer' }}>
              <Settings size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              {submitting ? 'Logging Processing...' : 'Complete Processing & Log to Blockchain'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
