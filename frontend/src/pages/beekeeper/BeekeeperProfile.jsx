import React, { useState } from 'react';
import { User, MapPin, Phone, Mail, Edit3, Save, CheckCircle2, Calendar, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function BeekeeperProfile() {
  const { currentUser, hives, sharedBatches } = useApp();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

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
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fieldStyle = { width: '100%', padding: '9px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)' };

  return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><User size={13} /> Profile &amp; Apiary</div>
        <h2 style={{ fontSize: '28px' }}>My Profile</h2>
        <p className="section-lede">Manage your apiary information, location, and contact details.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '900px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700 }}>Personal Information</span>
            <button onClick={() => editing ? handleSave() : setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: editing ? 'var(--emerald-400)' : 'var(--bg-inset)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: editing ? '#0f0b04' : 'var(--text-muted)', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
              {editing ? <><CheckCircle2 size={12} /> Saved</> : <><Edit3 size={12} /> Edit</>}
            </button>
          </div>

          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><label style={labelStyle}>Full Name</label><input style={fieldStyle} value={localProfile.name} onChange={e => update('name', e.target.value)} /></div>
              <div><label style={labelStyle}>Email</label><input style={fieldStyle} value={localProfile.email} onChange={e => update('email', e.target.value)} /></div>
              <div><label style={labelStyle}>Phone</label><input style={fieldStyle} value={localProfile.phone} onChange={e => update('phone', e.target.value)} /></div>
              <div><label style={labelStyle}>Village</label><input style={fieldStyle} value={localProfile.village} onChange={e => update('village', e.target.value)} /></div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: <User size={14} />, label: 'Name', value: localProfile.name },
                { icon: <Mail size={14} />, label: 'Email', value: localProfile.email },
                { icon: <Phone size={14} />, label: 'Phone', value: localProfile.phone },
                { icon: <MapPin size={14} />, label: 'Location', value: `${localProfile.village}, ${localProfile.district}, ${localProfile.state}` },
                { icon: <Calendar size={14} />, label: 'Member Since', value: localProfile.memberSince },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px' }}>Apiary Details</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Cluster', value: localProfile.cluster },
                { label: 'GPS Coordinates', value: localProfile.gps },
                { label: 'Total Hives', value: localProfile.totalHives },
                { label: 'Total Batches', value: localProfile.totalBatches },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{item.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px' }}>Performance</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
