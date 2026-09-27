import React from 'react';
import { Battery, Radio, MapPin, User, Cpu } from 'lucide-react';

export default function DeviceMetaPanel({ hiveId, hive }) {
  const lastSync = hive.lastSyncSec != null
    ? (hive.lastSyncSec < 60 ? `${hive.lastSyncSec}s ago` : `${Math.round(hive.lastSyncSec / 60)}m ago`)
    : '12s ago';

  return (
    <div className="glass-card">
      <div className="mm-cb-title mm-cb-title--row">
        <Cpu size={14} /> DEVICE &amp; METADATA
      </div>

      <div className="grid-2">
        <div>
          <div className="mm-ss-item" style={{ marginBottom: '4px' }}><Battery size={14} color="var(--emerald-400)" /> {Math.round(hive.batt ?? 80)}% • {hive.powerSource || 'Solar-assisted'}</div>
        </div>
        <div>
          <div className="mm-ss-item" style={{ marginBottom: '4px' }}><Radio size={14} color="var(--emerald-400)" /> Connected • Synced {lastSync}</div>
        </div>
        <div>
          <div className="meta-label">Hive ID / Cluster</div>
          <div className="meta-value">{hiveId} • {hive.cluster || '—'}</div>
        </div>
        <div>
          <div className="meta-label">Beekeeper Assigned</div>
          <div className="meta-value"><User size={12} /> {hive.beekeeper || 'Unassigned'}</div>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <div className="meta-label">GPS Location</div>
          <div className="meta-value">
            <MapPin size={12} />
            {hive.gps ? `${hive.gps.lat.toFixed(4)}° N, ${hive.gps.lng.toFixed(4)}° E` : 'Not available'}
          </div>
        </div>
        <div>
          <div className="meta-label">Firmware</div>
          <div className="meta-value">{hive.firmware || 'Unknown'}</div>
        </div>
        <div>
          <div className="meta-label">Calibration Due</div>
          <div className="meta-value">{hive.calibrationDue || 'Not scheduled'}</div>
        </div>
      </div>
    </div>
  );
}
