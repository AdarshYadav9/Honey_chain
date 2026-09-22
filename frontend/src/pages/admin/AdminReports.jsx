import React, { useState, useEffect } from 'react';
import { FileText, Download, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const STATUS_STYLES = {
  ready: { bg: 'var(--emerald-bg)', color: 'var(--emerald-400)', border: 'var(--emerald-border)', icon: <CheckCircle2 size={12} />, label: 'Ready' },
  generating: { bg: 'rgba(251, 191, 36, 0.12)', color: 'var(--amber-400)', border: 'rgba(251, 191, 36, 0.3)', icon: <Clock size={12} />, label: 'Generating' },
  error: { bg: 'var(--rose-bg)', color: 'var(--rose-400)', border: 'var(--rose-border)', icon: <AlertTriangle size={12} />, label: 'Error' },
};

function generateReports(batches) {
  const count = batches.length;
  const now = new Date();
  const period = now.toLocaleString('en-IN', { month: 'short', year: 'numeric' });

  const reports = [
    { id: 'RPT-001', title: 'Monthly Purity Compliance Report', type: 'Compliance', period, status: 'ready', generated: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), batches: count },
    { id: 'RPT-002', title: 'KVIC Quarterly Submission', type: 'KVIC', period: 'Q2 2026', status: count > 0 ? 'ready' : 'generating', generated: count > 0 ? now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—', batches: count },
    { id: 'RPT-003', title: 'Fraud & Counterfeit Summary', type: 'Fraud', period, status: 'ready', generated: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), batches: 0 },
    { id: 'RPT-004', title: 'Hive Health Fleet Report', type: 'Operations', period, status: 'ready', generated: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), batches: 0 },
    { id: 'RPT-005', title: 'Consumer Scan Analytics Report', type: 'Analytics', period, status: 'generating', generated: '—', batches: 0 },
    { id: 'RPT-006', title: 'NMR Lab Test Aggregate', type: 'Compliance', period, status: count > 0 ? 'ready' : 'generating', generated: count > 0 ? now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—', batches: Math.floor(count * 0.7) },
    { id: 'RPT-007', title: 'FSSAI Annual Compliance Bundle', type: 'Compliance', period: 'FY 2025–26', status: 'ready', generated: '31 Mar 2026', batches: count + 1240 },
    { id: 'RPT-008', title: 'Blockchain Audit Trail Export', type: 'Audit', period, status: 'ready', generated: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), batches: count },
  ];

  return reports;
}

function exportReport(report, batches) {
  const now = new Date();
  let csv = '';

  if (report.type === 'Compliance' || report.type === 'KVIC') {
    csv = 'Report ID,Title,Period,Batches,Generated\n';
    csv += `${report.id},"${report.title}",${report.period},${report.batches},${report.generated}\n\n`;
    csv += 'Batch ID,Hive ID,Beekeeper,Honey Type,Quantity (kg),Status,Harvest Date\n';
    batches.forEach(b => {
      csv += `${b.id},${b.hiveId},"${b.beekeeper || 'Unknown'}","${b.honeyType}",${b.quantity},${b.status},${b.harvestDate || ''}\n`;
    });
  } else if (report.type === 'Fraud') {
    csv = 'Report ID,Title,Period,Status\n';
    csv += `${report.id},"${report.title}",${report.period},${report.status}\n\n`;
    csv += 'Rejected Batch ID,Hive ID,Beekeeper,Honey Type,Quantity,Status\n';
    batches.filter(b => b.status === 'REJECTED').forEach(b => {
      csv += `${b.id},${b.hiveId},"${b.beekeeper || 'Unknown'}","${b.honeyType}",${b.quantity},${b.status}\n`;
    });
    if (batches.filter(b => b.status === 'REJECTED').length === 0) csv += 'No rejected batches found.\n';
  } else if (report.type === 'Audit') {
    csv = 'Batch ID,Hive ID,Beekeeper,Honey Type,Quantity,Status,Transaction Count\n';
    batches.forEach(b => {
      csv += `${b.id},${b.hiveId},"${b.beekeeper || 'Unknown'}","${b.honeyType}",${b.quantity},${b.status},${(b.transactions || []).length}\n`;
    });
  } else {
    csv = 'Report ID,Title,Type,Period,Batches,Status,Generated\n';
    csv += `${report.id},"${report.title}",${report.type},${report.period},${report.batches},${report.status},${report.generated}\n`;
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${report.id}_${report.title.replace(/[^a-zA-Z0-9]/g, '_')}_${now.toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminReports() {
  const { sharedBatches } = useApp();
  const [filter, setFilter] = useState('All');
  const [reports, setReports] = useState([]);
  const [exporting, setExporting] = useState(null);

  useEffect(() => {
    setReports(generateReports(sharedBatches));
  }, [sharedBatches]);

  const types = ['All', ...new Set(reports.map(r => r.type))];
  const filtered = filter === 'All' ? reports : reports.filter(r => r.type === filter);

  return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><FileText size={13} /> Compliance &amp; Export</div>
        <h2 style={{ fontSize: '28px' }}>Reports</h2>
        <p className="section-lede">Generate and export compliance reports for KVIC, FSSAI, and regulatory bodies.</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding: '6px 14px', borderRadius: '999px', border: '1px solid var(--border-subtle)',
            background: filter === t ? 'var(--gold-gradient)' : 'transparent',
            color: filter === t ? '#0f0b04' : 'var(--text-dim)',
            fontSize: '12px', fontWeight: 600, cursor: 'pointer',
          }}>{t}</button>
        ))}
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-inset)' }}>
              {['Report', 'Type', 'Period', 'Batches', 'Status', 'Generated', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => {
              const st = STATUS_STYLES[r.status];
              return (
                <tr key={r.id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, fontSize: '12.5px' }}>{r.title}</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>{r.id}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '999px', background: 'var(--bg-inset)', color: 'var(--text-dim)' }}>{r.type}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>{r.period}</td>
                  <td className="mono" style={{ padding: '12px 16px', color: r.batches > 0 ? 'var(--text-main)' : 'var(--text-dim)' }}>{r.batches || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '999px', background: st.bg, color: st.color, border: `1px solid ${st.border}`, fontSize: '11px', fontWeight: 600 }}>
                      {st.icon} {st.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dim)', fontSize: '12px' }}>{r.generated}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {r.status === 'ready' && (
                      <button
                        onClick={() => { setExporting(r.id); exportReport(r, sharedBatches); setTimeout(() => setExporting(null), 1000); }}
                        disabled={exporting === r.id}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 12px', background: exporting === r.id ? 'var(--emerald-bg)' : 'var(--bg-inset)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: exporting === r.id ? 'var(--emerald-400)' : 'var(--amber-400)', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}
                      >
                        <Download size={12} /> {exporting === r.id ? 'Downloaded' : 'Export'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
