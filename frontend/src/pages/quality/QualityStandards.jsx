import React, { useState, useEffect } from 'react';
import { BookOpen, Save, Lock, Edit3 } from 'lucide-react';

const API_BASE = window.location.hostname !== 'localhost' ? '' : 'http://localhost:4000';

export default function QualityStandards() {
  const [standards, setStandards] = useState({});
  const [editing, setEditing] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/quality/standards`)
      .then(r => r.json())
      .then(data => { if (data.ok) setStandards(data.standards); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (key) => {
    try {
      await fetch(`${API_BASE}/api/quality/standards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, ...standards[key] }),
      });
      setSaved(true);
      setEditing(null);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {}
  };

  const updateField = (key, field, value) => {
    setStandards(s => ({ ...s, [key]: { ...s[key], [field]: value } }));
  };

  return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><BookOpen size={13} /> Reference Standards</div>
        <h2 style={{ fontSize: '28px' }}>Quality Standards &amp; Thresholds</h2>
        <p className="section-lede">Testing criteria for honey quality certification. Admin-editable, officer read-only by default.</p>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-dim)' }}>Loading standards...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {Object.entries(standards).map(([key, std]) => {
            const isEditing = editing === key;
            const fieldStyle = { width: '100%', padding: '6px 10px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-main)', fontSize: '12px', outline: 'none' };

            return (
              <div key={key} style={{ background: 'var(--bg-card)', border: `1px solid ${isEditing ? 'var(--amber-400)' : 'var(--border-subtle)'}`, borderRadius: '14px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--amber-400)' }}>{std.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Version: {std.version}</div>
                  </div>
                  <button onClick={() => isEditing ? handleSave(key) : setEditing(key)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', background: isEditing ? 'var(--emerald-400)' : 'var(--bg-inset)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: isEditing ? '#0f0b04' : 'var(--text-muted)', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
                    {isEditing ? <><Save size={11} /> Save</> : <><Edit3 size={11} /> Edit</>}
                  </button>
                </div>

                <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', marginBottom: '14px', lineHeight: 1.4 }}>{std.description}</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { field: 'moistureMax', label: 'Moisture Max', unit: '%', icon: '💧' },
                    { field: 'nmrPurityMin', label: 'NMR Purity Min', unit: '%', icon: '🔬' },
                    { field: 'c4SugarMax', label: 'C4 Sugar Max', unit: '%', icon: '🧪' },
                    { field: 'hmfMax', label: 'HMF Max', unit: 'mg/kg', icon: '📊' },
                    { field: 'antibioticMax', label: 'Antibiotic Max', unit: 'ppm', icon: '💊' },
                  ].map(item => (
                    <div key={item.field} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.icon} {item.label}</span>
                      {isEditing ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input type="number" step="0.1" value={std[item.field]} onChange={e => updateField(key, item.field, parseFloat(e.target.value))} style={{ ...fieldStyle, width: '70px', textAlign: 'right' }} />
                          <span style={{ fontSize: '10px', color: 'var(--text-dim)', minWidth: '36px' }}>{item.unit}</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', fontWeight: 700 }}>{std[item.field]} {item.unit}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {saved && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', padding: '12px 20px', background: 'var(--emerald-400)', color: '#0f0b04', borderRadius: '8px', fontWeight: 700, fontSize: '13px', zIndex: 9999 }}>
          Standards saved successfully
        </div>
      )}
    </section>
  );
}
