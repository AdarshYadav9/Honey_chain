import React, { useMemo } from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, Activity, TrendingUp, Shield, Brain, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { YieldForecastPaths } from '../utils/charts';

function getScoreColor(score) {
  if (score >= 80) return 'var(--emerald-400)';
  if (score >= 60) return 'var(--amber-400)';
  return '#f87171';
}

function getScoreLabel(score) {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Critical';
}

function getRiskColor(val) {
  if (val > 25) return '#f87171';
  if (val > 12) return 'var(--amber-400)';
  return 'var(--emerald-400)';
}

function getRiskLevel(val) {
  if (val > 25) return 'High';
  if (val > 12) return 'Medium';
  return 'Low';
}

function detectAnomalies(hive) {
  const anomalies = [];
  const temp = hive.temp ?? 34;
  const hum = hive.hum ?? 60;
  const wt = hive.wt ?? 30;
  const batt = hive.batt ?? 80;
  const co2 = hive.co2 ?? 500;
  const act = hive.act || '';

  // Weight drop anomaly — possible swarming or theft
  if (typeof hive.wtDelta === 'string' && hive.wtDelta.trim().startsWith('-')) {
    anomalies.push({
      type: 'WARNING',
      icon: '⚠',
      title: 'Sudden Weight Drop Detected',
      detail: `Hive weight decreased by ${hive.wtDelta} in the last 24h. This pattern is consistent with either natural swarming (colony departure) or potential robbing/theft.`,
      action: 'Inspect within 24 hrs. Check for queen cells, reduced bee population, or signs of robbery (fighting at entrance).',
      signals: [`Weight delta: ${hive.wtDelta}`, `Current weight: ${wt.toFixed(1)} kg`],
    });
  }

  // Temperature spike — possible queen loss
  if (temp > 36.5) {
    anomalies.push({
      type: 'WARNING',
      icon: '🌡',
      title: 'Elevated Brood Temperature',
      detail: `Internal temperature at ${temp.toFixed(1)}°C exceeds the optimal 34–35°C brood range. Sustained high temperature may indicate queenlessness (bees加热 the brood area differently without queen pheromone).`,
      action: 'Check for queen cells and brood pattern. If no eggs/larvae seen, re-queen the colony within 7 days.',
      signals: [`Temp: ${temp.toFixed(1)}°C (threshold: 36.5°C)`, `Acoustic: ${act}`],
    });
  }

  // Temperature too low
  if (temp < 32) {
    anomalies.push({
      type: 'WARNING',
      icon: '❄',
      title: 'Brood Chilling Risk',
      detail: `Internal temperature at ${temp.toFixed(1)}°C is below the safe brood range. Chilled brood can cause developmental deformities or colony loss.`,
      action: 'Verify hive insulation. Ensure entrance is not fully open during cold nights. Check cluster size.',
      signals: [`Temp: ${temp.toFixed(1)}°C (minimum safe: 32°C)`],
    });
  }

  // Humidity out of range
  if (hum > 70 || hum < 45) {
    anomalies.push({
      type: hum > 70 ? 'WARNING' : 'INFO',
      icon: '💧',
      title: hum > 70 ? 'High Humidity — Moisture Risk' : 'Low Humidity — Dehydration Risk',
      detail: hum > 70
        ? `Humidity at ${hum.toFixed(0)}% exceeds the 45–70% optimal range. Excess moisture promotes fungal growth and chills brood.`
        : `Humidity at ${hum.toFixed(0)}% is below optimal. Dry conditions can dehydrate pollen stores and stress the colony.`,
      action: hum > 70
        ? 'Check for water ingress. Add or tilt moisture board. Improve ventilation by widening the entrance.'
        : 'Provide water source nearby. Check if nearby water sources have dried up.',
      signals: [`Humidity: ${hum.toFixed(0)}% (optimal: 45–70%)`],
    });
  }

  // Low battery — sensor going offline
  if (batt < 25) {
    anomalies.push({
      type: batt < 15 ? 'CRITICAL' : 'WARNING',
      icon: '🔋',
      title: `Battery Critical — ${Math.round(batt)}%`,
      detail: 'IoT sensor node battery is nearly depleted. Data stream will stop once battery dies, creating a monitoring blind spot.',
      action: 'Schedule battery swap on next apiary visit. Solar panel may need cleaning if applicable.',
      signals: [`Battery: ${Math.round(batt)}%`, `Last sync: ${hive.lastSyncSec ?? 'unknown'}s ago`],
    });
  }

  // High CO2 — poor ventilation
  if (co2 > 800) {
    anomalies.push({
      type: 'INFO',
      icon: '💨',
      title: 'Elevated CO₂ — Ventilation Needed',
      detail: `CO₂ at ${co2} ppm suggests overcrowding or insufficient airflow. High CO₂ during winter can be normal (cluster sealed), but in active season it indicates need for more space.`,
      action: 'Consider adding a super. Widen entrance or add upper ventilation.',
      signals: [`CO₂: ${co2} ppm (normal: <800)`],
    });
  }

  // Swarm risk
  if (hive.swarmRisk === 'High' || hive.swarmRisk === 'Medium') {
    anomalies.push({
      type: hive.swarmRisk === 'High' ? 'CRITICAL' : 'WARNING',
      icon: '🐝',
      title: `Swarm Risk: ${hive.swarmRisk}`,
      detail: hive.swarmRisk === 'High'
        ? 'Colony is likely preparing to swarm. Queen cells are probably present. Swarm departure can lose 50%+ of the workforce.'
        : 'Environmental conditions and acoustic patterns suggest early swarm preparation. Monitor closely.',
      action: 'Inspect for queen cells immediately. Perform a split or add a brood box. Clip the queen if appropriate.',
      signals: [`Swarm risk: ${hive.swarmRisk}`, `Queen status: ${hive.queenStatus || 'Unknown'}`],
    });
  }

  // Acoustic anomaly
  if (act.includes('Elevated') || act.includes('430') || act.includes('420')) {
    anomalies.push({
      type: 'WARNING',
      icon: '🔊',
      title: 'Abnormal Acoustic Frequency',
      detail: 'Acoustic frequency above 400Hz indicates stress piping or pre-swarm queen communication. Normal worker buzz is 200–280Hz.',
      action: 'Cross-reference with weight trend. If weight is also dropping, swarm is imminent.',
      signals: [`Acoustic: ${act}`, 'Normal range: 200–280Hz'],
    });
  }

  return anomalies;
}

function getActions(anomalies, hive) {
  const actions = [];

  if (anomalies.length === 0) {
    actions.push({
      priority: 'LOW',
      text: 'Continue regular 6-day inspection cycle. No intervention required.',
      timeframe: 'Routine',
    });
  }

  if (anomalies.some(a => a.title.includes('Swarm'))) {
    actions.push({ priority: 'HIGH', text: 'Inspect for queen cells and perform colony split if found.', timeframe: 'Within 24 hrs' });
  }
  if (anomalies.some(a => a.title.includes('Temperature') || a.title.includes('Chilling'))) {
    actions.push({ priority: 'HIGH', text: 'Verify queen presence by checking for eggs and young larvae.', timeframe: 'Within 48 hrs' });
  }
  if (anomalies.some(a => a.title.includes('Weight Drop'))) {
    actions.push({ priority: 'MEDIUM', text: 'Perform entrance inspection for signs of robbing (fighting bees, wet cappings).', timeframe: 'Within 24 hrs' });
  }
  if (anomalies.some(a => a.title.includes('Humidity'))) {
    actions.push({ priority: 'MEDIUM', text: 'Add moisture board or improve hive ventilation.', timeframe: 'Within 48 hrs' });
  }
  if (anomalies.some(a => a.title.includes('Battery'))) {
    actions.push({ priority: 'MEDIUM', text: 'Replace sensor node battery on next apiary visit.', timeframe: 'Within 3 days' });
  }
  if (anomalies.some(a => a.title.includes('CO₂'))) {
    actions.push({ priority: 'LOW', text: 'Add a super or widen entrance for better airflow.', timeframe: 'Within 1 week' });
  }

  if (hive.diseaseRisk) {
    if (hive.diseaseRisk.varroa > 20) {
      actions.push({ priority: 'HIGH', text: 'Apply Varroa treatment (oxalic acid vaporization or Apivar strips).', timeframe: 'Immediately' });
    }
    if (hive.diseaseRisk.foulbrood > 15) {
      actions.push({ priority: 'HIGH', text: 'Send sample to lab for AFB/EFB confirmation. Isolate hive if suspected.', timeframe: 'Immediately' });
    }
    if (hive.diseaseRisk.nosema > 15) {
      actions.push({ priority: 'MEDIUM', text: 'Consider Fumagillin treatment. Check for dysentery signs at entrance.', timeframe: 'Within 1 week' });
    }
  }

  return actions;
}

export default function AIInsights() {
  const { activeHive, curHive } = useApp();
  const hive = curHive;
  const score = hive.healthScore ?? 85;
  const risk = hive.diseaseRisk || { varroa: 8, foulbrood: 3, nosema: 5 };
  const yieldKg = hive.yieldForecastKg ?? 30;
  const circumference = 2 * Math.PI * 50;
  const offset = circumference - (score / 100) * circumference;
  const scoreColor = getScoreColor(score);

  const anomalies = useMemo(() => detectAnomalies(hive), [hive]);
  const actions = useMemo(() => getActions(anomalies, hive), [anomalies, hive]);

  const totalRisk = risk.varroa + risk.foulbrood + risk.nosema;

  // Confidence calculation based on data availability
  const dataPoints = [
    hive.temp != null, hive.hum != null, hive.wt != null,
    hive.batt != null, hive.co2 != null, hive.act != null,
  ].filter(Boolean).length;
  const confidence = Math.min(95, 60 + dataPoints * 6);

  return (
    <section className="view-pane active" id="view-ai">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><Sparkles size={13} /> Machine Learning Disease &amp; Yield Engine</div>
        <h2>AI Colony Diagnostics &amp; Harvest Forecast</h2>
        <p className="section-lede">
          Fuses real-time acoustic frequency harmonics, brood temperature variance, weight trends, and environmental data to identify diseases early, detect anomalies, and forecast honey extraction volume.
        </p>
      </div>

      {/* Active Hive Indicator */}
      <div className="glass-card flex gap-12" style={{ padding: '12px 18px', marginBottom: '24px', width: 'fit-content' }}>
        <Activity size={16} color="var(--amber-400)" />
        <span style={{ fontSize: '13px', fontWeight: 600 }}>Analyzing:</span>
        <span className="mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--amber-400)' }}>{activeHive}</span>
        <span className="muted">• {hive.loc || 'Location TBD'}</span>
      </div>

      <div className="ai-dual-col">
        {/* LEFT COLUMN — Colony Health + Disease Risk */}
        <div className="flex-col gap-20">
          {/* Colony Health Score */}
          <div className="glass-card">
            <h3 className="section-title" style={{ marginTop: 0 }}>
              <Shield size={16} color={scoreColor} />
              COLONY HEALTH INDEX
            </h3>

            <div className="score-hero-row">
              <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" stroke="var(--stroke-track)" strokeWidth="10" fill="none" />
                  <circle
                    cx="60" cy="60" r="50"
                    stroke={scoreColor} strokeWidth="10" fill="none"
                    strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                  />
                </svg>
                <div className="flex-col flex-center" style={{ position: 'absolute', inset: 0 }}>
                  <div className="mono" style={{ fontSize: '28px', fontWeight: 700, color: scoreColor, lineHeight: 1 }}>{score}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>/100</div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: scoreColor, marginBottom: '4px' }}>{getScoreLabel(score)}</div>
                <div className="muted">
                  Composite index derived from three weighted signals:
                </div>
                <div className="flex-col mt-8" style={{ gap: '4px' }}>
                  <div className="flex gap-6 field-hint">
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--amber-400)', flexShrink: 0 }}></span>
                    <span>Thermal stability (35%) — brood temp consistency</span>
                  </div>
                  <div className="flex gap-6 field-hint">
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--emerald-400)', flexShrink: 0 }}></span>
                    <span>Weight trend (35%) — nectar flow & stores</span>
                  </div>
                  <div className="flex gap-6 field-hint">
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa', flexShrink: 0 }}></span>
                    <span>Acoustic harmonics (30%) — colony stress pattern</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Queen & Swarm Status */}
            <div className="grid-2 mt-16 notice">
              <div>
                <div className="kpi-label">Queen Status</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: hive.queenStatus === 'Confirmed Present' ? 'var(--emerald-400)' : hive.queenStatus === 'Uncertain' ? 'var(--amber-400)' : '#f87171' }}>
                  {hive.queenStatus || 'Unknown'}
                </div>
              </div>
              <div>
                <div className="kpi-label">Swarm Risk</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: hive.swarmRisk === 'Low' ? 'var(--emerald-400)' : hive.swarmRisk === 'Medium' ? 'var(--amber-400)' : '#f87171' }}>
                  {hive.swarmRisk || 'Low'}
                </div>
              </div>
            </div>
          </div>

          {/* Disease / Pest Risk Panel */}
          <div className="glass-card">
            <h3 className="section-title" style={{ marginTop: 0 }}>
              <AlertTriangle size={16} color={totalRisk > 40 ? '#f87171' : totalRisk > 20 ? 'var(--amber-400)' : 'var(--emerald-400)'} />
              DISEASE &amp; PEST RISK
            </h3>

            {[
              { label: 'Varroa Mite (Varroa destructor)', val: risk.varroa, signal: 'Acoustic frequency anomaly + brood pattern', icon: '🔴' },
              { label: 'Foulbrood (AFB/EFB)', val: risk.foulbrood, signal: 'Odor analysis + hive weight irregularity', icon: '🟠' },
              { label: 'Nosema (N. ceranae)', val: risk.nosema, signal: 'Activity index + seasonal湿度 model', icon: '🟡' },
            ].map(d => (
              <div key={d.label} style={{ marginBottom: '16px' }}>
                <div className="flex-between" style={{ marginBottom: '6px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{d.icon} {d.label}</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', marginTop: '2px' }}>Signal: {d.signal}</div>
                  </div>
                  <div className="flex gap-8">
                    <span className="mono" style={{ fontSize: '14px', fontWeight: 700, color: getRiskColor(d.val) }}>{d.val}%</span>
                    <span className="pill pill-sm" style={{
                      background: d.val > 25 ? 'rgba(248,113,113,0.12)' : d.val > 12 ? 'rgba(251,191,36,0.12)' : 'rgba(52,211,153,0.12)',
                      color: getRiskColor(d.val),
                    }}>{getRiskLevel(d.val)}</span>
                  </div>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{
                    width: `${Math.min(d.val, 100)}%`,
                    background: getRiskColor(d.val),
                  }}></div>
                </div>
              </div>
            ))}

            <div className="notice notice-info mt-8">
              <strong>Methodology:</strong> Risk scores combine sensor-derived signals (acoustic frequency harmonics, weight volatility, temperature variance) with seasonal epidemiological models trained on regional apiary health data. Scores update every telemetry cycle (~3 min).
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Yield Forecast + Anomalies + Actions */}
        <div className="flex-col gap-20">
          {/* Yield Forecast */}
          <div className="glass-card">
            <h3 className="section-title" style={{ marginTop: 0 }}>
              <TrendingUp size={16} color="var(--amber-400)" />
              4-WEEK YIELD FORECAST
            </h3>
            <p className="muted" style={{ marginBottom: '14px' }}>
              Projected harvest from current weight-gain trend and regional floral bloom calendar.
            </p>
            <svg viewBox="0 0 400 180" width="100%" height="180">
              <YieldForecastPaths />
            </svg>
            <div className="flex gap-16 flex-wrap field-hint mt-8">
              <span className="flex gap-6">
                <span style={{ width: '8px', height: '8px', background: 'var(--amber-400)', borderRadius: '50%' }}></span>
                Predicted Yield
              </span>
              <span className="flex gap-6">
                <span style={{ width: '8px', height: '8px', background: 'rgba(245,158,11,0.25)', borderRadius: '50%' }}></span>
                ±1σ Confidence Band
              </span>
            </div>

            <div className="notice mt-12">
              <div className="flex-between">
                <div>
                  <div className="muted">Estimated Extractable Volume</div>
                  <div className="mono" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--amber-400)', marginTop: '2px' }}>{yieldKg} kg</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="muted">Projected Revenue</div>
                  <div className="mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>₹{(yieldKg * 450).toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>@ ₹450/kg farm gate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Anomaly Detection */}
          <div className="glass-card">
            <h3 className="section-title" style={{ marginTop: 0 }}>
              <Activity size={16} color={anomalies.length > 0 ? '#f87171' : 'var(--emerald-400)'} />
              ANOMALY DETECTION
              {anomalies.length > 0 && (
                <span className="pill pill-sm" style={{ marginLeft: 'auto', background: 'rgba(248,113,113,0.12)', color: '#f87171' }}>
                  {anomalies.length} detected
                </span>
              )}
            </h3>

            {anomalies.length === 0 ? (
              <div className="notice notice-success flex gap-10" style={{ fontSize: '13px', fontWeight: 600, padding: '16px' }}>
                <CheckCircle2 size={18} /> All sensor readings within normal parameters. No anomalies detected.
              </div>
            ) : (
              <div className="flex-col gap-10">
                {anomalies.map((a, i) => (
                  <div key={i} className="notice" style={{
                    borderColor: a.type === 'CRITICAL' ? 'rgba(248,113,113,0.3)' : a.type === 'WARNING' ? 'rgba(251,191,36,0.2)' : 'rgba(148,163,184,0.2)',
                    background: a.type === 'CRITICAL' ? 'rgba(248,113,113,0.06)' : a.type === 'WARNING' ? 'rgba(251,191,36,0.04)' : 'rgba(148,163,184,0.04)',
                  }}>
                    <div className="flex gap-8" style={{ marginBottom: '6px' }}>
                      <span style={{ fontSize: '14px' }}>{a.icon}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{a.title}</span>
                      <span className="pill pill-sm" style={{
                        marginLeft: 'auto',
                        background: a.type === 'CRITICAL' ? 'rgba(248,113,113,0.15)' : 'rgba(251,191,36,0.15)',
                        color: a.type === 'CRITICAL' ? '#f87171' : 'var(--amber-400)',
                      }}>{a.type}</span>
                    </div>
                    <div className="muted" style={{ lineHeight: 1.5, marginBottom: '8px' }}>{a.detail}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-main)', fontWeight: 600 }}>
                      → {a.action}
                    </div>
                    {a.signals && (
                      <div className="flex gap-8 flex-wrap mt-8">
                        {a.signals.map((s, j) => (
                          <span key={j} className="mono" style={{ fontSize: '10px', padding: '2px 6px', background: 'var(--bg-code)', borderRadius: '4px', color: 'var(--text-dim)' }}>{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Actions */}
          <div className="glass-card">
            <h3 className="section-title" style={{ marginTop: 0 }}>
              <CheckCircle2 size={16} color="var(--amber-400)" />
              RECOMMENDED ACTIONS
            </h3>

            <div className="flex-col gap-8">
              {actions.map((a, i) => (
                <div key={i} className="notice flex gap-10" style={{ alignItems: 'flex-start' }}>
                  <span className="pill pill-sm" style={{
                    flexShrink: 0, marginTop: '1px',
                    background: a.priority === 'HIGH' ? 'rgba(248,113,113,0.15)' : a.priority === 'MEDIUM' ? 'rgba(251,191,36,0.15)' : 'rgba(52,211,153,0.15)',
                    color: a.priority === 'HIGH' ? '#f87171' : a.priority === 'MEDIUM' ? 'var(--amber-400)' : 'var(--emerald-400)',
                  }}>{a.priority}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>{a.text}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>{a.timeframe}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Confidence / Explainability */}
          <div className="glass-card">
            <h3 className="section-title" style={{ marginTop: 0 }}>
              <Brain size={16} color="#a78bfa" />
              MODEL CONFIDENCE &amp; EXPLAINABILITY
            </h3>

            <div className="grid-2" style={{ gap: '12px', marginBottom: '14px' }}>
              <div className="notice">
                <div className="kpi-label">Prediction Confidence</div>
                <div className="mono" style={{ fontSize: '20px', fontWeight: 700, color: confidence >= 80 ? 'var(--emerald-400)' : 'var(--amber-400)' }}>{confidence}%</div>
              </div>
              <div className="notice">
                <div className="kpi-label">Active Sensors</div>
                <div className="mono" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)' }}>{dataPoints}/6</div>
              </div>
            </div>

            <div className="notice">
              <div className="flex gap-6" style={{ marginBottom: '8px' }}>
                <Info size={13} color="var(--text-dim)" />
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)' }}>What drives these predictions?</span>
              </div>
              <div className="muted" style={{ lineHeight: 1.6 }}>
                <strong>Disease risk</strong> is computed from acoustic frequency harmonics (stress piping detection), brood temperature variance (thermal regulation patterns), and weight volatility (robbing/swarming signals). The model cross-references against a seasonal epidemiological baseline for your region.<br/><br/>
                <strong>Yield forecast</strong> uses a 4-week rolling weight-gain trend, adjusted for the current floral bloom calendar and historical harvest data from the cluster. Confidence narrows as more telemetry cycles are collected.
              </div>
            </div>

            <div className="flex gap-8 flex-wrap mt-12">
              {[
                { label: 'Temp sensor', ok: hive.temp != null },
                { label: 'Humidity', ok: hive.hum != null },
                { label: 'Scale', ok: hive.wt != null },
                { label: 'Acoustic', ok: hive.act != null },
                { label: 'CO₂', ok: hive.co2 != null },
                { label: 'Battery', ok: hive.batt != null },
              ].map(s => (
                <span key={s.label} className="pill pill-sm" style={{
                  background: s.ok ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                  color: s.ok ? 'var(--emerald-400)' : '#f87171',
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: s.ok ? 'var(--emerald-400)' : '#f87171' }}></span>
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
