import React, { useMemo, useState, useEffect } from 'react';
import {
  Sparkles, Settings, Search, ShieldCheck, ChevronRight, Activity, Battery
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { flowSteps } from '../data/mockData';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function Overview() {
  const {
    currentUser, hives, switchView,
    productionRange, setProductionRange,
    setBatchIdInput, sharedBatches,
  } = useApp();

  const [batches, setBatches] = useState([]);
  const [, setHiveList] = useState([]);
  const [lastSync, setLastSync] = useState('—');

  useEffect(() => {
    fetch(`${API_BASE}/api/batches`)
      .then(r => r.json())
      .then(d => { if (d.ok) setBatches(d.batches); })
      .catch(() => {});

    fetch(`${API_BASE}/api/iot/hives`)
      .then(r => r.json())
      .then(d => { if (d.ok) setHiveList(Object.values(d.hives || {})); })
      .catch(() => {});

    const iv = setInterval(() => {
      setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 5000);
    setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    return () => clearInterval(iv);
  }, []);

  const allBatches = batches.length > 0 ? batches : sharedBatches;

  const pulse = useMemo(() => {
    const list = Object.values(hives);
    const total = list.length || 1;
    const healthy = list.filter(h => (h.state || 'ok') === 'ok').length;
    const avgScore = Math.round(list.reduce((s, h) => s + (h.healthScore ?? 80), 0) / total);
    const alerts = list.filter(h => h.state === 'warn' || h.state === 'low').length;
    const avgBattery = Math.round(list.reduce((s, h) => s + (h.batt ?? 80), 0) / total);
    return { total: list.length, healthy, avgScore, alerts, avgBattery };
  }, [hives]);

  const verifiedBatches = allBatches.filter(b => b.status === 'CERTIFIED' || b.status === 'PROCESSED' || b.status === 'PACKAGED' || b.status === 'DISPATCHED');

  const recentBatches = useMemo(() => {
    return [...allBatches]
      .sort((a, b) => (b.transactions?.[0]?.date || '').localeCompare(a.transactions?.[0]?.date || ''))
      .slice(0, 5);
  }, [allBatches]);

  const productionData = useMemo(() => {
    const now = new Date();
    const days = productionRange === '7' ? 7 : productionRange === '30' ? 30 : 90;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const buckets = {};
    for (let i = 0; i <= days; i++) {
      const d = new Date(cutoff.getTime() + i * 24 * 60 * 60 * 1000);
      buckets[d.toISOString().slice(0, 10)] = 0;
    }

    allBatches.forEach(b => {
      const d = (b.harvestDate || b.transactions?.[0]?.date || '').slice(0, 10);
      if (buckets[d] !== undefined) buckets[d] += b.quantity || 0;
    });

    const vals = Object.values(buckets);
    const max = Math.max(...vals, 1);
    const points = vals.map((v, i) => `${(i / (vals.length - 1)) * 300},${100 - (v / max) * 90}`).join(' ');
    const total = vals.reduce((a, b) => a + b, 0);

    const prevStart = new Date(cutoff.getTime() - days * 24 * 60 * 60 * 1000);
    const prevTotal = allBatches
      .filter(b => {
        const d = new Date(b.harvestDate || b.transactions?.[0]?.date);
        return d >= prevStart && d < cutoff;
      })
      .reduce((s, b) => s + (b.quantity || 0), 0);

    const change = prevTotal > 0 ? (((total - prevTotal) / prevTotal) * 100).toFixed(1) : 0;

    return { points, total: total.toFixed(1), change };
  }, [allBatches, productionRange]);

  const recentAlerts = useMemo(() => {
    const alerts = [];
    allBatches.filter(b => b.status === 'REJECTED').forEach(b => {
      alerts.push({ id: b.id, msg: 'Batch rejected — quality test failed', val: b.honeyType, time: 'recent', level: 'WARNING' });
    });
    Object.values(hives).filter(h => h.state === 'warn').forEach(h => {
      alerts.push({ id: h.id || 'Hive', msg: 'Hive conditions abnormal', val: `${h.temp || '—'}°C`, time: 'recent', level: 'WARNING' });
    });
    Object.values(hives).filter(h => h.state === 'low').forEach(h => {
      alerts.push({ id: h.id || 'Hive', msg: 'Low battery warning', val: `${h.batt || 0}%`, time: 'recent', level: 'WARNING' });
    });
    if (alerts.length === 0) {
      alerts.push({ id: 'SYS', msg: 'All systems operational', val: 'No active alerts', time: 'now', level: 'RESOLVED' });
    }
    return alerts.slice(0, 4);
  }, [allBatches, hives]);

  const latestBatch = recentBatches[0] || null;

  return (
    <section className="view-pane active" id="view-overview">
      {!currentUser && (
        <>
          <div className="hero-grid">
            <div className="hero-content">
              <div className="eyebrow-badge">
                <Sparkles size={13} /> KVIC Honey Mission Prototype
              </div>
              <h1>
                Every jar carries <span className="gold-highlight" style={{ fontStyle: 'italic' }}>immutable proof</span> of where it came from.
              </h1>
              <p className="section-lede">
                Honey Chain connects rural beekeepers, smart hives, AI analytics and blockchain traceability into one trusted honey ecosystem.
              </p>
              <div className="hero-cta-row">
                <button className="btn-luxury btn-luxury-primary" onClick={() => switchView('monitor')}>
                  <Settings size={16} /> Open Hive Telemetry
                </button>
                <button className="btn-luxury btn-luxury-ghost" onClick={() => switchView('qr')}>
                  <Search size={16} /> Try Consumer Scanner
                </button>
              </div>
            </div>

            <div className="live-hive-badge-wrap">
              <div className="live-hive-badge">
                <div className="live-badge-top">
                  <div className="live-badge-meta">
                    <div className="hive-code">FLEET PULSE</div>
                    <div className="hive-loc-title">{pulse.total} hives reporting</div>
                  </div>
                  <span className="status-beacon">
                    <span className="beacon-dot"></span> {pulse.healthy}/{pulse.total} HEALTHY
                  </span>
                </div>

                <div className="telemetry-vitals-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <div className="vital-cell">
                    <div className="vital-lbl"><Activity size={14} /> Avg Health Score</div>
                    <div className="vital-val">{pulse.avgScore} <span className="vital-unit">/100</span></div>
                  </div>
                  <div className="vital-cell">
                    <div className="vital-lbl"><ShieldCheck size={14} /> Active Alerts</div>
                    <div className="vital-val">{pulse.alerts}</div>
                  </div>
                  <div className="vital-cell">
                    <div className="vital-lbl"><Battery size={14} /> Avg Battery</div>
                    <div className="vital-val">{pulse.avgBattery} <span className="vital-unit">%</span></div>
                  </div>
                </div>

                <button className="btn-luxury btn-luxury-ghost popover-btn" style={{ marginTop: '16px', width: '100%' }} onClick={() => switchView('monitor')}>
                  View Full Hive Monitor →
                </button>
              </div>
            </div>
          </div>

          <div className="flow-container">
            <div className="flow-title-row">
              <div className="eyebrow-badge">
                <ShieldCheck size={13} /> Supply Chain Architecture
              </div>
              <h2>From Hive to Hand, One Continuous Audit Trail</h2>
            </div>
            <div className="flow-cards-scroll">
              {flowSteps.map((s, i) => (
                <React.Fragment key={s.n}>
                  <div className="flow-stage-card clickable" onClick={() => switchView(s.view)}>
                    <div className="stage-num">{s.n}</div>
                    <div className="stage-title">{s.t}</div>
                    <div className="stage-desc">{s.d}</div>
                  </div>
                  {i < flowSteps.length - 1 && (
                    <div className="flow-conduit"><ChevronRight size={22} /></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </>
      )}

      {currentUser && (
        <>
          <div className="system-status-strip">
            <div className="status-label">SYSTEM STATUS</div>
            <div className="status-metric clickable" onClick={() => switchView('monitor')}>
              <span className="status-dot healthy"></span> {pulse.total} Hives Online
            </div>
            <div className="status-metric clickable" onClick={() => switchView('monitor')}>
              <span className="status-dot healthy"></span> {pulse.healthy} Healthy
            </div>
            <div className="status-metric clickable" onClick={() => switchView('ai')}>
              <span className="status-dot warning"></span> {pulse.alerts} Active Alerts
            </div>
            <div className="status-metric clickable" onClick={() => switchView('chain')}>
              <span className="status-dot healthy"></span> {verifiedBatches.length} Verified Batches
            </div>
            <div className="status-divider"></div>
            <div className="status-meta clickable" onClick={() => switchView('chain')}>
              <span style={{ color: 'var(--text-muted)' }}>Blockchain Sync:</span> {lastSync}
            </div>
            <div className="status-meta clickable" onClick={() => switchView('monitor')}>
              <span style={{ color: 'var(--text-muted)' }}>IoT Network:</span> <span style={{ color: 'var(--emerald-400)' }}>Online</span>
            </div>
          </div>

          <div className="overview-bottom-grid">
            <div className="overview-panel">
              <div className="panel-header">
                <h3>RECENT AI ALERTS</h3>
                <button className="panel-link" onClick={() => switchView('ai')}>View All →</button>
              </div>
              <div className="alert-list">
                {recentAlerts.map((alt, idx) => (
                  <div className="alert-row clickable" key={idx} onClick={() => switchView('ai')}>
                    <div className="alert-id">{alt.id}</div>
                    <div className="alert-details">
                      <div className="alert-msg">{alt.msg}</div>
                      <div className="alert-meta">{alt.val} • {alt.time}</div>
                    </div>
                    <div className={`alert-badge ${alt.level.toLowerCase()}`}>{alt.level}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overview-panel">
              <div className="panel-header"><h3>HONEY PRODUCTION</h3></div>
              <div className="production-stats">
                <div className="prod-big">{productionData.total} kg</div>
                <div className="prod-sub">
                  {parseFloat(productionData.change) >= 0
                    ? <span style={{ color: 'var(--emerald-400)' }}>↑ {productionData.change}%</span>
                    : <span style={{ color: 'var(--rose-400)' }}>↓ {Math.abs(parseFloat(productionData.change))}%</span>
                  } vs previous period
                </div>
              </div>
              <div className="chart-toggles">
                <button className={`chart-toggle ${productionRange === '7' ? 'active' : ''}`} onClick={() => setProductionRange('7')}>7 Days</button>
                <button className={`chart-toggle ${productionRange === '30' ? 'active' : ''}`} onClick={() => setProductionRange('30')}>30 Days</button>
                <button className={`chart-toggle ${productionRange === '90' ? 'active' : ''}`} onClick={() => setProductionRange('90')}>3 Months</button>
              </div>
              <div className="production-chart clickable" onClick={() => switchView('ai')}>
                <svg viewBox="0 0 300 100" className="prod-svg">
                  {productionData.points && <polyline points={productionData.points} fill="none" stroke="var(--amber-400)" strokeWidth="2.5" strokeLinejoin="round" />}
                </svg>
              </div>
            </div>

            <div className="overview-panel">
              <div className="panel-header"><h3>LATEST BATCH</h3></div>
              {latestBatch ? (
                <div className="batch-card clickable" onClick={() => { switchView('chain'); setBatchIdInput(latestBatch.id); }}>
                  <div className="batch-id">{latestBatch.id}</div>
                  <div className="batch-type">{latestBatch.honeyType} • {latestBatch.quantity} kg</div>
                  <div className="batch-meta-grid">
                    <div className="bm-label">Harvested:</div>
                    <div className="bm-val">{latestBatch.harvestDate ? new Date(latestBatch.harvestDate).toLocaleDateString() : '—'}</div>
                    <div className="bm-label">Status:</div>
                    <div className="bm-val verify-text">✓ {latestBatch.status || 'Created'}</div>
                    <div className="bm-label">Hive:</div>
                    <div className="bm-val">{latestBatch.hiveId || '—'}</div>
                  </div>
                  <button className="btn-luxury btn-luxury-primary" style={{ width: '100%', marginTop: '16px' }} onClick={(e) => { e.stopPropagation(); switchView('chain'); setBatchIdInput(latestBatch.id); }}>
                    View Full Trace →
                  </button>
                </div>
              ) : (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '12px' }}>
                  No batches yet. Create one from Harvest tab.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
