import React, { useState, useEffect } from 'react';
import { Archive, Search, QrCode, Truck, Download, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const API_BASE = window.location.hostname !== 'localhost' ? '' : 'http://localhost:4000';

const STATUS_STYLES = {
  PACKAGED: { bg: 'var(--emerald-bg)', color: 'var(--emerald-400)', border: 'var(--emerald-border)', label: 'Packaged', icon: <QrCode size={12} /> },
  DISPATCHED: { bg: 'rgba(96, 165, 250, 0.12)', color: '#60a5fa', border: 'rgba(96, 165, 250, 0.3)', label: 'Dispatched', icon: <Truck size={12} /> },
};

export default function Inventory() {
  const { switchView, setBatchIdInput } = useApp();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [qrModal, setQrModal] = useState(null);
  const [qrLoading, setQrLoading] = useState(null);

  const fetchInventory = () => {
    setLoading(true);
    fetch(`${API_BASE}/api/inventory`)
      .then(r => r.json())
      .then(data => { if (data.ok) setInventory(data.inventory); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInventory(); }, []);

  const filtered = inventory
    .filter(i => filter === 'all' || i.status === filter)
    .filter(i => !search || i.id.toLowerCase().includes(search.toLowerCase()) || i.honeyType.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    total: inventory.length,
    packaged: inventory.filter(i => i.status === 'PACKAGED').length,
    dispatched: inventory.filter(i => i.status === 'DISPATCHED').length,
    totalKg: inventory.reduce((s, i) => s + (i.quantity || 0), 0),
  };

  const handleGenerateQR = async (batchId) => {
    setQrLoading(batchId);
    try {
      const res = await fetch(`${API_BASE}/api/qr/${batchId}`);
      const data = await res.json();
      if (data.ok) {
        setQrModal({ batchId, dataUrl: data.dataUrl, url: data.verificationUrl });
      }
    } catch (e) {
      console.error('QR generation failed', e);
    } finally {
      setQrLoading(null);
    }
  };

  const handleDownloadQR = (batchId, dataUrl) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `QR_${batchId}.png`;
    link.click();
  };

  return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><Archive size={13} /> Inventory</div>
        <h2 style={{ fontSize: '28px' }}>Packaged Inventory</h2>
        <p className="section-lede">Packaged batches ready for distribution. Generate QR codes for consumer verification.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Items', value: stats.total, color: 'var(--text-main)' },
          { label: 'Packaged', value: stats.packaged, color: 'var(--emerald-400)' },
          { label: 'Dispatched', value: stats.dispatched, color: '#60a5fa' },
          { label: 'Total Kg', value: stats.totalKg.toFixed(1), color: 'var(--amber-400)' },
        ].map(card => (
          <div key={card.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>{card.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by batch ID or type..." style={{ width: '100%', padding: '8px 12px 8px 32px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '12px', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['all', 'PACKAGED', 'DISPATCHED'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: '999px', border: '1px solid var(--border-subtle)', background: filter === f ? 'var(--gold-gradient)' : 'transparent', color: filter === f ? '#0f0b04' : 'var(--text-dim)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', textTransform: f === 'all' ? 'none' : 'capitalize' }}>{f === 'all' ? 'All' : f.toLowerCase()}</button>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>Loading inventory...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>No inventory items found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', minWidth: '700px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-inset)' }}>
                  {['Batch ID', 'Honey Type', 'Qty', 'Beekeeper', 'Status', 'QR Code', ''].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--text-dim)', fontSize: '11px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => {
                  const st = STATUS_STYLES[item.status] || STATUS_STYLES.PACKAGED;
                  return (
                    <tr key={item.id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--amber-400)' }}>{item.id}</td>
                      <td style={{ padding: '10px 14px' }}>{item.honeyType}</td>
                      <td style={{ padding: '10px 14px' }}>{item.quantity} kg</td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{item.beekeeper}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '999px', background: st.bg, color: st.color, border: `1px solid ${st.border}`, fontSize: '11px', fontWeight: 600 }}>
                          {st.icon} {st.label}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <button
                          onClick={() => handleGenerateQR(item.id)}
                          disabled={qrLoading === item.id}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            padding: '5px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)',
                            background: qrLoading === item.id ? 'var(--bg-inset)' : 'var(--emerald-bg)',
                            color: qrLoading === item.id ? 'var(--text-dim)' : 'var(--emerald-400)',
                            cursor: qrLoading === item.id ? 'wait' : 'pointer',
                            fontSize: '11px', fontWeight: 600,
                          }}
                        >
                          <QrCode size={12} />
                          {qrLoading === item.id ? 'Generating...' : 'Generate QR'}
                        </button>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <button onClick={() => { setBatchIdInput(item.id); switchView('chain'); }} style={{ padding: '5px 10px', background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--amber-400)', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
                          Trace →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {qrModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }} onClick={() => setQrModal(null)}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '28px', maxWidth: '400px', width: '100%', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: 700 }}>QR Code</span>
              <button onClick={() => setQrModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>Batch: <strong style={{ color: 'var(--amber-400)' }}>{qrModal.batchId}</strong></div>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', display: 'inline-block', marginBottom: '16px' }}>
              <img src={qrModal.dataUrl} alt={`QR for ${qrModal.batchId}`} style={{ width: '220px', height: '220px' }} />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '16px', wordBreak: 'break-all' }}>
              {qrModal.url}
            </div>
            <button onClick={() => handleDownloadQR(qrModal.batchId, qrModal.dataUrl)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 24px', background: 'var(--gold-gradient)', border: 'none', borderRadius: '8px', color: '#0f0b04', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
              <Download size={14} /> Download QR Code
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
