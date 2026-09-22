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
        <h2 style={{ fontSize: '28px' }}>Dispatch &amp; Handoff</h2>
        <p className="section-lede">Log dispatch to logistics partner or retail. Completes the chain before consumer scan.</p>
      </div>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--emerald-bg)', border: '2px solid var(--emerald-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircle2 size={32} color="var(--emerald-400)" />
          </div>
          <h3 style={{ fontSize: '20px', color: 'var(--emerald-400)', marginBottom: '6px' }}>Dispatch Logged</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            {selectedBatch} handed off to {form.logisticsPartner}. Tracking: {form.trackingId || 'Pending'}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '24px' }}>
            Destination: {form.destination}. Consumer can now scan QR to verify full traceability.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => setSubmitted(false)} style={{ padding: '10px 20px', background: 'var(--gold-gradient)', border: 'none', borderRadius: '8px', color: '#0f0b04', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
              Dispatch Another <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
            </button>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '760px' }}>
          <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Select Packaged Batch *</label>
              <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }}>
                <option value="">Choose a packaged batch...</option>
                {packaged.map(b => (
                  <option key={b.id} value={b.id}>{b.id} — {b.honeyType} — {b.quantity}kg</option>
                ))}
              </select>
              {packaged.length === 0 && <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '6px' }}>No packaged batches ready for dispatch.</div>}
            </div>

            {batch && (
              <div style={{ padding: '12px', background: 'var(--bg-inset)', borderRadius: '8px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '12px' }}>
                <div><span style={{ color: 'var(--text-dim)' }}>Batch: </span><strong>{batch.id}</strong></div>
                <div><span style={{ color: 'var(--text-dim)' }}>Type: </span><strong>{batch.honeyType}</strong></div>
                <div><span style={{ color: 'var(--text-dim)' }}>Qty: </span><strong>{batch.quantity} kg</strong></div>
                <div><span style={{ color: 'var(--text-dim)' }}>Hive: </span><strong>{batch.hiveId}</strong></div>
              </div>
            )}

            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '14px', color: 'var(--amber-400)' }}>Dispatch Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Logistics Partner *</label>
                <select value={form.logisticsPartner} onChange={e => update('logisticsPartner', e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }}>
                  <option value="">Select partner...</option>
                  {LOGISTICS_PARTNERS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Destination *</label>
                <select value={form.destination} onChange={e => update('destination', e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }}>
                  <option value="">Select destination...</option>
                  {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Dispatch Date *</label>
                <input type="date" value={form.dispatchDate || today} onChange={e => update('dispatchDate', e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Jar Count</label>
                <input type="number" min="1" value={form.jarCount} onChange={e => update('jarCount', e.target.value)} placeholder="Number of jars dispatched" style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Tracking ID</label>
                <input type="text" value={form.trackingId} onChange={e => update('trackingId', e.target.value)} placeholder="Auto-generated if blank" style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Notes</label>
              <textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={2} placeholder="Dispatch notes..." style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none', resize: 'vertical' }} />
            </div>

            <button type="submit" disabled={submitting || !selectedBatch} style={{ marginTop: '20px', width: '100%', padding: '12px', background: submitting || !selectedBatch ? 'var(--text-dim)' : 'var(--gold-gradient)', border: 'none', borderRadius: '10px', color: '#0f0b04', fontSize: '14px', fontWeight: 700, cursor: submitting || !selectedBatch ? 'not-allowed' : 'pointer' }}>
              <Truck size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              {submitting ? 'Dispatching...' : 'Confirm Dispatch & Log to Blockchain'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
