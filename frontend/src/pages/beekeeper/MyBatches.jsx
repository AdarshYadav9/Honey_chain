import React from 'react';
import { Layers, CheckCircle2, Circle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const PIPELINE = [
  { key: 'HARVEST_CREATED', label: 'Harvest' },
  { key: 'HARVEST_VERIFIED', label: 'Verified' },
  { key: 'QUALITY_VERIFIED', label: 'Quality Tested' },
  { key: 'PROCESSED', label: 'Processed' },
  { key: 'PACKAGED', label: 'Packaged' },
];

function stageIndex(status) {
  const idx = PIPELINE.findIndex(p => p.key === status);
  return idx === -1 ? 0 : idx;
}

export default function MyBatches() {
  const { sharedBatches, switchView, setBatchIdInput } = useApp();

  return (
    <section className="view-pane active" id="view-my-batches">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><Layers size={13} /> My Harvest Batches</div>
        <h2 style={{ fontSize: '30px' }}>My Batches</h2>
        <p className="section-lede">Track every batch you've registered as it moves through quality testing, processing and packaging.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        {sharedBatches.map(batch => {
          const idx = stageIndex(batch.status);
          return (
            <div key={batch.id} className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--amber-400)' }}>{batch.id}</h3>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Hive: {batch.hiveId} • {batch.honeyType} • {batch.quantity} kg
                  </div>
                </div>
                <button
                  className="btn-luxury btn-luxury-ghost"
                  style={{ fontSize: '12.5px', padding: '8px 14px' }}
                  onClick={() => { setBatchIdInput(batch.id); switchView('chain'); }}
                >
                  View Full Trace →
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', paddingBottom: '4px' }}>
                {PIPELINE.map((stage, i) => (
                  <React.Fragment key={stage.key}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '90px' }}>
                      {i <= idx
                        ? <CheckCircle2 size={20} color="var(--emerald-400)" />
                        : <Circle size={20} color="var(--border-subtle)" />}
                      <div style={{ fontSize: '11.5px', marginTop: '6px', color: i <= idx ? 'var(--text-main)' : 'var(--text-muted)', textAlign: 'center' }}>
                        {stage.label}
                      </div>
                    </div>
                    {i < PIPELINE.length - 1 && (
                      <div style={{ flex: 1, height: '2px', background: i < idx ? 'var(--emerald-400)' : 'var(--border-subtle)', marginBottom: '20px' }} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        })}
        {sharedBatches.length === 0 && (
          <div className="glass-card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
            No batches yet — register a harvest from Hive Monitor to start one.
          </div>
        )}
      </div>
    </section>
  );
}
