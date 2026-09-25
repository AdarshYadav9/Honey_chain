import React from 'react';
import { Sparkles } from 'lucide-react';

const SWARM_COLOR = { Low: 'var(--emerald-400)', Medium: 'var(--amber-400)', High: '#f87171' };
const QUEEN_COLOR = {
  'Confirmed Present': 'var(--emerald-400)',
  'Uncertain': 'var(--amber-400)',
  'Possibly Absent': '#f87171',
};

export default function AIHealthSnapshot({ hive }) {
  const score = hive.healthScore ?? 85;
  const risk = hive.diseaseRisk || { varroa: 10, foulbrood: 5, nosema: 5 };
  const queen = hive.queenStatus || 'Confirmed Present';
  const swarm = hive.swarmRisk || 'Low';
  const yieldKg = hive.yieldForecastKg ?? 30;
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;
  const scoreColor = score >= 80 ? 'var(--emerald-400)' : score >= 60 ? 'var(--amber-400)' : '#f87171';

  return (
    <div className="glass-card">
      <div className="mm-cb-title mm-cb-title--row" style={{ marginBottom: '16px' }}>
        <Sparkles size={14} /> AI HEALTH &amp; RISK SNAPSHOT
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '20px', alignItems: 'center', marginBottom: '18px' }}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" stroke="var(--stroke-track)" strokeWidth="10" fill="none" />
          <circle
            cx="50" cy="50" r="42" stroke={scoreColor} strokeWidth="10" fill="none"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
          />
          <text x="50" y="55" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--text-main)">{score}</text>
        </svg>
        <div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Colony Health Index</div>
          <div className="field-hint" style={{ marginTop: '4px' }}>
            Composite of thermal stability, acoustic pattern, and weight trend.
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '16px' }}>
        <div>
          <div className="meta-label">Queen Status</div>
          <div style={{ fontSize: '13.5px', fontWeight: 600, color: QUEEN_COLOR[queen] || 'var(--text-main)' }}>{queen}</div>
        </div>
        <div>
          <div className="meta-label">Swarm Risk</div>
          <div style={{ fontSize: '13.5px', fontWeight: 600, color: SWARM_COLOR[swarm] || 'var(--text-main)' }}>{swarm}</div>
        </div>
      </div>

      <div style={{ marginBottom: '6px' }}>
        {[
          ['Varroa Mite Risk', risk.varroa],
          ['Foulbrood Risk', risk.foulbrood],
          ['Nosema Risk', risk.nosema],
        ].map(([label, val]) => (
          <div key={label} style={{ marginBottom: '10px' }}>
            <div className="flex-between" style={{ fontSize: '12.5px', marginBottom: '4px' }}>
              <span>{label}</span>
              <span className="mono" style={{ color: val > 20 ? '#f87171' : val > 10 ? 'var(--amber-400)' : 'var(--emerald-400)' }}>{val}%</span>
            </div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${Math.min(val, 100)}%`, background: val > 20 ? '#f87171' : val > 10 ? 'var(--amber-400)' : undefined }}></div></div>
          </div>
        ))}
      </div>

      <div className="notice notice-warn" style={{ marginTop: '14px' }}>
        <span style={{ fontSize: '12.5px', fontWeight: 600 }}>
          4-Week Yield Forecast: <span style={{ color: 'var(--amber-400)' }}>{yieldKg} kg</span>
        </span>
      </div>
    </div>
  );
}
