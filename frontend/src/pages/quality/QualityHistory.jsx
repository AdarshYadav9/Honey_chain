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
        <h2>Batch Quality History</h2>
        <p className="section-lede">Past test results per beekeeper and cluster. Flag repeat issues.</p>
      </div>

      <div className="kpi-grid" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Total Tested', value: stats.total, color: 'var(--text-main)' },
          { label: 'Passed', value: stats.pass, color: 'var(--emerald-400)' },
          { label: 'Failed', value: stats.fail, color: 'var(--rose-400)' },
          { label: 'Avg Purity', value: stats.avgPurity + '%', color: '#60a5fa' },
          { label: 'Avg Moisture', value: stats.avgMoisture + '%', color: 'var(--amber-400)' },
        ].map(card => (
          <div key={card.label} className="kpi-card">
            <div className="kpi-value" style={{ color: card.color }}>{card.value}</div>
            <div className="kpi-label">{card.label}</div>
          </div>
        ))}
      </div>

      {flaggedBeekeepers.length > 0 && (
        <div className="notice notice-danger" style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>Repeat Issues Flagged</div>
          {flaggedBeekeepers.map(([name, count]) => (
            <div key={name} style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>
              {name} — {count} failed batches. Recommend re-inspection of hives.
            </div>
          ))}
        </div>
      )}

      <div className="toolbar">
        <div className="search-field">
          <Search size={14} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by batch, beekeeper, hive..." className="input" />
        </div>
        <div className="chip-group">
          {['all', 'pass', 'fail'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={'chip' + (filter === f ? ' active' : '')}>{f}</button>
          ))}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="select select-sm">
          <option value="date">Sort by Date</option>
          <option value="purity">Sort by Purity</option>
          <option value="moisture">Sort by Moisture</option>
        </select>
      </div>

      <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="state-loading">Loading history...</div>
        ) : filtered.length === 0 ? (
          <div className="state-empty">No test results found.</div>
        ) : (
          <table className="hc-table">
            <thead>
              <tr style={{ background: 'var(--bg-inset)' }}>
                {['Batch ID', 'Hive', 'Beekeeper', 'Type', 'Purity', 'Moisture', 'HMF', 'C4 Sugar', 'Result', 'Date'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(h => (
                <tr key={h.batchId}>
                  <td style={{ fontWeight: 600, color: 'var(--amber-400)' }}>{h.batchId}</td>
                  <td>{h.hiveId}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{h.beekeeper}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{h.honeyType}</td>
                  <td style={{ fontWeight: 600 }}>{h.purity ? h.purity + '%' : '—'}</td>
                  <td>{h.moisture ? h.moisture + '%' : '—'}</td>
                  <td>{h.hmf ? h.hmf + ' mg/kg' : '—'}</td>
                  <td>{h.c4Sugar || '—'}</td>
                  <td>
                    <span className="pill" style={{ background: h.result === 'PASS' ? 'var(--emerald-bg)' : 'var(--rose-bg)', color: h.result === 'PASS' ? 'var(--emerald-400)' : 'var(--rose-400)', border: `1px solid ${h.result === 'PASS' ? 'var(--emerald-border)' : 'var(--rose-border)'}` }}>
                      {h.result === 'PASS' ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />} {h.result}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-dim)' }}>{h.date ? new Date(h.date).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}