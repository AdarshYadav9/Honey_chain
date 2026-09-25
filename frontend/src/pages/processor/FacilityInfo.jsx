import React, { useState, useEffect } from 'react';
import { Building2, Cpu, Shield, Users, Link2, RefreshCw } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function FacilityInfo() {
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFacility = () => {
    setLoading(true);
    fetch(`${API_BASE}/api/facility`)
      .then(r => r.json())
      .then(data => { if (data.ok) setFacility(data.facility); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFacility(); }, []);

  if (loading) return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><Building2 size={13} /> Facility</div>
        <h2>Processing Facility</h2>
      </div>
      <div className="state-loading">Loading facility info...</div>
    </section>
  );

  if (!facility) return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><Building2 size={13} /> Facility</div>
        <h2>Processing Facility</h2>
      </div>
      <div className="state-empty">Facility data unavailable.</div>
    </section>
  );

  return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><Building2 size={13} /> Facility</div>
        <h2>Processing Facility</h2>
        <p className="section-lede">Processing unit details tied to blockchain entries.</p>
      </div>

      <div className="toolbar">
        <button onClick={fetchFacility} className="btn btn-soft btn-sm">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="grid-2" style={{ marginBottom: '16px' }}>
        <div className="panel">
          <div className="panel-head">
            <div className="flex gap-8"><Building2 size={16} color="var(--amber-400)" /><span className="panel-title">Unit Information</span></div>
          </div>
          {[
            { label: 'Facility ID', value: facility.id },
            { label: 'Name', value: facility.name },
            { label: 'Type', value: facility.type },
            { label: 'Address', value: facility.address },
            { label: 'GPS', value: facility.gps },
            { label: 'Capacity', value: facility.capacity },
          ].map(item => (
            <div key={item.label} className="flex-between" style={{ padding: '7px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="muted">{item.label}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{item.value}</span>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="flex gap-8"><Shield size={16} color="var(--emerald-400)" /><span className="panel-title">Certifications</span></div>
          </div>
          {facility.certifications.map((cert, i) => (
            <div key={i} style={{ padding: '8px 12px', background: 'var(--emerald-bg)', border: '1px solid var(--emerald-border)', borderRadius: '8px', marginBottom: '8px', fontSize: '12px', color: 'var(--emerald-400)', fontWeight: 600 }}>
              {cert}
            </div>
          ))}
        </div>
      </div>

      <div className="panel" style={{ marginBottom: '16px' }}>
        <div className="panel-head">
          <div className="flex gap-8"><Cpu size={16} color="#60a5fa" /><span className="panel-title">Equipment</span></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
          {facility.equipment.map((eq, i) => (
            <div key={i} style={{ padding: '14px', background: 'var(--bg-inset)', borderRadius: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>{eq.name}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px' }}>
                <div><span style={{ color: 'var(--text-dim)' }}>Capacity: </span>{eq.capacity}</div>
                <div><span style={{ color: 'var(--text-dim)' }}>Status: </span><span style={{ color: 'var(--emerald-400)' }}>{eq.status}</span></div>
                <div><span style={{ color: 'var(--text-dim)' }}>Last Serviced: </span>{eq.lastServiced}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <div className="flex gap-8"><Users size={16} color="var(--amber-400)" /><span className="panel-title">Operators</span></div>
          </div>
          {facility.operators.map((op, i) => (
            <div key={i} className="flex-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 600 }}>{op.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{op.role}</div>
              </div>
              <span className="pill-sm" style={{ color: 'var(--text-dim)', background: 'var(--bg-inset)' }}>{op.badge}</span>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="flex gap-8"><Link2 size={16} color="#a78bfa" /><span className="panel-title">Blockchain Node</span></div>
          </div>
          {[
            { label: 'Network', value: facility.blockchainNode.network },
            { label: 'Endpoint', value: facility.blockchainNode.nodeEndpoint },
            { label: 'Contract', value: facility.blockchainNode.contractAddress },
            { label: 'Blocks Anchored', value: facility.blockchainNode.blocksAnchored },
            { label: 'Last Sync', value: new Date(facility.blockchainNode.lastSync).toLocaleTimeString() },
          ].map(item => (
            <div key={item.label} className="flex-between" style={{ padding: '7px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="muted">{item.label}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, textAlign: 'right' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}