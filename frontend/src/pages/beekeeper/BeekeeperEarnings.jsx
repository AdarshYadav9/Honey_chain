import React, { useState, useEffect } from 'react';
import { IndianRupee, Wallet, Clock, CheckCircle2, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const RATE_PER_KG = { default: 280 };

const STATUS_MAP = {
  paid: { bg: 'var(--emerald-bg)', color: 'var(--emerald-400)', border: 'var(--emerald-border)', label: 'Paid' },
  pending: { bg: 'rgba(251, 191, 36, 0.12)', color: 'var(--amber-400)', border: 'rgba(251, 191, 36, 0.3)', label: 'Pending' },
};

export default function BeekeeperEarnings() {
  const { sharedBatches } = useApp();
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    const myBatches = sharedBatches.filter(b =>
      b.status === 'PACKAGED' || b.status === 'PROCESSED' || b.status === 'QUALITY_VERIFIED'
    );

    const items = myBatches.map(batch => {
      const rate = RATE_PER_KG.default;
      const total = Math.round(batch.quantity * rate);
      const isPaid = batch.status === 'PACKAGED';
      const txHash = isPaid ? `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}` : '—';

      return {
        batch: batch.id,
        date: batch.harvestDate ? new Date(batch.harvestDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
        qty: `${batch.quantity} kg`,
        rate: `₹${rate}/kg`,
        total: `₹${total.toLocaleString('en-IN')}`,
        totalNum: total,
        status: isPaid ? 'paid' : 'pending',
        txHash,
      };
    });

    setEarnings(items);
  }, [sharedBatches]);

  const totalEarned = earnings.filter(e => e.status === 'paid').reduce((s, e) => s + e.totalNum, 0);
  const pendingAmount = earnings.filter(e => e.status === 'pending').reduce((s, e) => s + e.totalNum, 0);

  return (
    <section className="view-pane active">
      <div className="flow-title-row">
        <div className="eyebrow-badge"><IndianRupee size={13} /> Earnings &amp; Payments</div>
        <h2 style={{ fontSize: '28px' }}>My Earnings</h2>
        <p className="section-lede">Payments linked to verified batches sold through the platform.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Total Earned', value: `₹${totalEarned.toLocaleString('en-IN')}`, icon: <Wallet size={20} />, color: 'var(--emerald-400)', bg: 'var(--emerald-bg)' },
          { label: 'Pending Payout', value: `₹${pendingAmount.toLocaleString('en-IN')}`, icon: <Clock size={20} />, color: 'var(--amber-400)', bg: 'rgba(251, 191, 36, 0.12)' },
          { label: 'Total Batches', value: earnings.length, icon: <CheckCircle2 size={20} />, color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.12)' },
        ].map(card => (
          <div key={card.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: card.bg, color: card.color }}>{card.icon}</div>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{card.label}</span>
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', fontSize: '13px', fontWeight: 700 }}>Payment History</div>
        {earnings.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>
            No earnings yet. Sell batches to see payments here.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-inset)' }}>
                {['Batch', 'Date', 'Quantity', 'Rate', 'Total', 'Status', 'Tx Hash'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-dim)', fontSize: '11px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {earnings.map(e => {
                const st = STATUS_MAP[e.status];
                return (
                  <tr key={e.batch} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '10px 16px', fontWeight: 600 }}>{e.batch}</td>
                    <td style={{ padding: '10px 16px', color: 'var(--text-muted)' }}>{e.date}</td>
                    <td style={{ padding: '10px 16px' }}>{e.qty}</td>
                    <td style={{ padding: '10px 16px' }}>{e.rate}</td>
                    <td style={{ padding: '10px 16px', fontWeight: 700, color: 'var(--emerald-400)' }}>{e.total}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '999px', background: st.bg, color: st.color, border: `1px solid ${st.border}`, fontSize: '11px', fontWeight: 600 }}>{st.label}</span>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      {e.txHash !== '—' ? (
                        <span className="mono" style={{ fontSize: '11px', color: 'var(--amber-400)', cursor: 'pointer' }}>
                          {e.txHash} <ExternalLink size={10} style={{ verticalAlign: 'middle' }} />
                        </span>
                      ) : <span style={{ color: 'var(--text-dim)' }}>—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
