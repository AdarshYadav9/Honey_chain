import React from 'react';
import { Battery, Radio, MapPin, User, Cpu } from 'lucide-react';

// Backend seeds use { lat, lon } while mock hives use { lat, lng }.
// Never assume either key exists — a missing key used to crash the whole view.
function formatGps(gps) {
  if (!gps) return null;
  const lat = Number(gps.lat);
  const lng = Number(gps.lng !== undefined && gps.lng !== null ? gps.lng : gps.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat === 0 && lng === 0) return null;
  return `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
}

function formatAgo(hive) {
  const updated = hive.lastUpdated ? new Date(hive.lastUpdated).getTime() : NaN;
  if (Number.isFinite(updated)) {
    const secs = Math.max(0, Math.round((Date.now() - updated) / 1000));
    return secs < 60 ? `${secs}s ago` : `${Math.round(secs / 60)}m ago`;
  }
  const secs = hive.lastSyncSec ?? 12;
  return secs < 60 ? `${secs}s ago` : `${Math.round(secs / 60)}m ago`;
}

export default function DeviceMetaPanel({ hiveId, hive }) {
  const lastSync = formatAgo(hive);
  const gpsLabel = formatGps(hive.gps);

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
            {gpsLabel || 'Awaiting first GPS fix'}
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
