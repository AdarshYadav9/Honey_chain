import React, { useState, useEffect } from 'react';
import { History, CheckCircle2, AlertTriangle, Search } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function QualityHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetch(`${API_BASE}/api/quality/history`)
      .then(r => r.json())
      .then(data => { if (data.ok) setHistory(data.history); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = history
    .filter(h => filter === 'all' || h.result === filter.toUpperCase())
    .filter(h => !search || h.batchId.toLowerCase().includes(search.toLowerCase()) || h.beekeeper.toLowerCase().includes(search.toLowerCase()) || h.hiveId.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'date' ? (b.date || '').localeCompare(a.date || '') : sortBy === 'purity' ? (b.purity || 0) - (a.purity || 0) : (a.moisture || 0) - (b.moisture || 0));

  const stats = {
    total: history.length,
    pass: history.filter(h => h.result === 'PASS').length,
    fail: history.filter(h => h.result === 'FAIL').length,
    avgPurity: history.length ? (history.reduce((s, h) => s + (h.purity || 0), 0) / history.length).toFixed(1) : 0,
    avgMoisture: history.length ? (history.reduce((s, h) => s + (h.moisture || 0), 0) / history.length).toFixed(1) : 0,
  };

  const repeatFails = {};
  history.filter(h => h.result === 'FAIL').forEach(h => {
    repeatFails[h.beekeeper] = (repeatFails[h.beekeeper] || 0) + 1;
  });
  const flaggedBeekeepers = Object.entries(repeatFails).filter(([, count]) => count >= 2);

  return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><History size={13} /> Quality History</div>
        <h2 style={{ fontSize: '28px' }}>Batch Quality History</h2>
        <p className="section-lede">Past test results per beekeeper and cluster. Flag repeat issues.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Tested', value: stats.total, color: 'var(--text-main)' },
          { label: 'Passed', value: stats.pass, color: 'var(--emerald-400)' },
          { label: 'Failed', value: stats.fail, color: 'var(--rose-400)' },
          { label: 'Avg Purity', value: stats.avgPurity + '%', color: '#60a5fa' },
          { label: 'Avg Moisture', value: stats.avgMoisture + '%', color: 'var(--amber-400)' },
        ].map(card => (
          <div key={card.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {flaggedBeekeepers.length > 0 && (
        <div style={{ padding: '14px 18px', background: 'var(--rose-bg)', border: '1px solid var(--rose-border)', borderRadius: '12px', marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--rose-400)', marginBottom: '6px' }}>Repeat Issues Flagged</div>
          {flaggedBeekeepers.map(([name, count]) => (
            <div key={name} style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>
              {name} — {count} failed batches. Recommend re-inspection of hives.
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by batch, beekeeper, hive..." style={{ width: '100%', padding: '8px 12px 8px 32px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '12px', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['all', 'pass', 'fail'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: '999px', border: '1px solid var(--border-subtle)', background: filter === f ? 'var(--gold-gradient)' : 'transparent', color: filter === f ? '#0f0b04' : 'var(--text-dim)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>{f}</button>
          ))}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '6px 10px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '11px', outline: 'none' }}>
          <option value="date">Sort by Date</option>
          <option value="purity">Sort by Purity</option>
          <option value="moisture">Sort by Moisture</option>
        </select>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>Loading history...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>No test results found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-inset)' }}>
                {['Batch ID', 'Hive', 'Beekeeper', 'Type', 'Purity', 'Moisture', 'HMF', 'C4 Sugar', 'Result', 'Date'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--text-dim)', fontSize: '11px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(h => (
                <tr key={h.batchId} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--amber-400)' }}>{h.batchId}</td>
                  <td style={{ padding: '10px 14px' }}>{h.hiveId}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{h.beekeeper}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{h.honeyType}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{h.purity ? h.purity + '%' : '—'}</td>
                  <td style={{ padding: '10px 14px' }}>{h.moisture ? h.moisture + '%' : '—'}</td>
                  <td style={{ padding: '10px 14px' }}>{h.hmf ? h.hmf + ' mg/kg' : '—'}</td>
                  <td style={{ padding: '10px 14px' }}>{h.c4Sugar || '—'}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '999px', background: h.result === 'PASS' ? 'var(--emerald-bg)' : 'var(--rose-bg)', color: h.result === 'PASS' ? 'var(--emerald-400)' : 'var(--rose-400)', border: `1px solid ${h.result === 'PASS' ? 'var(--emerald-border)' : 'var(--rose-border)'}`, fontSize: '11px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {h.result === 'PASS' ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />} {h.result}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }}>{h.date ? new Date(h.date).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
