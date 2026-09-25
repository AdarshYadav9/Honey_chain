import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle2, Wrench } from 'lucide-react';

function buildAlerts(hive) {
  const alerts = [];
  if ((hive.temp ?? 34) > 36) {
    alerts.push({ level: 'WARNING', msg: 'Internal temperature exceeds safe brood range', action: 'Check ventilation and shading within 24 hrs.' });
  }
  if ((hive.hum ?? 60) > 70 || (hive.hum ?? 60) < 45) {
    alerts.push({ level: 'WARNING', msg: 'Humidity outside optimal 45–70% range', action: 'Inspect for water ingress or excessive ventilation.' });
  }
  if (typeof hive.wtDelta === 'string' && hive.wtDelta.trim().startsWith('-')) {
    alerts.push({ level: 'WARNING', msg: `Weight trending down (${hive.wtDelta})`, action: 'Possible swarming or robbing — inspect within 48 hrs.' });
  }
  if ((hive.batt ?? 100) < 25) {
    alerts.push({ level: 'CRITICAL', msg: `Battery at ${Math.round(hive.batt)}% — sensor may go offline`, action: 'Schedule a battery swap on next apiary visit.' });
  }
  if ((hive.co2 ?? 500) > 800) {
    alerts.push({ level: 'WARNING', msg: 'CO₂ levels elevated — possible overcrowding or poor ventilation', action: 'Consider adding a super or improving airflow.' });
  }
  if (hive.swarmRisk === 'High' || hive.swarmRisk === 'Medium') {
    alerts.push({ level: hive.swarmRisk === 'High' ? 'CRITICAL' : 'WARNING', msg: `Swarm risk assessed as ${hive.swarmRisk}`, action: 'Check for queen cells and consider splitting the colony.' });
  }
  return alerts;
}

export default function AlertsPanel({ hive }) {
  const alerts = useMemo(() => buildAlerts(hive), [hive]);

  return (
    <div className="glass-card">
      <div className="mm-cb-title mm-cb-title--row">
        <AlertTriangle size={14} /> ALERTS &amp; RECOMMENDATIONS
      </div>

      {alerts.length === 0 ? (
        <div className="notice notice-success">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <CheckCircle2 size={16} /> No threshold breaches detected — all readings nominal.
          </span>
        </div>
      ) : (
        <div className="alert-stack">
          {alerts.map((a, i) => (
            <div key={i} className="alert-item">
              <AlertTriangle size={15} color={a.level === 'CRITICAL' ? '#f87171' : 'var(--amber-400)'} style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{a.msg}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{a.action}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="divider-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px' }}>
          <Wrench size={13} /> MAINTENANCE REMINDERS
        </div>
        <div style={{ fontSize: '12.5px', color: 'var(--text-main)', marginBottom: '4px' }}>
          Sensor calibration due: <strong>{hive.calibrationDue || 'Not scheduled'}</strong>
        </div>
        <div style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>
          Firmware version: <strong>{hive.firmware || 'Unknown'}</strong>{(hive.batt ?? 100) < 25 ? ' • Battery replacement recommended' : ''}
        </div>
      </div>
    </div>
  );
}
