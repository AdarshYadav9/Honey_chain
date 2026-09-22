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
        <h2 style={{ fontSize: '28px' }}>Quality Reports</h2>
      </div>
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-dim)' }}>Loading trends...</div>
    </section>
  );

  if (!trends) return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><BarChart3 size={13} /> Quality Analytics</div>
        <h2 style={{ fontSize: '28px' }}>Quality Reports</h2>
      </div>
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-dim)' }}>No trend data available yet. Test some batches first.</div>
    </section>
  );

  const { summary, byCluster, bySeason, byMonth } = trends;

  const maxBar = Math.max(...byCluster.map(c => c.total), 1);

  return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><BarChart3 size={13} /> Quality Analytics</div>
        <h2 style={{ fontSize: '28px' }}>Quality Reports</h2>
        <p className="section-lede">Quality trends over time, by cluster and season.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total Tested', value: summary.total, color: 'var(--text-main)' },
          { label: 'Pass Rate', value: summary.passRate + '%', color: 'var(--emerald-400)' },
          { label: 'Passed', value: summary.pass, color: '#60a5fa' },
          { label: 'Failed', value: summary.fail, color: 'var(--rose-400)' },
        ].map(card => (
          <div key={card.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px', textAlign: 'center' }}>
            <div style={{ fontSize: '26px', fontWeight: 800, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>{card.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['cluster', 'season', 'monthly'].map(v => (
          <button key={v} onClick={() => setView(v)} style={{ padding: '7px 16px', borderRadius: '999px', border: '1px solid var(--border-subtle)', background: view === v ? 'var(--gold-gradient)' : 'transparent', color: view === v ? '#0f0b04' : 'var(--text-dim)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>{v}</button>
        ))}
      </div>

      {view === 'cluster' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Quality by Cluster</div>
          {byCluster.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '12px' }}>No cluster data yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {byCluster.map(c => (
                <div key={c.cluster} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {bySeason.map(s => {
            const colors = { Spring: '#60a5fa', Monsoon: 'var(--amber-400)', Winter: 'var(--emerald-400)' };
            const c = colors[s.season] || 'var(--text-main)';
            return (
              <div key={s.season} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>{s.season}</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: c }}>{s.passRate}%</div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '12px' }}>Pass Rate</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '12px' }}>
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
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-inset)' }}>
                {['Month', 'Passed', 'Failed', 'Pass Rate', 'Avg Purity', 'Avg Moisture'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-dim)', fontSize: '11px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {byMonth.map(m => (
                <tr key={m.month} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{m.month}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--emerald-400)' }}>{m.pass}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--rose-400)' }}>{m.fail}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>{m.pass || m.fail ? ((m.pass / (m.pass + m.fail)) * 100).toFixed(1) + '%' : '—'}</td>
                  <td style={{ padding: '12px 16px' }}>{m.avgPurity ? m.avgPurity + '%' : '—'}</td>
                  <td style={{ padding: '12px 16px' }}>{m.avgMoisture ? m.avgMoisture + '%' : '—'}</td>
                </tr>
              ))}
              {byMonth.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-dim)' }}>No monthly data yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
