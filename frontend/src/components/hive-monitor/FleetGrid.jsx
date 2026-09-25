import React, { useMemo, useState } from 'react';
import { ArrowUpDown, Thermometer, Droplets, Scale, Battery } from 'lucide-react';

const STATE_META = {
  ok: { label: 'Healthy', color: 'var(--emerald-400)' },
  warn: { label: 'Watch', color: 'var(--amber-400)' },
  low: { label: 'Low Battery', color: '#f87171' },
};

const SEVERITY_META = {
  none: { label: 'None', color: 'var(--emerald-400)' },
  low: { label: 'Low', color: 'var(--emerald-400)' },
  medium: { label: 'Medium', color: 'var(--amber-400)' },
  high: { label: 'High', color: '#f87171' },
};

const COLUMNS = [
  { key: 'id', label: 'Hive ID' },
  { key: 'cluster', label: 'Cluster' },
  { key: 'state', label: 'Health' },
  { key: 'temp', label: 'Temp (°C)' },
  { key: 'hum', label: 'Humidity (%)' },
  { key: 'wt', label: 'Weight (kg)' },
  { key: 'batt', label: 'Battery (%)' },
  { key: 'alertSeverity', label: 'Alert' },
];

export default function FleetGrid({ hives, onSelectHive }) {
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  const [clusterFilter, setClusterFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const rows = useMemo(() => Object.entries(hives).map(([id, h]) => ({
    id,
    cluster: h.cluster || (h.loc ? h.loc.split(',')[0] : '—'),
    loc: h.loc,
    state: h.state || 'ok',
    temp: h.temp ?? 0,
    hum: h.hum ?? 0,
    wt: h.wt ?? 0,
    batt: h.batt ?? 0,
    alertSeverity: h.alertSeverity || (h.state === 'low' ? 'high' : h.state === 'warn' ? 'medium' : 'none'),
  })), [hives]);

  const clusters = useMemo(() => ['ALL', ...Array.from(new Set(rows.map(r => r.cluster)))], [rows]);

  const filtered = useMemo(() => {
    return rows.filter(r =>
      (clusterFilter === 'ALL' || r.cluster === clusterFilter) &&
      (severityFilter === 'ALL' || r.alertSeverity === severityFilter)
    );
  }, [rows, clusterFilter, severityFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (key === sortKey) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="glass-card">
      <div className="toolbar" style={{ justifyContent: 'space-between', marginBottom: '16px' }}>
        <div className="muted">{sorted.length} of {rows.length} hives shown</div>
        <div className="toolbar-group">
          <select className="select select-sm" value={clusterFilter} onChange={e => setClusterFilter(e.target.value)}>
            {clusters.map(c => <option key={c} value={c}>{c === 'ALL' ? 'All Clusters' : c}</option>)}
          </select>
          <select className="select select-sm" value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}>
            <option value="ALL">All Alert Levels</option>
            <option value="none">None</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <table className="mm-table">
        <thead>
          <tr>
            {COLUMNS.map(col => (
              <th key={col.key} onClick={() => toggleSort(col.key)} style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
                {col.label} <ArrowUpDown size={11} style={{ verticalAlign: 'middle', opacity: sortKey === col.key ? 1 : 0.35 }} />
              </th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(r => {
            const stateMeta = STATE_META[r.state] || STATE_META.ok;
            const sevMeta = SEVERITY_META[r.alertSeverity] || SEVERITY_META.none;
            return (
              <tr key={r.id}>
                <td style={{ fontWeight: 600 }}>{r.id}</td>
                <td className="muted">{r.cluster}</td>
                <td style={{ color: stateMeta.color, fontWeight: 600 }}>● {stateMeta.label}</td>
                <td><Thermometer size={12} />{r.temp.toFixed ? r.temp.toFixed(1) : r.temp}</td>
                <td><Droplets size={12} />{Math.round(r.hum)}</td>
                <td><Scale size={12} />{r.wt.toFixed ? r.wt.toFixed(1) : r.wt}</td>
                <td><Battery size={12} />{Math.round(r.batt)}</td>
                <td style={{ color: sevMeta.color, fontWeight: 600 }}>{sevMeta.label}</td>
                <td>
                  <button className="btn-luxury btn-luxury-ghost btn-sm" onClick={() => onSelectHive(r.id)}>
                    View →
                  </button>
                </td>
              </tr>
            );
          })}
          {sorted.length === 0 && (
            <tr><td colSpan={COLUMNS.length + 1} className="state-empty" style={{ padding: '24px' }}>No hives match these filters.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
