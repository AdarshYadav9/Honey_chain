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
        <h2>Record Processing</h2>
        <p className="section-lede">Log extraction details: unit used, inputs pooled, output quantity.</p>
      </div>

      {submitted ? (
        <div className="result-hero">
          <div className="result-icon success">
            <CheckCircle2 size={32} color="var(--emerald-400)" />
          </div>
          <h3 className="result-title" style={{ color: 'var(--emerald-400)' }}>Processing Logged</h3>
          <p className="result-sub">
            {selectedBatch} — extraction complete. Ready for packaging.
          </p>
          <div className="result-actions">
            <button onClick={() => switchView('packaging')} className="btn btn-gold">
              Proceed to Packaging <ArrowRight size={14} />
            </button>
            <button onClick={() => { setSubmitted(false); setForm({ extractionUnit: '', inputQty: '', outputQty: '', poolingNote: '', temperature: '', duration: '', notes: '' }); }} className="btn btn-soft">
              Log Another
            </button>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '760px' }}>
          <form onSubmit={handleSubmit} className="panel">
            <div className="field" style={{ marginBottom: '20px' }}>
              <label className="field-label">Select Batch *</label>
              <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} required className="select">
                <option value="">Choose a batch to process...</option>
                {processing.map(b => (
                  <option key={b.id} value={b.id}>{b.id} — {b.hiveId} — {b.honeyType} — {b.quantity}kg — {b.status}</option>
                ))}
              </select>
            </div>

            {batch && (
              <div className="grid-3 notice">
                <div><span style={{ color: 'var(--text-dim)' }}>Hive: </span><strong>{batch.hiveId}</strong></div>
                <div><span style={{ color: 'var(--text-dim)' }}>Type: </span><strong>{batch.honeyType}</strong></div>
                <div><span style={{ color: 'var(--text-dim)' }}>Input Qty: </span><strong>{batch.quantity} kg</strong></div>
              </div>
            )}

            <div className="section-title">Extraction Details</div>
            <div className="grid-2">
              <div className="field">
                <label className="field-label">Extraction Unit *</label>
                <select value={form.extractionUnit} onChange={e => update('extractionUnit', e.target.value)} required className="select">
                  <option value="">Select unit...</option>
                  {EXTRACTION_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Processing Temp (°C)</label>
                <input type="number" step="0.1" value={form.temperature} onChange={e => update('temperature', e.target.value)} placeholder="e.g. 32 (must be below 35°C)" className="input" />
              </div>
              <div className="field">
                <label className="field-label">Input Quantity (kg) *</label>
                <input type="number" step="0.1" min="0" value={form.inputQty} onChange={e => update('inputQty', e.target.value)} placeholder={batch ? String(batch.quantity) : '0'} required className="input" />
              </div>
              <div className="field">
                <label className="field-label">Output Quantity (kg) *</label>
                <input type="number" step="0.1" min="0" value={form.outputQty} onChange={e => update('outputQty', e.target.value)} placeholder="e.g. 11.2 (after filtering loss)" required className="input" />
              </div>
              <div className="field">
                <label className="field-label">Duration (minutes)</label>
                <input type="number" min="0" value={form.duration} onChange={e => update('duration', e.target.value)} placeholder="e.g. 45" className="input" />
              </div>
              <div className="field">
                <label className="field-label">Pooling Note</label>
                <input type="text" value={form.poolingNote} onChange={e => update('poolingNote', e.target.value)} placeholder="e.g. Pooled from HIVE-BOX-01 & 02" className="input" />
              </div>
            </div>

            <div className="field mt-16">
              <label className="field-label">Notes</label>
              <textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={3} placeholder="Any observations during processing..." className="textarea" />
            </div>

            <button type="submit" disabled={submitting || !selectedBatch} className="btn btn-block btn-gold mt-20">
              <Settings size={16} />
              {submitting ? 'Logging Processing...' : 'Complete Processing & Log to Blockchain'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}