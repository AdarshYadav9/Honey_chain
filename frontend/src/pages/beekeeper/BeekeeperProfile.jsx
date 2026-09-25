import React, { useState } from 'react';
import { User, MapPin, Phone, Mail, Edit3, CheckCircle2, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function BeekeeperProfile() {
  const { currentUser, hives, sharedBatches } = useApp();
  const [editing, setEditing] = useState(false);

  const hiveCount = (hives || []).length;
  const batchCount = (sharedBatches || []).length;

  const profile = {
    name: currentUser?.name || 'Beekeeper',
    email: currentUser?.email || 'beekeeper@honeychain.demo',
    phone: currentUser?.phone || '+91 98765 43210',
    role: currentUser?.role || 'Beekeeper',
    cluster: currentUser?.cluster || 'Muzaffarpur Apiary Cluster',
    state: currentUser?.state || 'Bihar',
    district: currentUser?.district || 'Muzaffarpur',
    village: currentUser?.village || 'Brahmpura',
    gps: currentUser?.gps || '26.1209°N, 85.3647°E',
    memberSince: currentUser?.memberSince || 'Jan 2025',
    totalHives: hiveCount,
    totalBatches: batchCount,
    rating: currentUser?.rating || 4.8,
  };

  const [localProfile, setLocalProfile] = useState(profile);
  const update = (key, val) => setLocalProfile(p => ({ ...p, [key]: val }));

  const handleSave = () => {
    setEditing(false);
  };

  return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><User size={13} /> Profile &amp; Apiary</div>
        <h2>My Profile</h2>
        <p className="section-lede">Manage your apiary information, location, and contact details.</p>
      </div>

      <div className="grid-2" style={{ maxWidth: '900px' }}>
        <div className="panel">
          <div className="panel-head">
            <span style={{ fontSize: '14px', fontWeight: 700 }}>Personal Information</span>
            <button onClick={() => editing ? handleSave() : setEditing(true)} className="btn btn-sm btn-soft" style={{ background: editing ? 'var(--emerald-400)' : 'var(--bg-inset)', color: editing ? '#0f0b04' : 'var(--text-muted)' }}>
              {editing ? <><CheckCircle2 size={12} /> Saved</> : <><Edit3 size={12} /> Edit</>}
            </button>
          </div>

          {editing ? (
            <div className="flex-col gap-12">
              <div className="field"><label className="field-label">Full Name</label><input className="input" value={localProfile.name} onChange={e => update('name', e.target.value)} /></div>
              <div className="field"><label className="field-label">Email</label><input className="input" value={localProfile.email} onChange={e => update('email', e.target.value)} /></div>
              <div className="field"><label className="field-label">Phone</label><input className="input" value={localProfile.phone} onChange={e => update('phone', e.target.value)} /></div>
              <div className="field"><label className="field-label">Village</label><input className="input" value={localProfile.village} onChange={e => update('village', e.target.value)} /></div>
            </div>
          ) : (
            <div className="flex-col gap-12">
              {[
                { icon: <User size={14} />, label: 'Name', value: localProfile.name },
                { icon: <Mail size={14} />, label: 'Email', value: localProfile.email },
                { icon: <Phone size={14} />, label: 'Phone', value: localProfile.phone },
                { icon: <MapPin size={14} />, label: 'Location', value: `${localProfile.village}, ${localProfile.district}, ${localProfile.state}` },
                { icon: <Calendar size={14} />, label: 'Member Since', value: localProfile.memberSince },
              ].map(item => (
                <div key={item.label} className="flex gap-10">
                  <span style={{ color: 'var(--amber-400)' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-col gap-16">
          <div className="panel">
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px' }}>Apiary Details</div>
            <div className="flex-col gap-10">
              {[
                { label: 'Cluster', value: localProfile.cluster },
                { label: 'GPS Coordinates', value: localProfile.gps },
                { label: 'Total Hives', value: localProfile.totalHives },
                { label: 'Total Batches', value: localProfile.totalBatches },
              ].map(item => (
                <div key={item.label} className="flex-between" style={{ padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{item.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px' }}>Performance</div>
            <div className="grid-2">
              {[
                { label: 'Rating', value: `${localProfile.rating}/5.0`, color: 'var(--amber-400)' },
                { label: 'Role', value: localProfile.role, color: 'var(--emerald-400)' },
              ].map(card => (
                <div key={card.label} style={{ padding: '12px', background: 'var(--bg-inset)', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: card.color }}>{card.value}</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', marginTop: '2px' }}>{card.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}