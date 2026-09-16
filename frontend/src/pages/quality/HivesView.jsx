import React from 'react';
import { Cpu, Thermometer, Droplets, Scale, Battery } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const stateColor = { ok: 'var(--emerald-400)', warn: 'var(--amber-400)', low: '#f87171' };
const stateLabel = { ok: 'Healthy', warn: 'Watch', low: 'Low Battery' };

export default function HivesView() {
  const { hives } = useApp();

  return (
    <section className="view-pane active" id="view-hives">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><Cpu size={13} /> Read-Only Hive Reference</div>
        <h2 style={{ fontSize: '30px' }}>Hives</h2>
        <p className="section-lede">
          Correlate a batch's harvest hive with its live telemetry before signing off on a quality test — you can view but not edit hive settings.
        </p>
      </div>

      <div className="mm-sensor-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        {Object.entries(hives).map(([id, h]) => {
          const state = h.state || 'ok';
          return (
            <div key={id} className="glass-card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '17px' }}>{id}</h3>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: stateColor[state] }}>● {stateLabel[state]}</span>
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                {h.loc || 'Location unavailable'}{h.beekeeper ? ` • Beekeeper: ${h.beekeeper}` : ''}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Thermometer size={13} /> {typeof h.temp === 'number' ? h.temp.toFixed(1) : h.temp}°C</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Droplets size={13} /> {Math.round(h.hum ?? 60)}%</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Scale size={13} /> {typeof h.wt === 'number' ? h.wt.toFixed(1) : h.wt} kg</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Battery size={13} /> {Math.round(h.batt ?? 80)}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
