import React from 'react';

// Renders a sparkline with Y-axis labels and X-axis time labels
export function renderAxisChart(data, strokeColor, fillColor, unit, minLabel, maxLabel) {
  const w = 320;
  const h = 110;
  const padL = 36;
  const padR = 8;
  const padT = 8;
  const padB = 22;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const mid = (min + max) / 2;

  const pts = data.map((v, i) => {
    const x = padL + (i * chartW) / (data.length - 1);
    const y = padT + chartH - ((v - min) / range) * chartH;
    return { x: x.toFixed(1), y: y.toFixed(1), v };
  });

  const linePts = pts.map(p => `${p.x},${p.y}`).join(' ');
  const areaPts = `${padL},${padT + chartH} ${linePts} ${padL + chartW},${padT + chartH}`;

  // X-axis labels: first, middle, last
  const xLabels = data.length > 2
    ? [
        { x: pts[0].x, text: minLabel || '0h' },
        { x: pts[Math.floor(data.length / 2)].x, text: data.length === 24 ? '12h' : data.length === 7 ? '4D' : '15D' },
        { x: pts[pts.length - 1].x, text: maxLabel || (data.length === 24 ? '24h' : data.length === 7 ? '7D' : '30D') },
      ]
    : [
        { x: pts[0].x, text: minLabel || 'Start' },
        { x: pts[pts.length - 1].x, text: maxLabel || 'End' },
      ];

  // Y-axis labels: min, mid, max
  const yLabels = [
    { y: padT + chartH, text: `${min.toFixed(1)}${unit || ''}` },
    { y: padT + chartH / 2, text: `${mid.toFixed(1)}${unit || ''}` },
    { y: padT, text: `${max.toFixed(1)}${unit || ''}` },
  ];

  return (
    <>
      {/* Grid lines */}
      <line x1={padL} y1={padT} x2={padL + chartW} y2={padT} stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray="3,3" />
      <line x1={padL} y1={padT + chartH / 2} x2={padL + chartW} y2={padT + chartH / 2} stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray="3,3" />
      <line x1={padL} y1={padT + chartH} x2={padL + chartW} y2={padT + chartH} stroke="var(--border-subtle)" strokeWidth="0.5" />

      {/* Area fill */}
      <polygon points={areaPts} fill={fillColor} opacity="0.12" />

      {/* Line */}
      <polyline points={linePts} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* End dot */}
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="3.5" fill={strokeColor} />

      {/* Y-axis labels */}
      {yLabels.map((l, i) => (
        <text key={`y${i}`} x={padL - 6} y={l.y + 3.5} fontSize="9" fill="var(--text-dim)" textAnchor="end" fontFamily="JetBrains Mono">
          {l.text}
        </text>
      ))}

      {/* X-axis labels */}
      {xLabels.map((l, i) => (
        <text key={`x${i}`} x={l.x} y={h - 4} fontSize="9" fill="var(--text-dim)" textAnchor="middle" fontFamily="JetBrains Mono">
          {l.text}
        </text>
      ))}
    </>
  );
}

// Renders a smoothed sparkline polyline + soft area fill (legacy)
export function renderSparkline(data, strokeColor = 'var(--amber-400)', fillColor = 'var(--amber-500)') {
  const w = 320;
  const h = 90;
  const pad = 10;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => {
    const x = pad + (i * (w - 2 * pad)) / (data.length - 1);
    const y = h - pad - ((v - min) / range) * (h - 2 * pad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const areaPts = `${pad},${h - pad} ${pts} ${w - pad},${h - pad}`;

  return (
    <>
      <polyline points={areaPts} fill={fillColor} opacity="0.15" />
      <polyline points={pts} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

// Renders the 4-week AI yield forecast band + line
export function YieldForecastPaths() {
  const w = 400;
  const h = 180;
  const pad = 26;
  const pred = [30, 33.4, 37.1, 41.2];
  const upper = pred.map(v => v + 2.4);
  const lower = pred.map(v => v - 2.4);
  const xAt = i => pad + (i * (w - 2 * pad)) / (pred.length - 1);
  const min = Math.min(...lower);
  const max = Math.max(...upper);
  const range = max - min || 1;
  const yAt = v => h - pad - ((v - min) / range) * (h - 2 * pad);

  const band = `M ${xAt(0)},${yAt(upper[0])} L ${upper.map((v, i) => `${xAt(i)},${yAt(v)}`).join(' L ')} L ${lower.slice().reverse().map((v, i) => `${xAt(pred.length - 1 - i)},${yAt(v)}`).join(' L ')} Z`;
  const line = `M ${xAt(0)},${yAt(pred[0])} L ${pred.map((v, i) => `${xAt(i)},${yAt(v)}`).join(' L ')}`;
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

  return (
    <>
      <path d={band} fill="var(--amber-500)" opacity="0.12" />
      <path d={line} fill="none" stroke="var(--amber-400)" strokeWidth="2.8" />
      {pred.map((v, i) => (
        <circle key={i} cx={xAt(i)} cy={yAt(v)} r="4" fill="var(--amber-400)" />
      ))}
      {labels.map((l, i) => (
        <text key={i} x={xAt(i)} y={h - 6} fontSize="11" fill="var(--text-muted)" textAnchor="middle" fontFamily="JetBrains Mono">
          {l}
        </text>
      ))}
    </>
  );
}
