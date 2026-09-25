import React, { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function QualityReports() {
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('cluster');

  useEffect(() => {
    fetch(`${API_BASE}/api/quality/trends`)
      .then(r => r.json())
      .then(data => { if (data.ok) setTrends(data.trends); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><BarChart3 size={13} /> Quality Analytics</div>
        <h2>Quality Reports</h2>
      </div>
      <div className="state-loading">Loading trends...</div>
    </section>
  );

  if (!trends) return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><BarChart3 size={13} /> Quality Analytics</div>
        <h2>Quality Reports</h2>
      </div>
      <div className="state-empty">No trend data available yet. Test some batches first.</div>
    </section>
  );

  const { summary, byCluster, bySeason, byMonth } = trends;

  const maxBar = Math.max(...byCluster.map(c => c.total), 1);

  return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><BarChart3 size={13} /> Quality Analytics</div>
        <h2>Quality Reports</h2>
        <p className="section-lede">Quality trends over time, by cluster and season.</p>
      </div>

      <div className="kpi-grid" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Total Tested', value: summary.total, color: 'var(--text-main)' },
          { label: 'Pass Rate', value: summary.passRate + '%', color: 'var(--emerald-400)' },
          { label: 'Passed', value: summary.pass, color: '#60a5fa' },
          { label: 'Failed', value: summary.fail, color: 'var(--rose-400)' },
        ].map(card => (
          <div key={card.label} className="kpi-card">
            <div className="kpi-value" style={{ color: card.color }}>{card.value}</div>
            <div className="kpi-label">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="chip-group" style={{ marginBottom: '20px' }}>
        {['cluster', 'season', 'monthly'].map(v => (
          <button key={v} onClick={() => setView(v)} className={'chip' + (view === v ? ' active' : '')}>{v}</button>
        ))}
      </div>

      {view === 'cluster' && (
        <div className="panel">
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Quality by Cluster</div>
          {byCluster.length === 0 ? (
            <div className="state-empty">No cluster data yet.</div>
          ) : (
            <div className="flex-col gap-12">
              {byCluster.map(c => (
                <div key={c.cluster} className="flex" style={{ gap: '14px' }}>
                  <div style={{ width: '120px', fontSize: '12px', fontWeight: 600, textAlign: 'right' }}>{c.cluster}</div>
                  <div style={{ flex: 1, height: '24px', background: 'var(--bg-inset)', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ width: `${(c.pass / maxBar) * 100}%`, height: '100%', background: 'var(--emerald-400)', borderRadius: '6px', position: 'absolute' }} />
                    {c.fail > 0 && <div style={{ width: `${(c.fail / maxBar) * 100}%`, height: '100%', background: 'var(--rose-400)', borderRadius: '6px', position: 'absolute', left: `${(c.pass / maxBar) * 100}%` }} />}
                  </div>
                  <div style={{ width: '80px', fontSize: '11px', color: 'var(--text-dim)' }}>
                    <span style={{ color: 'var(--emerald-400)' }}>{c.pass} pass</span> / <span style={{ color: 'var(--rose-400)' }}>{c.fail} fail</span>
                  </div>
                  <div style={{ width: '60px', fontSize: '12px', fontWeight: 700, textAlign: 'right' }}>{c.passRate}%</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'season' && (
        <div className="grid-3">
          {bySeason.map(s => {
            const colors = { Spring: '#60a5fa', Monsoon: 'var(--amber-400)', Winter: 'var(--emerald-400)' };
            const c = colors[s.season] || 'var(--text-main)';
            return (
              <div key={s.season} className="panel" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>{s.season}</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: c }}>{s.passRate}%</div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '12px' }}>Pass Rate</div>
                <div className="flex-center" style={{ gap: '16px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--emerald-400)' }}>{s.pass} passed</span>
                  <span style={{ color: 'var(--rose-400)' }}>{s.fail} failed</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>{s.total} total batches</div>
              </div>
            );
          })}
        </div>
      )}

      {view === 'monthly' && (
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="hc-table">
            <thead>
              <tr style={{ background: 'var(--bg-inset)' }}>
                {['Month', 'Passed', 'Failed', 'Pass Rate', 'Avg Purity', 'Avg Moisture'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {byMonth.map(m => (
                <tr key={m.month}>
                  <td style={{ fontWeight: 600 }}>{m.month}</td>
                  <td style={{ color: 'var(--emerald-400)' }}>{m.pass}</td>
                  <td style={{ color: 'var(--rose-400)' }}>{m.fail}</td>
                  <td style={{ fontWeight: 700 }}>{m.pass || m.fail ? ((m.pass / (m.pass + m.fail)) * 100).toFixed(1) + '%' : '—'}</td>
                  <td>{m.avgPurity ? m.avgPurity + '%' : '—'}</td>
                  <td>{m.avgMoisture ? m.avgMoisture + '%' : '—'}</td>
                </tr>
              ))}
              {byMonth.length === 0 && (
                <tr><td colSpan={6} className="state-empty">No monthly data yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}