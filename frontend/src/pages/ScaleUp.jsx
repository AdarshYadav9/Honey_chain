import React, { useState } from 'react';
import {
  TrendingUp, Cpu, Wifi, Link2, BarChart3, Users, Boxes,
  MapPin, ChevronDown, ChevronUp, IndianRupee, Building2, Truck,
  FlaskConical, Smartphone, Globe, Layers, ArrowRight, CheckCircle2
} from 'lucide-react';

const PHASES = [
  {
    id: 1, label: 'PHASE 1', title: 'Pilot Apiary Clusters',
    period: 'Months 0–6', status: 'active',
    hives: 50, clusters: 2, regions: 'Satara, Kolhapur',
    beekeepers: 12, stores: 3,
    kpis: [
      'LoRaWAN gateway uptime ≥ 98%',
      'AI acoustic disease detection accuracy ≥ 85%',
      'Consumer QR scan engagement ≥ 60%',
      'Batch processing turnaround ≤ 48 hours',
    ],
    deliverables: [
      'Deploy 50 smart hive kits (sensors + LoRaWAN node)',
      'Install 2 LoRaWAN gateways (Satara & Kolhapur)',
      'Launch pilot at 3 retail stores with QR verification',
      'Establish batch flow: Harvest → Lab → Process → QR',
    ],
    color: 'var(--emerald-400)',
  },
  {
    id: 2, label: 'PHASE 2', title: 'Regional Expansion',
    period: 'Months 6–18', status: 'upcoming',
    hives: 500, clusters: 12, regions: 'Maharashtra, Punjab, Bihar',
    beekeepers: 80, stores: 25,
    kpis: [
      'NMR lab integration across 3 states',
      'Cold-chain batch pooling for 200+ units/month',
      'Blockchain ledger finality ≤ 10 seconds',
      'Consumer trust score ≥ 4.5/5',
    ],
    deliverables: [
      'Scale to 500 smart hives across 12 clusters',
      'Onboard 3 NMR-accredited labs to the platform',
      'Deploy cold-chain processing units in each state',
      'Launch 25 retail QR verification points',
    ],
    color: 'var(--amber-400)',
  },
  {
    id: 3, label: 'PHASE 3', title: 'National Integration',
    period: 'Months 18–36', status: 'future',
    hives: 5000, clusters: 60, regions: 'Pan-India (12 States)',
    beekeepers: 400, stores: 200,
    kpis: [
      'Full KVIC Honey Mission registry integration',
      '10,000+ batches on-chain within 24 months',
      'Subsidy disbursement automation via blockchain',
      'Export-ready certification pipeline',
    ],
    deliverables: [
      'Integrate with national KVIC welfare distribution',
      'Bundle IoT sensor kits with bee box subsidies',
      'Enable inter-state batch pooling & trade',
      'Launch consumer mobile app (iOS + Android)',
    ],
    color: 'var(--sky-400)',
  },
];

const TECH_STACK = [
  {
    layer: 'Sensing Layer', icon: <Cpu size={18} />, color: 'var(--emerald-400)',
    techs: ['DS18B20 Temperature Probe', 'HX711 Load Cell (±5g)', 'DHT22 Humidity Sensor', 'ADS1115 ADC (16-bit)'],
    purpose: 'Real-time hive weight, internal temperature, and humidity telemetry captured every 5 minutes.',
  },
  {
    layer: 'Connectivity Layer', icon: <Wifi size={18} />, color: 'var(--sky-400)',
    techs: ['LoRaWAN SX1276 (868 MHz)', 'Dragino LPS8N Gateway', 'The Things Network (TTN)', 'MQTT Bridge'],
    purpose: 'Long-range, low-power mesh networking. Each gateway covers 10–15 km radius for rural apiary deployment.',
  },
  {
    layer: 'AI / Analytics Layer', icon: <BarChart3 size={18} />, color: 'var(--amber-400)',
    techs: ['TensorFlow Lite (Acoustic CNN)', 'Isolation Forest (Anomaly)', 'Prophet (Yield Forecast)', 'LLM Summarizer (GPT-4)'],
    purpose: 'Acoustic disease detection, yield forecasting, anomaly flagging, and natural-language operational summaries.',
  },
  {
    layer: 'Blockchain Layer', icon: <Link2 size={18} />, color: 'var(--violet-400)',
    techs: ['Ethereum L2 / Polygon (PoS)', 'Smart Contracts (Solidity)', 'IPFS (Document Storage)', 'Merkle Proof Audit Trail'],
    purpose: 'Immutable batch provenance, automated certification, and tamper-proof audit trail for KVIC compliance.',
  },
  {
    layer: 'Access Layer', icon: <Smartphone size={18} />, color: 'var(--rose-400)',
    techs: ['React SPA (Beekeeper + Admin)', 'QR Code Consumer Portal', 'REST API (Express.js)', 'Role-Based Access Control'],
    purpose: 'Web dashboard for beekeepers, quality officers, processors, and consumers via QR scan.',
  },
  {
    layer: 'Integration Layer', icon: <Globe size={18} />, color: 'var(--orange-400)',
    techs: ['KVIC Central Registry API', 'FSSAI Compliance Hook', 'NMR Lab LIMS Connector', 'India Post Logistics API'],
    purpose: 'Bridges the platform to government registries, certification bodies, and logistics networks.',
  },
];

const REGIONS = [
  { name: 'Satara', state: 'Maharashtra', hives: 15, status: 'active', lat: 17.68, lng: 74.01 },
  { name: 'Kolhapur', state: 'Maharashtra', hives: 10, status: 'active', lat: 16.70, lng: 74.24 },
  { name: 'Pune', state: 'Maharashtra', hives: 0, status: 'planned', lat: 18.52, lng: 73.85 },
  { name: 'Punjab North', state: 'Punjab', hives: 0, status: 'planned', lat: 31.14, lng: 75.34 },
  { name: 'Punjab South', state: 'Punjab', hives: 0, status: 'planned', lat: 30.90, lng: 75.70 },
  { name: 'Muzaffarpur', state: 'Bihar', hives: 0, status: 'planned', lat: 26.12, lng: 85.36 },
  { name: 'Darbhanga', state: 'Bihar', hives: 0, status: 'planned', lat: 26.16, lng: 86.10 },
  { name: 'Karnataka South', state: 'Karnataka', hives: 0, status: 'planned', lat: 12.97, lng: 77.59 },
  { name: 'Uttarakhand', state: 'Uttarakhand', hives: 0, status: 'planned', lat: 30.06, lng: 79.02 },
  { name: 'Himachal', state: 'Himachal Pradesh', hives: 0, status: 'planned', lat: 31.10, lng: 77.17 },
  { name: 'West Bengal', state: 'West Bengal', hives: 0, status: 'planned', lat: 22.57, lng: 88.36 },
  { name: 'Tamil Nadu', state: 'Tamil Nadu', hives: 0, status: 'planned', lat: 13.08, lng: 80.27 },
];

const COST_MODEL = [
  { item: 'Smart Hive Kit (Sensors + LoRaWAN Node)', unitCost: '₹4,800', subsidized: '₹1,440 (70% KVIC)', units: 500, total: '₹7.2L' },
  { item: 'LoRaWAN Gateway (Dragino LPS8N)', unitCost: '₹12,500', subsidized: 'Full (KVIC infra)', units: 12, total: '₹1.5L' },
  { item: 'NMR Lab Integration (per lab)', unitCost: '₹2,00,000', subsidized: '₹1,00,000 (50%)', units: 3, total: '₹3.0L' },
  { item: 'Cold-Chain Processing Unit', unitCost: '₹5,50,000', subsidized: '₹3,00,000 (55%)', units: 3, total: '₹9.0L' },
  { item: 'Cloud Hosting (AWS/Year)', unitCost: '₹1,80,000', subsidized: 'Full (Platform)', units: 1, total: '₹1.8L' },
  { item: 'QR Label Printing (per 1000)', unitCost: '₹4,500', subsidized: '₹2,000 (44%)', units: 10, total: '₹2.0L' },
];

const PARTNERS = [
  { name: 'KVIC', role: 'Lead Agency', contribution: 'Bee box distribution, subsidy funding, policy framework, cluster registration', icon: <Building2 size={16} /> },
  { name: 'NMR Labs (NBB)', role: 'Quality Verification', contribution: 'Accredited lab testing, NMR purity certification, FSSAI compliance', icon: <FlaskConical size={16} /> },
  { name: 'India Post', role: 'Logistics', contribution: 'Rural last-mile delivery, batch transport, cold-chain relay', icon: <Truck size={16} /> },
  { name: 'TTN (The Things Network)', role: 'Connectivity', contribution: 'LoRaWAN network management, gateway uptime SLA, device onboarding', icon: <Globe size={16} /> },
  { name: 'AWS / MeitY', role: 'Cloud Infrastructure', contribution: 'Hosted cloud environment, AI model training, data sovereignty compliance', icon: <Layers size={16} /> },
  { name: 'State Agriculture Depts', role: 'Regional Ops', contribution: 'Cluster identification, beekeeper onboarding, subsidy disbursement', icon: <Users size={16} /> },
];

function MetricBadge({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '22px', fontWeight: 800, color, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', marginTop: '2px' }}>{label}</div>
    </div>
  );
}

export default function ScaleUp() {
  const [expandedPhase, setExpandedPhase] = useState(1);
  const [expandedTech, setExpandedTech] = useState(null);
  const [showCost, setShowCost] = useState(true);

  return (
    <section className="view-pane active" id="view-scale">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><TrendingUp size={13} /> National KVIC Rollout Framework</div>
        <h2 style={{ fontSize: '30px' }}>Scale-Up & Network Rollout Plan</h2>
        <p className="section-lede">
          Internal planning artifact for phased deployment — pilot → regional → national — with hive/cluster targets, tech stack breakdown, cost model, and institutional partnership map.
        </p>
      </div>

      {/* Summary Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '32px' }}>
        {[
          { label: 'Target Hives', value: '5,000', color: 'var(--emerald-400)' },
          { label: 'Clusters', value: '60', color: 'var(--sky-400)' },
          { label: 'Regions', value: '12 States', color: 'var(--amber-400)' },
          { label: 'Beekeepers', value: '400+', color: 'var(--violet-400)' },
          { label: 'Timeline', value: '36 Mo', color: 'var(--rose-400)' },
        ].map(m => <MetricBadge key={m.label} {...m} />)}
      </div>

      {/* 1. Phased Rollout Timeline */}
      <div style={{ marginBottom: '40px' }}>
        <div className="eyebrow-badge" style={{ marginBottom: '14px' }}>
          <Boxes size={13} /> PHASED ROLLOUT TIMELINE
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {PHASES.map(phase => (
            <div key={phase.id} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
              borderRadius: '12px', overflow: 'hidden',
              borderColor: expandedPhase === phase.id ? phase.color : 'var(--border-subtle)',
            }}>
              <div
                onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px',
                  cursor: 'pointer', userSelect: 'none', flexWrap: 'wrap',
                }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '14px', fontWeight: 800, flexShrink: 0,
                  background: phase.status === 'active' ? phase.color : 'transparent',
                  border: `2px solid ${phase.color}`,
                  color: phase.status === 'active' ? '#0f0b04' : phase.color,
                }}>
                  {phase.id}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700 }}>{phase.title}</span>
                    <span style={{
                      fontSize: '10px', padding: '2px 8px', borderRadius: '999px', fontWeight: 600,
                      background: phase.status === 'active' ? 'var(--emerald-bg)' : phase.status === 'upcoming' ? 'var(--bg-inset)' : 'var(--bg-code)',
                      color: phase.status === 'active' ? 'var(--emerald-400)' : 'var(--text-dim)',
                      border: `1px solid ${phase.status === 'active' ? 'var(--emerald-border)' : 'var(--border-subtle)'}`,
                    }}>
                      {phase.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {phase.period} · {phase.regions}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', marginRight: '10px', flexWrap: 'wrap' }}>
                  <MetricBadge label="Hives" value={phase.hives} color={phase.color} />
                  <MetricBadge label="Clusters" value={phase.clusters} color={phase.color} />
                  <MetricBadge label="Beekeepers" value={phase.beekeepers} color={phase.color} />
                </div>
                {expandedPhase === phase.id ? <ChevronUp size={16} color="var(--text-dim)" /> : <ChevronDown size={16} color="var(--text-dim)" />}
              </div>

              {expandedPhase === phase.id && (
                <div style={{ padding: '0 20px 18px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>KEY DELIVERABLES</div>
                      {phase.deliverables.map((d, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '12.5px' }}>
                          <CheckCircle2 size={14} color={phase.color} style={{ marginTop: '1px', flexShrink: 0 }} />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>SUCCESS KPIs</div>
                      {phase.kpis.map((k, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '12.5px' }}>
                          <span style={{ color: phase.color, fontWeight: 700 }}>→</span>
                          <span>{k}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Timeline bar */}
        <div style={{ marginTop: '14px', display: 'flex', gap: '4px', height: '6px', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ flex: 6, background: 'var(--emerald-400)', borderRadius: '999px 0 0 999px' }} title="Phase 1: Months 0–6" />
          <div style={{ flex: 12, background: 'var(--amber-400)' }} title="Phase 2: Months 6–18" />
          <div style={{ flex: 18, background: 'var(--sky-400)', borderRadius: '0 999px 999px 0' }} title="Phase 3: Months 18–36" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-dim)', marginTop: '4px' }}>
          <span>Month 0</span><span>Month 6</span><span>Month 18</span><span>Month 36</span>
        </div>
      </div>

      {/* 2. Cluster Network Map */}
      <div style={{ marginBottom: '40px' }}>
        <div className="eyebrow-badge" style={{ marginBottom: '14px' }}>
          <MapPin size={13} /> CLUSTER NETWORK MAP
        </div>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: '14px', padding: '20px', position: 'relative', overflow: 'hidden',
        }}>
          <svg viewBox="0 0 600 320" width="100%" height="320">
            {/* India outline */}
            <path d="M180 20 L260 10 L340 15 L420 30 L480 60 L510 100 L520 150 L500 200 L470 240 L420 270 L360 290 L300 300 L240 295 L200 270 L170 240 L150 200 L140 150 L150 100 L160 60 Z"
              fill="none" stroke="var(--border-subtle)" strokeWidth="1.5" opacity="0.4" />
            {/* Grid dots */}
            {Array.from({ length: 15 }).map((_, i) =>
              Array.from({ length: 8 }).map((_, j) => (
                <circle key={`${i}-${j}`} cx={160 + i * 24} cy={30 + j * 35} r="1" fill="var(--border-subtle)" opacity="0.3" />
              ))
            )}
            {/* Region markers */}
            {REGIONS.map((r, i) => {
              const x = 160 + ((r.lng - 73) / 15) * 340;
              const y = 30 + ((32 - r.lat) / 20) * 260;
              const isActive = r.status === 'active';
              return (
                <g key={i}>
                  {isActive && (
                    <>
                      <circle cx={x} cy={y} r="14" fill={r.hives > 0 ? 'var(--emerald-400)' : 'var(--amber-400)'} opacity="0.08" />
                      <circle cx={x} cy={y} r="10" fill={r.hives > 0 ? 'var(--emerald-400)' : 'var(--amber-400)'} opacity="0.15" />
                    </>
                  )}
                  <circle cx={x} cy={y} r="5" fill={isActive ? 'var(--emerald-400)' : 'var(--border-highlight)'} stroke={isActive ? 'var(--emerald-400)' : 'var(--text-dim)'} strokeWidth="1.5" />
                  <text x={x} y={y - 10} fontSize="9" fill={isActive ? 'var(--emerald-400)' : 'var(--text-dim)'} textAnchor="middle" fontWeight={isActive ? 700 : 400}>
                    {r.name}
                  </text>
                  {isActive && r.hives > 0 && (
                    <text x={x} y={y + 16} fontSize="8" fill="var(--text-muted)" textAnchor="middle">
                      {r.hives} hives
                    </text>
                  )}
                </g>
              );
            })}
            {/* Connection lines between active clusters */}
            <line x1="235" y1="195" x2="215" y2="215" stroke="var(--emerald-400)" strokeWidth="1" opacity="0.4" strokeDasharray="3,3" />
          </svg>
          <div style={{ display: 'flex', gap: '16px', marginTop: '10px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald-400)' }} /> Active Cluster
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--border-highlight)' }} /> Planned (Phase 2–3)
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tech Stack Summary */}
      <div style={{ marginBottom: '40px' }}>
        <div className="eyebrow-badge" style={{ marginBottom: '14px' }}>
          <Layers size={13} /> TECH STACK SUMMARY
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {TECH_STACK.map(tech => (
            <div
              key={tech.layer}
              onClick={() => setExpandedTech(expandedTech === tech.layer ? null : tech.layer)}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                borderRadius: '12px', padding: '16px', cursor: 'pointer',
                borderColor: expandedTech === tech.layer ? tech.color : 'var(--border-subtle)',
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ color: tech.color }}>{tech.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>{tech.layer}</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '10px' }}>
                {tech.purpose}
              </p>
              {expandedTech === tech.layer && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {tech.techs.map(t => (
                    <span key={t} style={{
                      fontSize: '10.5px', padding: '3px 8px', borderRadius: '999px',
                      background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)',
                      color: 'var(--text-dim)', fontWeight: 500,
                    }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Cost & Partner Model */}
      <div style={{ marginBottom: '40px' }}>
        <div className="eyebrow-badge" style={{ marginBottom: '14px' }}>
          <IndianRupee size={13} /> COST & PARTNER MODEL
        </div>

        {/* Cost Table */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: '14px', overflow: 'hidden', marginBottom: '16px',
        }}>
          <div
            onClick={() => setShowCost(!showCost)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px', cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Hardware Subsidy Breakdown (Phase 1–2)</span>
            {showCost ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
          {showCost && (
            <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-inset)' }}>
                    {['Item', 'Unit Cost', 'Subsidized', 'Units', 'Total'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COST_MODEL.map((row, i) => (
                    <tr key={i} style={{ borderBottom: i < COST_MODEL.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>{row.item}</td>
                      <td className="mono" style={{ padding: '10px 14px', color: 'var(--text-dim)' }}>{row.unitCost}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--emerald-400)' }}>{row.subsidized}</td>
                      <td className="mono" style={{ padding: '10px 14px', textAlign: 'center' }}>{row.units}</td>
                      <td className="mono" style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--amber-400)' }}>{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '10px 18px', background: 'var(--bg-inset)', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Phase 1–2 Investment</span>
                <span className="mono" style={{ fontWeight: 700, color: 'var(--amber-400)' }}>≈ ₹24.5 Lakhs</span>
              </div>
            </div>
          )}
        </div>

        {/* Partner Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {PARTNERS.map(p => (
            <div key={p.name} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
              borderRadius: '12px', padding: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ color: 'var(--amber-400)' }}>{p.icon}</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>{p.role}</div>
                </div>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{p.contribution}</p>
            </div>
          ))}
        </div>

        {/* KVIC Integration Flow */}
        <div style={{
          marginTop: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: '14px', padding: '18px',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>KVIC INTEGRATION FLOW</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              'KVIC Registers Cluster',
              'Bee Box Distribution',
              'IoT Kit Bundle',
              'Hive Data Flows',
              'Batch On-Chain',
              'Lab NMR Verify',
              'Consumer QR Scan',
              'Subsidy Disbursement',
            ].map((step, i) => (
              <React.Fragment key={i}>
                <div style={{
                  padding: '8px 14px', background: i === 0 ? 'var(--emerald-bg)' : 'var(--bg-inset)',
                  border: `1px solid ${i === 0 ? 'var(--emerald-border)' : 'var(--border-subtle)'}`,
                  borderRadius: '8px', fontSize: '11px', fontWeight: 600, color: i === 0 ? 'var(--emerald-400)' : 'var(--text-main)',
                  whiteSpace: 'nowrap',
                }}>
                  {step}
                </div>
                {i < 7 && <ArrowRight size={14} color="var(--text-dim)" style={{ margin: '0 4px', flexShrink: 0 }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
