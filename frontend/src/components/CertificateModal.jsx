import React from 'react';
import { CheckCircle2, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CertificateModal({ batch: batchProp, onClose }) {
  const { showFullCertModal, setShowFullCertModal } = useApp();

  const isOpen = batchProp ? true : showFullCertModal;
  const close = onClose || (() => setShowFullCertModal(false));
  if (!isOpen) return null;

  const b = batchProp || {};
  const batchId = b.batchId || b.id || 'KVIC-HC-2026-0417';
  const beekeeper = b.beekeeper || b.beekeeperName || 'Ganesh Pawar';
  const hiveId = b.hiveId || 'H001';
  const floralSource = b.floralSource || 'Litchi Blossom';
  const harvestDate = b.harvestDate || '14 Apr 2026';
  const extractionMethod = b.extractionMethod || 'Cold Centrifugal Spin (Raw & Unheated)';
  const quantity = b.quantityKg || b.quantity || '8.4';
  const honeyType = b.batchName || b.honeyType || 'Raw Multifloral Honey';

  const lab = b.checkpoints?.find(c => c.stage === 'QUALITY_VERIFIED');
  const quality = lab?.qualityData || b.qualityTest || {};

  const handleDownload = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>KVIC Certificate — ${batchId}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Plus Jakarta Sans',sans-serif;color:#1f2937;padding:40px;line-height:1.6}
        .header{text-align:center;margin-bottom:28px;padding-bottom:20px;border-bottom:2px solid #d97706}
        .badge{display:inline-block;padding:4px 14px;background:#dcfce7;color:#15803d;border:1px solid #86efac;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.06em;margin-bottom:8px}
        h1{font-size:24px;color:#92400e;margin-bottom:4px}
        h2{font-size:13px;color:#6b7280;font-weight:600}
        .section{margin-bottom:20px;padding:16px;border:1px solid #e5e7eb;border-radius:12px}
        .section-title{font-size:14px;font-weight:700;color:#92400e;margin-bottom:12px;padding-bottom:8px;border-bottom:1px dashed #d1d5db}
        .row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;border-bottom:1px dashed #f3f4f6}
        .row:last-child{border-bottom:none}
        .row span{color:#6b7280}
        .row strong{color:#1f2937}
        .pass{color:#15803d;font-weight:700}
        .footer{text-align:center;margin-top:30px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af}
        @media print{body{padding:20px}}
      </style></head><body>
      <div class="header">
        <div class="badge">✅ KVIC HONEY MISSION VERIFIED</div>
        <h1>Digital Provenance Passport</h1>
        <h2>Certified Single-Apiary Raw Honey • Tamper-Proof Cryptographic Record</h2>
      </div>

      <div class="section">
        <div class="section-title">🔬 Referral Lab Analysis & NMR Purity</div>
        <div class="row"><span>NMR Purity Score:</span><strong class="pass">${quality.purity || quality.nmrPurityScore || '98.6'}% (Pass ≥ 98.0%)</strong></div>
        <div class="row"><span>Moisture Content:</span><strong class="pass">${quality.moisture || quality.moisturePercent || '17.2'}% (Pass ≤ 20.0%)</strong></div>
        <div class="row"><span>C4 Foreign Sugar Test:</span><strong class="pass">${quality.c4Sugar || quality.c4SugarAdulteration || 'NEGATIVE (0.0% Added)'}</strong></div>
        <div class="row"><span>Pollen Dominance:</span><strong>${quality.pollenDominance || '84% Forest Multifloral Pollen'}</strong></div>
        <div class="row"><span>Antibiotics & Heavy Metals:</span><strong class="pass">${quality.antibioticResidues || 'NOT DETECTED (0.0 ppm)'}</strong></div>
        <div class="row"><span>HMF Level:</span><strong class="pass">${quality.hmf || '12.4'} mg/kg (Limit < 40)</strong></div>
      </div>

      <div class="section">
        <div class="section-title">👨‍🌾 Rural Beekeeper Origin</div>
        <div class="row"><span>Beekeeper Name:</span><strong>${beekeeper}</strong></div>
        <div class="row"><span>KVIC Bee Box ID:</span><strong>${hiveId}</strong></div>
        <div class="row"><span>Honey Type:</span><strong>${honeyType}</strong></div>
        <div class="row"><span>Floral Source:</span><strong>${floralSource}</strong></div>
        <div class="row"><span>Harvest Date:</span><strong>${harvestDate}</strong></div>
        <div class="row"><span>Quantity:</span><strong>${quantity} kg</strong></div>
        <div class="row"><span>Extraction Method:</span><strong>${extractionMethod}</strong></div>
      </div>

      <div class="footer">
        CERTIFIED BY KVIC HONEY MISSION • BLOCKCHAIN & IoT PLATFORM<br>
        Certificate ID: KVIC-CERT-${batchId}-${Date.now()}<br>
        Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
      </div>
    </body></html>`;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => { printWindow.print(); };
  };

  return (
    <div className="modal-backdrop-blur" onClick={close}>
      <div className="passport-modal-window" onClick={e => e.stopPropagation()}>
        <button className="btn-close-modal" onClick={close}>✕</button>

        <div className="cert-header">
          <span className="status-beacon" style={{ marginBottom: '8px' }}>
            <CheckCircle2 size={14} /> KVIC HONEY MISSION VERIFIED
          </span>
          <h2>Digital Provenance Passport</h2>
          <p>Certified Single-Apiary Raw Honey • Tamper-Proof Cryptographic Record</p>
        </div>

        {/* Lab Analysis */}
        <div className="cert-section">
          <div className="cert-section-title">🔬 Referral Lab Analysis &amp; NMR Purity</div>
          {[
            ['NMR Purity Score', `${quality.purity || quality.nmrPurityScore || '98.6'}% (Pass ≥ 98.0%)`, true],
            ['Moisture Content', `${quality.moisture || quality.moisturePercent || '17.2'}% (Pass ≤ 20.0%)`, true],
            ['C4 Foreign Sugar Test', `${quality.c4Sugar || quality.c4SugarAdulteration || 'NEGATIVE (0.0% Added)'}`, true],
            ['Pollen Dominance', quality.pollenDominance || '84% Forest Multifloral Pollen', null],
            ['Antibiotics & Heavy Metals', quality.antibioticResidues || 'NOT DETECTED (0.0 ppm)', true],
            ['HMF Level', quality.hmf ? `${quality.hmf} mg/kg (Limit < 40)` : quality.h遊FurfuralHMF || '12.4 mg/kg (Limit < 40)', true],
          ].map(([label, val, isPass]) => (
            <div key={label} className="cert-row">
              <span>{label}:</span>
              <strong style={{ color: isPass === true ? 'var(--emerald-400)' : isPass === false ? '#f87171' : 'var(--text-main)' }}>{val}</strong>
            </div>
          ))}
        </div>

        {/* Beekeeper Origin */}
        <div className="cert-section cert-section--plain">
          <div className="cert-section-title">👨‍🌾 Rural Beekeeper Origin</div>
          {[
            ['Beekeeper Name', beekeeper],
            ['KVIC Bee Box ID', `${hiveId}`],
            ['Honey Type', honeyType],
            ['Floral Source', floralSource],
            ['Harvest Date', harvestDate],
            ['Quantity', `${quantity} kg`],
            ['Extraction Method', extractionMethod],
          ].map(([label, val]) => (
            <div key={label} className="cert-row">
              <span>{label}:</span>
              <strong>{val}</strong>
            </div>
          ))}
        </div>

        <button
          className="btn-luxury btn-luxury-primary btn-block"
          onClick={handleDownload}
        >
          <Download size={16} /> Download PDF Certificate
        </button>
      </div>
    </div>
  );
}
