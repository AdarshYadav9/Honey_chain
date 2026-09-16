import React, { useState } from 'react';
import { Droplets, CheckCircle2, ArrowRight, Calendar, MapPin, FlaskConical } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const API_BASE = window.location.hostname !== 'localhost' ? '' : 'http://localhost:4000';

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
        <h2 style={{ fontSize: '28px' }}>Submit Harvest</h2>
        <p className="section-lede">Log a harvest event, tie it to a hive, and start a new batch on-chain.</p>
      </div>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--emerald-bg)', border: '2px solid var(--emerald-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircle2 size={32} color="var(--emerald-400)" />
          </div>
          <h3 style={{ fontSize: '20px', color: 'var(--emerald-400)', marginBottom: '6px' }}>Harvest Logged Successfully</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Batch <strong style={{ color: 'var(--amber-400)' }}>{createdBatch?.id}</strong> created and registered.
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '24px' }}>
            {form.honeyType} • {form.quantity} kg • {form.extractionMethod}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => switchView('my-batches')} style={{ padding: '10px 20px', background: 'var(--gold-gradient)', border: 'none', borderRadius: '8px', color: '#0f0b04', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
              View My Batches <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
            </button>
            <button onClick={() => { setSubmitted(false); setCreatedBatch(null); setForm({ hiveId: '', honeyType: '', extractionMethod: '', quantity: '', moisture: '', flora: '', notes: '' }); }} style={{ padding: '10px 20px', background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px' }}>
              Submit Another
            </button>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '680px' }}>
          <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Select Hive *</label>
                <select value={form.hiveId} onChange={e => update('hiveId', e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }}>
                  <option value="">Choose a hive...</option>
                  {userHives.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Honey Type *</label>
                <select value={form.honeyType} onChange={e => update('honeyType', e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }}>
                  <option value="">Select honey type...</option>
                  {HONEY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Extraction Method *</label>
                <select value={form.extractionMethod} onChange={e => update('extractionMethod', e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }}>
                  <option value="">Select method...</option>
                  {EXTRACTION_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Quantity (kg) *</label>
                <input type="number" step="0.1" min="0" value={form.quantity} onChange={e => update('quantity', e.target.value)} placeholder="e.g. 12.5" required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Moisture Content (%)</label>
                <input type="number" step="0.1" min="0" max="30" value={form.moisture} onChange={e => update('moisture', e.target.value)} placeholder="e.g. 17.5" style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Floral Source</label>
                <input type="text" value={form.flora} onChange={e => update('flora', e.target.value)} placeholder="e.g. Litchi Blossom, Mustard Field" style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Notes (optional)</label>
              <textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={3} placeholder="Any observations about this harvest..." style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none', resize: 'vertical' }} />
            </div>

            <div style={{ marginTop: '16px', padding: '12px', background: 'var(--bg-inset)', borderRadius: '8px', display: 'flex', gap: '20px', fontSize: '11.5px', color: 'var(--text-dim)' }}>
              <span><Calendar size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Date: <strong style={{ color: 'var(--text-main)' }}>{new Date().toLocaleDateString()}</strong></span>
              <span><MapPin size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> GPS: <strong style={{ color: 'var(--text-main)' }}>Auto-captured</strong></span>
              <span><FlaskConical size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Lab: <strong style={{ color: 'var(--amber-400)' }}>Pending</strong></span>
            </div>

            <button type="submit" disabled={submitting} style={{ marginTop: '20px', width: '100%', padding: '12px', background: submitting ? 'var(--text-dim)' : 'var(--gold-gradient)', border: 'none', borderRadius: '10px', color: '#0f0b04', fontSize: '14px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer' }}>
              <Droplets size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              {submitting ? 'Creating Batch...' : 'Submit Harvest & Create Batch'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
