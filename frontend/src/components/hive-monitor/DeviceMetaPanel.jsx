import React from 'react';
import { Battery, Radio, MapPin, User, Cpu } from 'lucide-react';

export default function DeviceMetaPanel({ hiveId, hive }) {
  const lastSync = hive.lastSyncSec != null
    ? (hive.lastSyncSec < 60 ? `${hive.lastSyncSec}s ago` : `${Math.round(hive.lastSyncSec / 60)}m ago`)
    : '12s ago';

  return (
    <div className="glass-card">
      <div className="mm-cb-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
        <Cpu size={14} /> DEVICE &amp; METADATA
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <div className="mm-ss-item" style={{ marginBottom: '4px' }}><Battery size={14} color="var(--emerald-400)" /> {Math.round(hive.batt ?? 80)}% • {hive.powerSource || 'Solar-assisted'}</div>
        </div>
        <div>
          <div className="mm-ss-item" style={{ marginBottom: '4px' }}><Radio size={14} color="var(--emerald-400)" /> Connected • Synced {lastSync}</div>
        </div>
        <div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Hive ID / Cluster</div>
          <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>{hiveId} • {hive.cluster || '—'}</div>
        </div>
        <div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Beekeeper Assigned</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
            <User size={12} /> {hive.beekeeper || 'Unassigned'}
          </div>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>GPS Location</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
            <MapPin size={12} />
            {hive.gps ? `${hive.gps.lat.toFixed(4)}° N, ${hive.gps.lng.toFixed(4)}° E` : 'Not available'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Firmware</div>
          <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>{hive.firmware || 'Unknown'}</div>
        </div>
        <div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Calibration Due</div>
          <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>{hive.calibrationDue || 'Not scheduled'}</div>
        </div>
      </div>
    </div>
  );
}
