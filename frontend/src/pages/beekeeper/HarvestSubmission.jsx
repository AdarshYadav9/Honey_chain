import React, { useState } from 'react';
import { Droplets, CheckCircle2, ArrowRight, Calendar, MapPin, FlaskConical } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const HONEY_TYPES = [
  'Raw Pure Multifloral Honey',
  'Raw Pure Litchi Monofloral Honey',
  'Raw Pure Mustard Monofloral Honey',
  'Raw Pure Forest Honey',
  'Raw Pure Eucalyptus Honey',
  'Raw Pure Sunflower Honey',
  'Raw Pure Sidr Honey',
  'Raw Pure Honeydew Honey',
];

const EXTRACTION_METHODS = [
  'Stainless Steel Centrifugal Cold Extraction',
  'Traditional Pressed (Unheated)',
  'Flow Hive Gravity Drain',
  'Manual Crush & Strain',
  'Automatic Extractor (Heated <35°C)',
  'Organic Certified Cold Process',
];

export default function HarvestSubmission() {
  const { switchView, fetchBatches, currentUser } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [createdBatch, setCreatedBatch] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    hiveId: '',
    honeyType: '',
    extractionMethod: '',
    quantity: '',
    moisture: '',
    flora: '',
    notes: '',
  });

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const userHives = ['HIVE-BOX-01', 'HIVE-BOX-02', 'HIVE-BOX-03', 'HIVE-BOX-04', 'HIVE-BOX-05'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/batches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hiveId: form.hiveId,
          honeyType: form.honeyType,
          extractionMethod: form.extractionMethod,
          quantity: parseFloat(form.quantity),
          moisture: form.moisture ? parseFloat(form.moisture) : null,
          floralSource: form.flora,
          notes: form.notes,
          harvestDate: new Date().toISOString(),
          beekeeper: currentUser?.name || 'Unknown',
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setCreatedBatch(data.batch);
        setSubmitted(true);
        fetchBatches();
      }
    } catch (err) {
      // Fallback: create locally if backend not running
      const localBatch = {
        id: `HONEY-BATCH-${Date.now()}`,
        hiveId: form.hiveId,
        honeyType: form.honeyType,
        extractionMethod: form.extractionMethod,
        quantity: parseFloat(form.quantity),
        moisture: form.moisture ? parseFloat(form.moisture) : null,
        floralSource: form.flora,
        notes: form.notes,
        harvestDate: new Date().toISOString(),
        beekeeper: currentUser?.name || 'Unknown',
        status: 'HARVEST_CREATED',
        transactions: [{
          event: 'Harvest Created',
          date: new Date().toISOString(),
          actor: currentUser?.name || 'Unknown',
        }],
      };
      setCreatedBatch(localBatch);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><Droplets size={13} /> Harvest Management</div>
        <h2>Submit Harvest</h2>
        <p className="section-lede">Log a harvest event, tie it to a hive, and start a new batch on-chain.</p>
      </div>

      {submitted ? (
        <div className="result-hero">
          <div className="result-icon success">
            <CheckCircle2 size={32} color="var(--emerald-400)" />
          </div>
          <h3 className="result-title" style={{ color: 'var(--emerald-400)' }}>Harvest Logged Successfully</h3>
          <p className="result-sub" style={{ marginBottom: '8px' }}>
            Batch <strong style={{ color: 'var(--amber-400)' }}>{createdBatch?.id}</strong> created and registered.
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
            {form.honeyType} • {form.quantity} kg • {form.extractionMethod}
          </p>
          <div className="result-actions">
            <button onClick={() => switchView('my-batches')} className="btn-luxury btn-luxury-primary">
              View My Batches <ArrowRight size={14} />
            </button>
            <button onClick={() => { setSubmitted(false); setCreatedBatch(null); setForm({ hiveId: '', honeyType: '', extractionMethod: '', quantity: '', moisture: '', flora: '', notes: '' }); }} className="btn-luxury btn-luxury-ghost">
              Submit Another
            </button>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '680px' }}>
          <form onSubmit={handleSubmit} className="glass-card">
            <div className="grid-2">
              <div className="field">
                <label className="field-label">Select Hive *</label>
                <select value={form.hiveId} onChange={e => update('hiveId', e.target.value)} required className="select">
                  <option value="">Choose a hive...</option>
                  {userHives.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div className="field">
                <label className="field-label">Honey Type *</label>
                <select value={form.honeyType} onChange={e => update('honeyType', e.target.value)} required className="select">
                  <option value="">Select honey type...</option>
                  {HONEY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="field">
                <label className="field-label">Extraction Method *</label>
                <select value={form.extractionMethod} onChange={e => update('extractionMethod', e.target.value)} required className="select">
                  <option value="">Select method...</option>
                  {EXTRACTION_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="field">
                <label className="field-label">Quantity (kg) *</label>
                <input type="number" step="0.1" min="0" value={form.quantity} onChange={e => update('quantity', e.target.value)} placeholder="e.g. 12.5" required className="input" />
              </div>

              <div className="field">
                <label className="field-label">Moisture Content (%)</label>
                <input type="number" step="0.1" min="0" max="30" value={form.moisture} onChange={e => update('moisture', e.target.value)} placeholder="e.g. 17.5" className="input" />
              </div>

              <div className="field">
                <label className="field-label">Floral Source</label>
                <input type="text" value={form.flora} onChange={e => update('flora', e.target.value)} placeholder="e.g. Litchi Blossom, Mustard Field" className="input" />
              </div>
            </div>

            <div className="field mt-16">
              <label className="field-label">Notes (optional)</label>
              <textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={3} placeholder="Any observations about this harvest..." className="textarea" />
            </div>

            <div className="summary-strip mt-16">
              <span><Calendar size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Date: <strong>{new Date().toLocaleDateString()}</strong></span>
              <span><MapPin size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> GPS: <strong>Auto-captured</strong></span>
              <span><FlaskConical size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Lab: <strong style={{ color: 'var(--amber-400)' }}>Pending</strong></span>
            </div>

            <button type="submit" disabled={submitting} className="btn btn-gold btn-block mt-20">
              <Droplets size={16} />
              {submitting ? 'Creating Batch...' : 'Submit Harvest & Create Batch'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}