import React, { useState } from 'react';
import { Settings, Save, RotateCcw, Bell, Cpu, Link2 } from 'lucide-react';

const DEFAULT_SETTINGS = {
  alerts: {
    weightDropThreshold: 15,
    temperatureHigh: 42,
    temperatureLow: 10,
    humidityHigh: 80,
    lowBatteryPercent: 20,
    offlineHours: 24,
  },
  sensors: {
    weightCalibrationFactor: 1.0,
    tempOffset: 0,
    humidityOffset: 0,
    readingIntervalMin: 5,
  },
  blockchain: {
    network: 'Polygon Mainnet',
    contractAddress: '0x7a3B...4f2E',
    gasLimit: 500000,
    confirmationsRequired: 2,
    ipfsGateway: 'ipfs.io',
  },
};

function SectionCard({ icon, title, children }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ color: 'var(--amber-400)' }}>{icon}</span>
        <span style={{ fontSize: '14px', fontWeight: 700 }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, unit, type = 'number' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <input
          type={type}
          value={value}
          onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          style={{ width: '80px', padding: '6px 10px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-main)', fontSize: '12px', textAlign: 'right', outline: 'none' }}
        />
        {unit && <span style={{ fontSize: '11px', color: 'var(--text-dim)', minWidth: '24px' }}>{unit}</span>}
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  const update = (section, key, val) => {
    setSettings(s => ({ ...s, [section]: { ...s[section], [key]: val } }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setSaved(false);
  };

  return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><Settings size={13} /> System Configuration</div>
        <h2 style={{ fontSize: '28px' }}>Settings</h2>
        <p className="section-lede">Configure alert thresholds, sensor calibration, and blockchain node settings.</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', justifyContent: 'flex-end' }}>
        <button onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}>
          <RotateCcw size={14} /> Reset
        </button>
        <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: saved ? 'var(--emerald-400)' : 'var(--gold-gradient)', border: 'none', borderRadius: '8px', color: saved ? '#0f0b04' : '#0f0b04', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>
          <Save size={14} /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        <SectionCard icon={<Bell size={16} />} title="Alert Thresholds">
          <Field label="Weight Drop Alert" value={settings.alerts.weightDropThreshold} onChange={v => update('alerts', 'weightDropThreshold', v)} unit="%" />
          <Field label="Temperature High" value={settings.alerts.temperatureHigh} onChange={v => update('alerts', 'temperatureHigh', v)} unit="°C" />
          <Field label="Temperature Low" value={settings.alerts.temperatureLow} onChange={v => update('alerts', 'temperatureLow', v)} unit="°C" />
          <Field label="Humidity High" value={settings.alerts.humidityHigh} onChange={v => update('alerts', 'humidityHigh', v)} unit="%" />
          <Field label="Low Battery" value={settings.alerts.lowBatteryPercent} onChange={v => update('alerts', 'lowBatteryPercent', v)} unit="%" />
          <Field label="Offline Alert After" value={settings.alerts.offlineHours} onChange={v => update('alerts', 'offlineHours', v)} unit="hrs" />
        </SectionCard>

        <SectionCard icon={<Cpu size={16} />} title="Sensor Calibration">
          <Field label="Weight Calibration" value={settings.sensors.weightCalibrationFactor} onChange={v => update('sensors', 'weightCalibrationFactor', v)} unit="x" />
          <Field label="Temp Offset" value={settings.sensors.tempOffset} onChange={v => update('sensors', 'tempOffset', v)} unit="°C" />
          <Field label="Humidity Offset" value={settings.sensors.humidityOffset} onChange={v => update('sensors', 'humidityOffset', v)} unit="%" />
          <Field label="Reading Interval" value={settings.sensors.readingIntervalMin} onChange={v => update('sensors', 'readingIntervalMin', v)} unit="min" />
        </SectionCard>

        <SectionCard icon={<Link2 size={16} />} title="Blockchain Node">
          <Field label="Network" value={settings.blockchain.network} onChange={v => update('blockchain', 'network', v)} type="text" />
          <Field label="Contract Address" value={settings.blockchain.contractAddress} onChange={v => update('blockchain', 'contractAddress', v)} type="text" />
          <Field label="Gas Limit" value={settings.blockchain.gasLimit} onChange={v => update('blockchain', 'gasLimit', v)} />
          <Field label="Confirmations" value={settings.blockchain.confirmationsRequired} onChange={v => update('blockchain', 'confirmationsRequired', v)} />
          <Field label="IPFS Gateway" value={settings.blockchain.ipfsGateway} onChange={v => update('blockchain', 'ipfsGateway', v)} type="text" />
        </SectionCard>
      </div>
    </section>
  );
}
