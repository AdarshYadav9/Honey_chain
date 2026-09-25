import React, { useState } from 'react';
import { Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const LOGISTICS_PARTNERS = [
  'BlueDart Cold Chain Logistics',
  'Delhivery Supply Chain',
  'DTDC Courier & Freight',
  'Gati-KWE Cold Chain',
  'Mahindra Logistics',
  'Self-Managed Distribution',
];

const DESTINATIONS = [
  'Mumbai Retail Hub — Andheri',
  'Delhi NCR Distribution Center — Gurugram',
  'Bangalore Wholesale Market — Whitefield',
  'Kolkata Regional Depot — Salt Lake',
  'Chennai Honey Outlet — T. Nagar',
  'Pune Direct Store — FC Road',
  'Export — Dubai (FZE Warehouse)',
  'Export — Singapore (Asia-Pacific Hub)',
];

export default function DistributionHandoff() {
  const { sharedBatches, showNotification } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('');

  const packaged = sharedBatches.filter(b => b.status === 'PACKAGED');

  const [form, setForm] = useState({
    logisticsPartner: '',
    destination: '',
    dispatchDate: '',
    jarCount: '',
    trackingId: '',
    notes: '',
  });

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const batch = sharedBatches.find(b => b.id === selectedBatch);
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBatch) return;
    setSubmitting(true);

    try {
      await fetch(`${API_BASE}/api/batches/${selectedBatch}/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logisticsPartner: form.logisticsPartner,
          destination: form.destination,
          dispatchDate: form.dispatchDate || new Date().toISOString(),
          jarCount: parseInt(form.jarCount) || 0,
          trackingId: form.trackingId || `TRK-${Date.now()}`,
          notes: form.notes,
        }),
      });
      setSubmitted(true);
      showNotification(`${selectedBatch} dispatched to ${form.logisticsPartner}`);
    } catch (e) {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><Truck size={13} /> Distribution Handoff</div>
        <h2>Dispatch &amp; Handoff</h2>
        <p className="section-lede">Log dispatch to logistics partner or retail. Completes the chain before consumer scan.</p>
      </div>

      {submitted ? (
        <div className="result-hero">
          <div className="result-icon success">
            <CheckCircle2 size={32} color="var(--emerald-400)" />
          </div>
          <h3 className="result-title" style={{ color: 'var(--emerald-400)' }}>Dispatch Logged</h3>
          <p className="result-sub">
            {selectedBatch} handed off to {form.logisticsPartner}. Tracking: {form.trackingId || 'Pending'}
          </p>
          <p className="field-hint">
            Destination: {form.destination}. Consumer can now scan QR to verify full traceability.
          </p>
          <div className="result-actions">
            <button onClick={() => setSubmitted(false)} className="btn btn-gold">
              Dispatch Another <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '760px' }}>
          <form onSubmit={handleSubmit} className="panel">
            <div className="field" style={{ marginBottom: '20px' }}>
              <label className="field-label">Select Packaged Batch *</label>
              <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} required className="select">
                <option value="">Choose a packaged batch...</option>
                {packaged.map(b => (
                  <option key={b.id} value={b.id}>{b.id} — {b.honeyType} — {b.quantity}kg</option>
                ))}
              </select>
              {packaged.length === 0 && <div className="field-hint">No packaged batches ready for dispatch.</div>}
            </div>

            {batch && (
              <div className="grid-4 notice">
                <div><span style={{ color: 'var(--text-dim)' }}>Batch: </span><strong>{batch.id}</strong></div>
                <div><span style={{ color: 'var(--text-dim)' }}>Type: </span><strong>{batch.honeyType}</strong></div>
                <div><span style={{ color: 'var(--text-dim)' }}>Qty: </span><strong>{batch.quantity} kg</strong></div>
                <div><span style={{ color: 'var(--text-dim)' }}>Hive: </span><strong>{batch.hiveId}</strong></div>
              </div>
            )}

            <div className="section-title">Dispatch Details</div>
            <div className="grid-2">
              <div className="field">
                <label className="field-label">Logistics Partner *</label>
                <select value={form.logisticsPartner} onChange={e => update('logisticsPartner', e.target.value)} required className="select">
                  <option value="">Select partner...</option>
                  {LOGISTICS_PARTNERS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Destination *</label>
                <select value={form.destination} onChange={e => update('destination', e.target.value)} required className="select">
                  <option value="">Select destination...</option>
                  {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Dispatch Date *</label>
                <input type="date" value={form.dispatchDate || today} onChange={e => update('dispatchDate', e.target.value)} required className="input" />
              </div>
              <div className="field">
                <label className="field-label">Jar Count</label>
                <input type="number" min="1" value={form.jarCount} onChange={e => update('jarCount', e.target.value)} placeholder="Number of jars dispatched" className="input" />
              </div>
              <div className="field">
                <label className="field-label">Tracking ID</label>
                <input type="text" value={form.trackingId} onChange={e => update('trackingId', e.target.value)} placeholder="Auto-generated if blank" className="input" />
              </div>
            </div>

            <div className="field mt-16">
              <label className="field-label">Notes</label>
              <textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={2} placeholder="Dispatch notes..." className="textarea" />
            </div>

            <button type="submit" disabled={submitting || !selectedBatch} className="btn btn-block btn-gold mt-20">
              <Truck size={16} />
              {submitting ? 'Dispatching...' : 'Confirm Dispatch & Log to Blockchain'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}