import React, { useState, useEffect } from 'react';
import { FlaskConical, CheckCircle2, AlertTriangle, Upload, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const API_BASE = window.location.hostname !== 'localhost' ? '' : 'http://localhost:4000';

export default function QualityTestForm() {
  const { sharedBatches, switchView, showNotification } = useApp();
  const [selectedBatch, setSelectedBatch] = useState(window.__testingBatchId || '');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [certificateName, setCertificateName] = useState('');

  const [form, setForm] = useState({
    labName: '',
    moisturePercent: '17.5',
    nmrPurityScore: '99.2',
    c4SugarAdulteration: 'NEGATIVE',
    hmf: '14.0',
    pollenDominance: '',
    antibioticResidues: 'NOT DETECTED',
  });

  const readyForTest = sharedBatches.filter(b => b.status === 'HARVEST_VERIFIED' || b.status === 'REJECTED');

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBatch) return;
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/quality-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId: selectedBatch, ...form }),
      });
      const data = await res.json();
      if (data.ok) {
        setResult(data.batch);
        setSubmitted(true);
        showNotification(`Quality test submitted for ${selectedBatch}`);
      }
    } catch (err) {
      setResult({ status: 'ERROR', id: selectedBatch });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const isPass = result?.status === 'CERTIFIED';
  const validations = result?.smartContractValidations || {};
  const selectedBatchData = sharedBatches.find(b => b.id === selectedBatch);

  return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><FlaskConical size={13} /> Lab Test Submission</div>
        <h2 style={{ fontSize: '28px' }}>Submit Quality Test</h2>
        <p className="section-lede">Enter purity, moisture, adulteration results and upload lab certificate.</p>
      </div>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: isPass ? 'var(--emerald-bg)' : 'var(--rose-bg)', border: `2px solid ${isPass ? 'var(--emerald-border)' : 'var(--rose-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            {isPass ? <CheckCircle2 size={32} color="var(--emerald-400)" /> : <AlertTriangle size={32} color="var(--rose-400)" />}
          </div>
          <h3 style={{ fontSize: '20px', color: isPass ? 'var(--emerald-400)' : 'var(--rose-400)', marginBottom: '6px' }}>
            {isPass ? 'Batch Certified' : 'Batch Rejected'}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            {selectedBatch}
          </p>

          {!isPass && Object.keys(validations).length > 0 && (
            <div style={{ maxWidth: '420px', margin: '0 auto 24px', textAlign: 'left', background: 'var(--bg-card)', border: '1px solid var(--rose-border)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--rose-400)', marginBottom: '10px' }}>Smart Contract Validation Results</div>
              {Object.entries(validations).map(([key, val]) => {
                const passed = String(val).startsWith('PASS');
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: passed ? 'var(--emerald-400)' : 'var(--rose-400)', fontSize: '13px', fontWeight: 700 }}>{passed ? '✓' : '✗'}</span>
                    <span style={{ fontSize: '12px' }}>{val}</span>
                  </div>
                );
              })}
            </div>
          )}

          {isPass && result?.qualityTest && (
            <div style={{ maxWidth: '420px', margin: '0 auto 24px', textAlign: 'left', background: 'var(--bg-card)', border: '1px solid var(--emerald-border)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--emerald-400)', marginBottom: '10px' }}>Quality Test Summary</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                <div>NMR Purity: <strong>{result.qualityTest.nmrPurityScore}%</strong></div>
                <div>Moisture: <strong>{result.qualityTest.moisturePercent}%</strong></div>
                <div>HMF: <strong>{result.qualityTest.hmf} mg/kg</strong></div>
                <div>C4 Sugar: <strong>{result.qualityTest.c4SugarAdulteration}</strong></div>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => switchView('quality')} style={{ padding: '10px 20px', background: 'var(--gold-gradient)', border: 'none', borderRadius: '8px', color: '#0f0b04', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
              Back to Queue <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
            </button>
            <button onClick={() => { setSubmitted(false); setResult(null); setCertificateName(''); }} style={{ padding: '10px 20px', background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px' }}>
              Test Another Batch
            </button>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '760px' }}>
          <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Select Batch *</label>
              <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }}>
                <option value="">Choose a batch ready for lab testing...</option>
                {readyForTest.map(b => (
                  <option key={b.id} value={b.id}>{b.id} — {b.hiveId} — {b.honeyType} — {b.quantity}kg</option>
                ))}
              </select>
              {readyForTest.length === 0 && (
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '6px' }}>No batches ready for testing. Approve harvests first from the Queue.</div>
              )}
            </div>

            {selectedBatchData && (
              <div style={{ padding: '12px', background: 'var(--bg-inset)', borderRadius: '8px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '12px' }}>
                <div><span style={{ color: 'var(--text-dim)' }}>Hive: </span><strong>{selectedBatchData.hiveId}</strong></div>
                <div><span style={{ color: 'var(--text-dim)' }}>Type: </span><strong>{selectedBatchData.honeyType}</strong></div>
                <div><span style={{ color: 'var(--text-dim)' }}>Qty: </span><strong>{selectedBatchData.quantity}kg</strong></div>
                <div><span style={{ color: 'var(--text-dim)' }}>Beekeeper: </span><strong>{selectedBatchData.beekeeper || 'Unknown'}</strong></div>
              </div>
            )}

            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '14px', color: 'var(--amber-400)' }}>Lab Test Results</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Lab Name *</label>
                <input type="text" value={form.labName} onChange={e => update('labName', e.target.value)} placeholder="e.g. NBL FSSAI Accredited Lab" required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>NMR Purity Score (%) *</label>
                <input type="number" step="0.1" min="0" max="100" value={form.nmrPurityScore} onChange={e => update('nmrPurityScore', e.target.value)} placeholder="e.g. 99.2" required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
                <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>{'Pass: >= 98.0% (FSSAI)'}</div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Moisture Content (%) *</label>
                <input type="number" step="0.1" min="0" max="40" value={form.moisturePercent} onChange={e => update('moisturePercent', e.target.value)} placeholder="e.g. 17.5" required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
                <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>{'Pass: <= 20.0% (FSSAI)'}</div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>HMF Level (mg/kg) *</label>
                <input type="number" step="0.1" min="0" value={form.hmf} onChange={e => update('hmf', e.target.value)} placeholder="e.g. 14.2" required style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
                <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>{'Pass: < 40 mg/kg (FSSAI)'}</div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>C4 Sugar Adulteration *</label>
                <select value={form.c4SugarAdulteration} onChange={e => update('c4SugarAdulteration', e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }}>
                  <option value="NEGATIVE">NEGATIVE (No adulteration)</option>
                  <option value="POSITIVE">POSITIVE (Adulteration detected)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Pollen Dominance</label>
                <input type="text" value={form.pollenDominance} onChange={e => update('pollenDominance', e.target.value)} placeholder="e.g. 84% Litchi Pollen" style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Antibiotic Residues</label>
                <select value={form.antibioticResidues} onChange={e => update('antibioticResidues', e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }}>
                  <option value="NOT DETECTED">NOT DETECTED (0.0 ppm)</option>
                  <option value="DETECTED">DETECTED (Above threshold)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Upload Certificate</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'var(--bg-input)', border: '1px dashed var(--border-subtle)', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <Upload size={14} />
                  {certificateName || 'Choose PDF/image...'}
                  <input type="file" accept=".pdf,.jpg,.png" onChange={e => setCertificateName(e.target.files?.[0]?.name || '')} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            <button type="submit" disabled={submitting || !selectedBatch} style={{ marginTop: '20px', width: '100%', padding: '12px', background: submitting || !selectedBatch ? 'var(--text-dim)' : 'var(--gold-gradient)', border: 'none', borderRadius: '10px', color: '#0f0b04', fontSize: '14px', fontWeight: 700, cursor: submitting || !selectedBatch ? 'not-allowed' : 'pointer' }}>
              <FlaskConical size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              {submitting ? 'Submitting Test...' : 'Submit Quality Test & Run Smart Contract Validation'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
