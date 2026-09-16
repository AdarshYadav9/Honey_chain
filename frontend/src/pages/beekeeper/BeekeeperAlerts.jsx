import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Battery, Thermometer, Droplets, Wifi, CheckCircle2, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const API_BASE = window.location.hostname !== 'localhost' ? '' : 'http://localhost:4000';

const TYPE_STYLES = {
  critical: { bg: 'var(--rose-bg)', color: 'var(--rose-400)', border: 'var(--rose-border)' },
  warning: { bg: 'rgba(251, 191, 36, 0.12)', color: 'var(--amber-400)', border: 'rgba(251, 191, 36, 0.3)' },
  info: { bg: 'rgba(96, 165, 250, 0.12)', color: '#60a5fa', border: 'rgba(96, 165, 250, 0.3)' },
  success: { bg: 'var(--emerald-bg)', color: 'var(--emerald-400)', border: 'var(--emerald-border)' },
};

function generateAlerts(hives, batches) {
  const alerts = [];
  let id = 1;

  (hives || []).forEach(hive => {
    const sensor = hive.sensorData || {};

    if (sensor.battery !== undefined && sensor.battery < 20) {
      alerts.push({ id: id++, type: 'critical', icon: <Battery size={16} />, title: `Low Battery — ${hive.id}`, desc: `Battery at ${sensor.battery}%. Replace before next inspection.`, time: '2 hours ago', hive: hive.id, read: false });
    }
    if (sensor.temperature !== undefined && sensor.temperature > 40) {
      alerts.push({ id: id++, type: 'warning', icon: <Thermometer size={16} />, title: `High Temperature — ${hive.id}`, desc: `Internal temp reached ${sensor.temperature}°C. Normal range is 35–40°C.`, time: '5 hours ago', hive: hive.id, read: false });
    }
    if (sensor.weight !== undefined && sensor.weight < 15) {
      alerts.push({ id: id++, type: 'warning', icon: <AlertTriangle size={16} />, title: `Low Weight — ${hive.id}`, desc: `Weight dropped to ${sensor.weight}kg. Possible swarm or extraction.`, time: '8 hours ago', hive: hive.id, read: false });
    }
    if (sensor.humidity !== undefined && sensor.humidity > 70) {
      alerts.push({ id: id++, type: 'warning', icon: <Droplets size={16} />, title: `High Humidity — ${hive.id}`, desc: `Humidity at ${sensor.humidity}%. Risk of fermentation.`, time: '1 day ago', hive: hive.id, read: true });
    }
  });

  (batches || []).forEach(batch => {
    if (batch.status === 'HARVEST_VERIFIED') {
      alerts.push({ id: id++, type: 'success', icon: <CheckCircle2 size={16} />, title: `Batch Verified — ${batch.id}`, desc: `Lab results passed. Batch approved for processing.`, time: '1 day ago', hive: batch.hiveId, read: true });
    }
    if (batch.status === 'PACKAGED') {
      alerts.push({ id: id++, type: 'success', icon: <CheckCircle2 size={16} />, title: `Batch Packaged — ${batch.id}`, desc: `Ready for sale. ${batch.quantity}kg of ${batch.honeyType}.`, time: '2 days ago', hive: batch.hiveId, read: true });
    }
  });

  if (alerts.length === 0) {
    alerts.push({ id: id++, type: 'info', icon: <CheckCircle2 size={16} />, title: 'All Clear', desc: 'No alerts right now. Your hives and batches look healthy.', time: 'Just now', hive: 'All', read: true });
  }

  return alerts;
}

export default function BeekeeperAlerts() {
  const { hives, sharedBatches } = useApp();
  const [filter, setFilter] = useState('all');
  const [alerts, setAlerts] = useState([]);
  const filters = ['all', 'critical', 'warning', 'info', 'success'];

  useEffect(() => {
    setAlerts(generateAlerts(hives, sharedBatches));
  }, [hives, sharedBatches]);

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.type === filter);
  const unread = alerts.filter(a => !a.read).length;

  return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><Bell size={13} /> Notifications</div>
        <h2 style={{ fontSize: '28px' }}>Alerts &amp; Notifications</h2>
        <p className="section-lede">Inspection reminders, low battery warnings, risk flags, and batch updates.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '5px 12px', borderRadius: '999px', border: '1px solid var(--border-subtle)',
              background: filter === f ? 'var(--gold-gradient)' : 'transparent',
              color: filter === f ? '#0f0b04' : 'var(--text-dim)',
              fontSize: '11px', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
            }}>{f}</button>
          ))}
        </div>
        {unread > 0 && (
          <span style={{ fontSize: '11px', color: 'var(--rose-400)', fontWeight: 600 }}>{unread} unread</span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map(alert => {
          const st = TYPE_STYLES[alert.type];
          return (
            <div key={alert.id} style={{
              display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px 18px',
              background: alert.read ? 'var(--bg-card)' : 'var(--bg-card-hover)',
              border: `1px solid ${alert.read ? 'var(--border-subtle)' : st.border}`,
              borderRadius: '12px',
              opacity: alert.read ? 0.7 : 1,
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: st.bg, color: st.color, flexShrink: 0,
              }}>{alert.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{alert.title}</span>
                  {!alert.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--rose-400)' }} />}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{alert.desc}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{alert.time}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>{alert.hive}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
