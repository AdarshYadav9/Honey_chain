import React, { useMemo } from 'react';
import { renderAxisChart } from '../../utils/charts';

const RANGES = [
  { key: '24H', points: 24, label: '24H' },
  { key: '7D', points: 7, label: '7D' },
  { key: '30D', points: 30, label: '30D' },
];

function buildSeries(base, points, driftPerStep) {
  return Array.from({ length: points }, (_, i) =>
    base + i * driftPerStep + Math.sin(i / 3) * (driftPerStep === 0 ? 0.6 : 0.3) + (Math.random() - 0.5) * 0.4
  );
}

export default function TrendsPanel({ hive, range, onChangeRange }) {
  const activeRange = RANGES.find(r => r.key === range) || RANGES[0];

  const tempSeries = useMemo(
    () => buildSeries((hive.temp ?? 34) - 0.8, activeRange.points, 0.03),
    [hive.temp, activeRange.points]
  );
  const weightSeries = useMemo(
    () => buildSeries((hive.wt ?? 30) - 1.5, activeRange.points, activeRange.points > 1 ? 1.5 / (activeRange.points - 1) : 0),
    [hive.wt, activeRange.points]
  );

  const tempMin = Math.min(...tempSeries);
  const tempMax = Math.max(...tempSeries);
  const wtMin = Math.min(...weightSeries);
  const wtMax = Math.max(...weightSeries);

  const seasonal = { thisYear: (hive.yieldForecastKg ?? 30) * 0.92, lastYear: (hive.yieldForecastKg ?? 30) * 0.78 };
  const seasonalMax = Math.max(seasonal.thisYear, seasonal.lastYear) * 1.2;
  const pctChange = ((seasonal.thisYear - seasonal.lastYear) / seasonal.lastYear * 100).toFixed(0);

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div className="mm-cb-title" style={{ margin: 0 }}>TRENDS &amp; HISTORY</div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {RANGES.map(r => (
            <button key={r.key} className={`chart-toggle ${range === r.key ? 'active' : ''}`} onClick={() => onChangeRange(r.key)}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mm-charts-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Temperature Chart */}
        <div className="mm-chart-box" style={{ border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div className="mm-cb-title" style={{ margin: 0 }}>Temperature ({activeRange.label})</div>
            <div className="mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--amber-400)' }}>
              {tempMax.toFixed(1)}°C
            </div>
          </div>
          <svg viewBox="0 0 320 110" width="100%" height="110">
            {renderAxisChart(tempSeries, 'var(--amber-400)', 'var(--amber-500)', '°C')}
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10.5px', color: 'var(--text-dim)' }}>
            <span>Min: {tempMin.toFixed(1)}°C</span>
            <span>Avg: {(tempSeries.reduce((a, b) => a + b, 0) / tempSeries.length).toFixed(1)}°C</span>
            <span>Max: {tempMax.toFixed(1)}°C</span>
          </div>
        </div>

        {/* Weight Chart */}
        <div className="mm-chart-box" style={{ border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div className="mm-cb-title" style={{ margin: 0 }}>Weight ({activeRange.label})</div>
            <div className="mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--emerald-400)' }}>
              {wtMax.toFixed(1)} kg
            </div>
          </div>
          <svg viewBox="0 0 320 110" width="100%" height="110">
            {renderAxisChart(weightSeries, 'var(--emerald-400)', 'var(--emerald-400)', ' kg')}
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10.5px', color: 'var(--text-dim)' }}>
            <span>Min: {wtMin.toFixed(1)} kg</span>
            <span>Avg: {(weightSeries.reduce((a, b) => a + b, 0) / weightSeries.length).toFixed(1)} kg</span>
            <span>Max: {wtMax.toFixed(1)} kg</span>
          </div>
        </div>
      </div>

      {/* Seasonal Comparison */}
      <div style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="mm-cb-title" style={{ marginBottom: '14px' }}>SEASONAL COMPARISON — PROJECTED YIELD</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '36px', padding: '0 12px' }}>
          {/* Last Year Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div className="mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>
              {seasonal.lastYear.toFixed(1)} kg
            </div>
            <div style={{
              width: '48px',
              height: `${(seasonal.lastYear / seasonalMax) * 100}px`,
              background: 'linear-gradient(180deg, rgba(148,163,184,0.4) 0%, rgba(148,163,184,0.15) 100%)',
              border: '1px solid rgba(148,163,184,0.3)',
              borderRadius: '6px 6px 0 0',
              minHeight: '20px',
            }} />
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Last Year</div>
          </div>

          {/* This Year Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div className="mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--amber-400)' }}>
              {seasonal.thisYear.toFixed(1)} kg
            </div>
            <div style={{
              width: '48px',
              height: `${(seasonal.thisYear / seasonalMax) * 100}px`,
              background: 'var(--gold-gradient)',
              border: '1px solid var(--border-highlight)',
              borderRadius: '6px 6px 0 0',
              boxShadow: '0 4px 12px rgba(245,158,11,0.2)',
              minHeight: '20px',
            }} />
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>This Year</div>
          </div>

          {/* Change Badge */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            paddingBottom: '30px',
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              background: seasonal.thisYear >= seasonal.lastYear ? 'var(--emerald-bg)' : 'var(--rose-bg)',
              border: `1px solid ${seasonal.thisYear >= seasonal.lastYear ? 'var(--emerald-border)' : 'var(--rose-border)'}`,
              color: seasonal.thisYear >= seasonal.lastYear ? 'var(--emerald-400)' : '#f87171',
              fontWeight: 700,
              fontSize: '14px',
            }}>
              {seasonal.thisYear >= seasonal.lastYear ? '↑' : '↓'} {pctChange}%
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>vs last year</div>
          </div>
        </div>
      </div>
    </div>
  );
}
