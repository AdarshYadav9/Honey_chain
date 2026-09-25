import React from 'react';

export function BeeMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="#F5B800" />
      <circle cx="24" cy="24" r="23" stroke="#C8860A" strokeWidth="1.5" />
      {/* wings */}
      <ellipse cx="16.5" cy="16" rx="7" ry="4.6" transform="rotate(-32 16.5 16)" fill="#FFFDF6" opacity="0.9" stroke="#C8860A" strokeWidth="1" />
      <ellipse cx="31.5" cy="16" rx="7" ry="4.6" transform="rotate(32 31.5 16)" fill="#FFFDF6" opacity="0.9" stroke="#C8860A" strokeWidth="1" />
      {/* body */}
      <ellipse cx="24" cy="27" rx="9.5" ry="11" fill="#1E1A0F" />
      <path d="M15.2 23.5h17.6M15.8 28.2h16.4M17.6 32.7h12.8" stroke="#F5B800" strokeWidth="2.6" strokeLinecap="round" />
      {/* antennae */}
      <path d="M21 15.5c-1.4-2.2-3.4-3.2-5.4-3.4M27 15.5c1.4-2.2 3.4-3.2 5.4-3.4" stroke="#1E1A0F" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="15.2" cy="11.8" r="1.5" fill="#1E1A0F" />
      <circle cx="32.8" cy="11.8" r="1.5" fill="#1E1A0F" />
    </svg>
  );
}

export function HeroJar() {
  return (
    <svg className="lp-jar-svg" viewBox="0 0 240 280" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="honeyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7C948" />
          <stop offset="55%" stopColor="#F5B800" />
          <stop offset="100%" stopColor="#C8860A" />
        </linearGradient>
        <linearGradient id="glassG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="lidG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5A4A2A" />
          <stop offset="100%" stopColor="#1E1A0F" />
        </linearGradient>
        <radialGradient id="jarShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1E1A0F" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#1E1A0F" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="262" rx="86" ry="14" fill="url(#jarShadow)" />
      {/* jar body */}
      <path d="M62 96c0-14 10-24 24-26h68c14 2 24 12 24 26v120c0 20-14 34-34 34H96c-20 0-34-14-34-34V96z" fill="url(#honeyG)" />
      <path d="M62 96c0-14 10-24 24-26h68c14 2 24 12 24 26v120c0 20-14 34-34 34H96c-20 0-34-14-34-34V96z" fill="url(#glassG)" />
      <path d="M62 96c0-14 10-24 24-26h68c14 2 24 12 24 26v120c0 20-14 34-34 34H96c-20 0-34-14-34-34V96z" stroke="#C8860A" strokeWidth="3" />
      {/* highlight */}
      <path d="M78 92c-2 10-3 24-3 40v70" stroke="#FFFFFF" strokeOpacity="0.65" strokeWidth="9" strokeLinecap="round" />
      {/* label */}
      <rect x="80" y="128" width="80" height="72" rx="12" fill="#FFFDF6" stroke="#C8860A" strokeWidth="2" />
      <path d="M120 140l14 8v16l-14 8-14-8v-16l14-8z" fill="#F5B800" stroke="#1E1A0F" strokeWidth="1.6" />
      <path d="M120 146v18M112 151h16M112 159h16" stroke="#1E1A0F" strokeWidth="1.4" />
      <rect x="94" y="180" width="52" height="5" rx="2.5" fill="#C8860A" opacity="0.75" />
      <rect x="102" y="190" width="36" height="4" rx="2" fill="#5A4A2A" opacity="0.55" />
      {/* lid */}
      <rect x="74" y="52" width="92" height="26" rx="10" fill="url(#lidG)" />
      <rect x="86" y="40" width="68" height="18" rx="8" fill="#1E1A0F" />
      <rect x="90" y="44" width="60" height="5" rx="2.5" fill="#F5B800" opacity="0.5" />
      {/* dipper */}
      <g transform="rotate(24 196 96)">
        <rect x="190" y="30" width="9" height="90" rx="4.5" fill="#C8860A" />
        <circle cx="194.5" cy="126" r="12" fill="#F5B800" stroke="#C8860A" strokeWidth="2" />
        <circle cx="194.5" cy="146" r="9" fill="#F5B800" stroke="#C8860A" strokeWidth="2" />
        <path d="M186 118h17" stroke="#C8860A" strokeWidth="2.4" strokeLinecap="round" />
      </g>
      {/* honey drip off rim */}
      <path d="M150 90c4 8 6 14 6 20a6 6 0 1 1-12 0c0-6 2-12 6-20z" fill="#F5B800" stroke="#C8860A" strokeWidth="1.5" />
    </svg>
  );
}

export function HeroScene() {
  return (
    <svg className="lp-scene-svg" viewBox="0 0 520 560" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="hscGlow" cx="50%" cy="46%" r="50%">
          <stop offset="0%" stopColor="#F5B800" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#F5B800" stopOpacity="0.09" />
          <stop offset="100%" stopColor="#F5B800" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hscHoney" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F9C94B" />
          <stop offset="45%" stopColor="#F5B223" />
          <stop offset="100%" stopColor="#BC7A12" />
        </linearGradient>
        <linearGradient id="hscGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id="hscGlint" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hscLid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5A452B" />
          <stop offset="45%" stopColor="#2E2413" />
          <stop offset="100%" stopColor="#17120A" />
        </linearGradient>
        <linearGradient id="hscWood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9A6731" />
          <stop offset="100%" stopColor="#5F3F1C" />
        </linearGradient>
        <linearGradient id="hscStone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EAE0C9" />
          <stop offset="100%" stopColor="#D6C8A9" />
        </linearGradient>
        <clipPath id="hscClip">
          <path d="M226 148C226 140 232 134 240 132H280C288 134 294 140 294 148V172C294 186 318 196 322 214V414C322 448 300 464 274 466H246C220 464 198 448 198 414V214C202 196 226 186 226 172Z" />
        </clipPath>
      </defs>

      {/* studio glow behind the jar */}
      <ellipse cx="262" cy="300" rx="230" ry="225" fill="url(#hscGlow)" />

      {/* honeycomb outlines — whisper subtle */}
      <path d="M118 262l22 13v26l-22 13-22-13v-26l22-13z" stroke="#C8860A" strokeWidth="1.6" opacity="0.16" />
      <path d="M148 196l16 10v19l-16 10-16-10v-19l16-10z" stroke="#C8860A" strokeWidth="1.4" opacity="0.12" />
      <path d="M428 236l20 12v24l-20 12-20-12v-24l20-12z" stroke="#C8860A" strokeWidth="1.6" opacity="0.15" />

      {/* stone surface */}
      <path d="M30 488C110 468 400 468 492 492V536C390 552 130 552 30 536Z" fill="url(#hscStone)" />
      <path d="M30 488C110 468 400 468 492 492V502C392 518 128 518 30 502Z" fill="#FFFFFF" opacity="0.25" />

      {/* ground shadows */}
      <ellipse cx="262" cy="474" rx="136" ry="20" fill="#1E1709" opacity="0.14" />
      <ellipse cx="120" cy="484" rx="52" ry="9" fill="#1E1709" opacity="0.08" />

      {/* honeycomb behind jar */}
      <path d="M196 96l34 20v40l-34 20-34-20v-40l34-20z" stroke="#C8860A" strokeWidth="1.8" opacity="0.15" />

      {/* dipper — wood handled honey dipper leaning from lower-left */}
      <g transform="rotate(-24 118 480)">
        <rect x="112" y="300" width="12" height="182" rx="6" fill="url(#hscWood)" />
        <circle cx="118" cy="468" r="15" fill="url(#hscHoney)" stroke="#C8860A" strokeWidth="1.6" />
        <circle cx="118" cy="490" r="11" fill="url(#hscHoney)" stroke="#C8860A" strokeWidth="1.6" />
        <path d="M118 501c0 0 3 8 3 13" stroke="#F5B800" strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="121" cy="516" r="3.4" fill="#F5B800" />
        <path d="M106 466h24z" fill="#FFFFFF" opacity="0" />
      </g>

      {/* honey pool on the stone */}
      <path d="M306 474c0-8 6-13 15-13s15 5 15 13c0 5-6 7-15 7s-15-2-15-7z" fill="#F5B800" opacity="0.5" />
      <path d="M318 468c0-3 2-5 5-5s5 2 5 5" fill="#C8860A" opacity="0.7" />

      {/* ---------- JAR ---------- */}
      <g>
        {/* jar body (glass) */}
        <path
          className="lp-scene-jar"
          d="M226 148C226 140 232 134 240 132H280C288 134 294 140 294 148V172C294 186 318 196 322 214V414C322 448 300 464 274 466H246C220 464 198 448 198 414V214C202 196 226 186 226 172Z"
          fill="#F7E7BF"
        />

        <g clipPath="url(#hscClip)">
          {/* honey fill */}
          <rect x="190" y="206" width="145" height="270" fill="url(#hscHoney)" />
          {/* honey surface sheen */}
          <rect x="190" y="206" width="145" height="9" fill="#FBE7A6" opacity="0.9" />
          {/* air-gap glass tint above honey */}
          <rect x="190" y="128" width="145" height="80" fill="#F9EAC9" opacity="0.55" />
          {/* soft bubbles in the honey */}
          <circle cx="240" cy="250" r="3" fill="#FFFFFF" opacity="0.22" />
          <circle cx="258" cy="284" r="2" fill="#FFFFFF" opacity="0.18" />
          <circle cx="236" cy="320" r="2.4" fill="#FFFFFF" opacity="0.2" />
          <circle cx="278" cy="356" r="2" fill="#FFFFFF" opacity="0.16" />
          {/* inner side shade (right) for depth */}
          <rect x="308" y="140" width="16" height="326" fill="#8A5A10" opacity="0.22" />
          {/* front glass gradient overlay */}
          <rect x="196" y="132" width="128" height="334" fill="url(#hscGlass)" />
        </g>

        {/* left vertical highlight */}
        <path d="M204 176c-2 10-3 24-3 40v190" stroke="url(#hscGlint)" strokeWidth="10" strokeLinecap="round" />
        {/* shoulder sheen */}
        <ellipse cx="238" cy="182" rx="26" ry="12" fill="#FFFFFF" opacity="0.28" />
        {/* rim light bottom */}
        <path d="M208 440c12 16 34 24 54 24 22 0 42-8 52-22" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="2" fill="none" />

        {/* neck collar */}
        <rect x="222" y="128" width="76" height="24" rx="7" fill="#FBF0CF" stroke="#C8860A" strokeWidth="1.4" opacity="0.9" />
        <rect x="224" y="130" width="4" height="20" fill="#FFFFFF" opacity="0.7" />

        {/* honey drip on the rim */}
        <path d="M214 160c-1 9 1 19 5 26 2 4 5 6 7 6s5-2 7-6c4-7 6-17 5-26z" fill="#F5B800" />
        <path d="M224 184c2-4 5-7 9-8M225 192c3-2 4-3 5-5" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="2.4" strokeLinecap="round" />

        {/* label */}
        <g>
          <rect x="212" y="268" width="96" height="96" rx="12" fill="#FFFDF6" stroke="#C8860A" strokeWidth="1.4" />
          <rect x="216" y="272" width="88" height="88" rx="9" fill="none" stroke="#C8860A" strokeOpacity="0.35" strokeWidth="0.8" />
          <path d="M260 302l-9 5.2v-10.4L260 292l9 4.8V307.2z" fill="#F5B800" stroke="#1A1508" strokeWidth="1" />
          <path d="M260 298.4v8.6M254 301.6h12M254 305.4h12" stroke="#1A1508" strokeWidth="0.9" />
          <path d="M233 318h54" stroke="#C8860A" strokeWidth="1" opacity="0.5" />
          <path d="M233 326h54" stroke="#C8860A" strokeWidth="1" opacity="0.5" />
        </g>

        {/* lid */}
        <rect x="220" y="100" width="80" height="12" rx="6" fill="#F0E3C2" opacity="0.2" />
        <rect x="218" y="98" width="84" height="30" rx="10" fill="url(#hscLid)" stroke="#17120A" strokeWidth="1" />
        <path d="M220 104c18 4 42 4 60-2" stroke="#FFFFFF" strokeOpacity="0.09" strokeWidth="3" strokeLinecap="round" fill="none" />
        <rect x="240" y="78" width="40" height="22" rx="8" fill="#241C10" stroke="#0E0B05" strokeWidth="1" />
        <rect x="248" y="84" width="24" height="3" rx="1.5" fill="#C8860A" opacity="0.55" />
        {/* floating honey drop */}
        <path d="M380 148c0 0 10 14 10 22a10 10 0 1 1-20 0c0-8 10-22 10-22z" fill="#F5B800" opacity="0.85" />
        <path d="M377 160c0-4 3-8 5-11" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* leaves — bottom left */}
      <path d="M128 486c-10-26-2-52 26-72 8 18 10 38 4 58-12 6-20 10-30 14z" fill="#7D9150" stroke="#5F6F3A" strokeWidth="1.8" />
      <path d="M132 478c12-16 20-30 22-44" stroke="#5F6F3A" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M150 492c-4-24 6-44 26-58 10 14 15 30 12 48-12 4-22 6-38 10z" fill="#8A9D5B" stroke="#5F6F3A" strokeWidth="1.6" />
      {/* leaves — bottom right */}
      <path d="M368 478c4-26-6-48-28-64-9 17-13 36-9 56 11 3 22 5 37 8z" fill="#7D9150" stroke="#5F6F3A" strokeWidth="1.8" />
      <path d="M376 468c-14-14-24-28-32-44" stroke="#5F6F3A" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M396 484c10-24 24-40 44-50 6 19 6 38 0 56-15 0-28-2-44-6z" fill="#8A9D5B" stroke="#5F6F3A" strokeWidth="1.6" />

      {/* white flowers */}
      <g>
        <circle cx="418" cy="452" r="2.4" fill="#FFFDF6" />
        <circle cx="426" cy="448" r="2.4" fill="#FFFDF6" />
        <circle cx="424" cy="457" r="2.4" fill="#FFFDF6" />
        <circle cx="430" cy="454" r="1.6" fill="#F5B800" />
        <circle cx="404" cy="466" r="2.2" fill="#FFFDF6" />
        <circle cx="412" cy="463" r="2.2" fill="#FFFDF6" />
        <circle cx="408" cy="470" r="2.2" fill="#FFFDF6" />
        <circle cx="414" cy="467" r="1.5" fill="#F5B800" />
      </g>
    </svg>
  );
}

export function ProductJar({ tone = '#F5B800', deep = '#C8860A' }) {
  const gid = `pj-${deep.replace('#', '')}`;
  return (
    <svg viewBox="0 0 140 160" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tone} />
          <stop offset="100%" stopColor={deep} />
        </linearGradient>
        <radialGradient id={`${gid}-s`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1E1A0F" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#1E1A0F" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="70" cy="150" rx="48" ry="8" fill={`url(#${gid}-s)`} />
      <path d="M36 54c0-8 6-14 14-15h40c8 1 14 7 14 15v70c0 12-8 20-20 20H56c-12 0-20-8-20-20V54z" fill={`url(#${gid})`} />
      <path d="M36 54c0-8 6-14 14-15h40c8 1 14 7 14 15v70c0 12-8 20-20 20H56c-12 0-20-8-20-20V54z" fill="#FFFFFF" fillOpacity="0.18" />
      <path d="M36 54c0-8 6-14 14-15h40c8 1 14 7 14 15v70c0 12-8 20-20 20H56c-12 0-20-8-20-20V54z" stroke={deep} strokeWidth="2.4" />
      <path d="M47 52c-1.4 7-2 15-2 24v38" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="5.5" strokeLinecap="round" />
      <rect x="46" y="72" width="48" height="42" rx="8" fill="#FFFDF6" stroke={deep} strokeWidth="1.6" />
      <path d="M70 80l9 5v10l-9 5-9-5V85l9-5z" fill={tone} stroke="#1E1A0F" strokeWidth="1.2" />
      <rect x="54" y="104" width="32" height="3.5" rx="1.75" fill={deep} opacity="0.8" />
      <rect x="44" y="27" width="52" height="15" rx="6" fill="#1E1A0F" />
      <rect x="50" y="19" width="40" height="11" rx="5" fill="#5A4A2A" />
      <rect x="53" y="22" width="34" height="3" rx="1.5" fill={tone} opacity="0.6" />
    </svg>
  );
}

export function FloatBee() {
  return (
    <svg viewBox="0 0 64 56" fill="none" aria-hidden="true">
      <ellipse cx="22" cy="16" rx="12" ry="7" transform="rotate(-28 22 16)" fill="#FFFDF6" stroke="#C8860A" strokeWidth="1.6" opacity="0.95" />
      <ellipse cx="42" cy="16" rx="12" ry="7" transform="rotate(28 42 16)" fill="#FFFDF6" stroke="#C8860A" strokeWidth="1.6" opacity="0.95" />
      <ellipse cx="32" cy="32" rx="15" ry="17" fill="#F5B800" stroke="#1E1A0F" strokeWidth="2" />
      <path d="M18 27h28M18.5 34h27M21 41h22" stroke="#1E1A0F" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M27 15c-2-4-5.5-6-9-6.5M37 15c2-4 5.5-6 9-6.5" stroke="#1E1A0F" strokeWidth="2" strokeLinecap="round" />
      <circle cx="17" cy="8" r="2.4" fill="#1E1A0F" />
      <circle cx="47" cy="8" r="2.4" fill="#1E1A0F" />
      <circle cx="27" cy="28" r="2" fill="#1E1A0F" />
      <circle cx="37" cy="28" r="2" fill="#1E1A0F" />
    </svg>
  );
}

export function FloatHex({ filled = true }) {
  return (
    <svg viewBox="0 0 56 60" fill="none" aria-hidden="true">
      <path d="M28 2l23 14v28L28 58 5 44V16L28 2z" fill={filled ? '#F5B800' : 'none'} fillOpacity={filled ? 0.9 : 0} stroke="#C8860A" strokeWidth="3" />
      {filled && <path d="M28 16l11 7v14l-11 7-11-7V23l11-7z" fill="#FFFDF6" opacity="0.5" />}
    </svg>
  );
}

export function FloatDrip() {
  return (
    <svg viewBox="0 0 40 64" fill="none" aria-hidden="true">
      <path d="M20 4c0 0 14 20 14 34a14 14 0 1 1-28 0C6 24 20 4 20 4z" fill="#F5B800" stroke="#C8860A" strokeWidth="2.5" />
      <path d="M14 36c0-6 2.5-12 5-17" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function FloatLeaf() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M56 8C30 8 10 22 8 48c0 4 1 7 1 7s26 2 40-14C63 25 56 8 56 8z" fill="#8A9A5B" stroke="#5F6F3A" strokeWidth="2.2" />
      <path d="M12 52C24 36 38 24 52 14" stroke="#5F6F3A" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M24 44c4-6 8-10 14-14M32 50c3-8 8-14 14-19" stroke="#5F6F3A" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export function FloatPollen() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="16" cy="18" r="9" fill="#E6A817" />
      <circle cx="32" cy="26" r="7" fill="#F5B800" />
      <circle cx="22" cy="36" r="5" fill="#C8860A" />
      <circle cx="13" cy="15" r="2.5" fill="#FFF3C4" />
      <circle cx="29" cy="23" r="2" fill="#FFF3C4" />
    </svg>
  );
}

export function BannerDrizzle() {
  return (
    <svg viewBox="0 0 160 320" fill="none" aria-hidden="true">
      <path d="M60-10c0 0 8 40 8 70 0 22-10 34-10 56 0 26 18 36 18 66 0 24-12 38-12 62 0 20 8 34 8 34" stroke="#F5B800" strokeWidth="26" strokeLinecap="round" opacity="0.22" />
      <path d="M60-10c0 0 8 40 8 70 0 22-10 34-10 56 0 26 18 36 18 66 0 24-12 38-12 62 0 20 8 34 8 34" stroke="#F5B800" strokeWidth="12" strokeLinecap="round" opacity="0.75" />
      <path d="M110-10c0 30 14 44 14 72 0 24-16 34-16 60 0 28 20 40 20 70" stroke="#C8860A" strokeWidth="16" strokeLinecap="round" opacity="0.3" />
      <circle cx="76" cy="300" r="16" fill="#F5B800" opacity="0.85" />
      <circle cx="70" cy="294" r="5" fill="#FFFFFF" fillOpacity="0.45" />
      <path d="M40 250c0-10 8-18 18-18" stroke="#F5B800" strokeWidth="8" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

export function BannerComb() {
  const hex = (x, y, s, o) => (
    <path key={`${x}-${y}`} d={`M${x + s / 2} ${y} L${x + s * 0.93} ${y + s * 0.25} L${x + s * 0.93} ${y + s * 0.75} L${x + s / 2} ${y + s} L${x + s * 0.07} ${y + s * 0.75} L${x + s * 0.07} ${y + s * 0.25} Z`} fill="#F5B800" fillOpacity={o} stroke="#F5B800" strokeOpacity="0.5" strokeWidth="2" />
  );
  return (
    <svg viewBox="0 0 240 260" fill="none" aria-hidden="true">
      {hex(10, 40, 70, 0.28)}
      {hex(78, 0, 70, 0.18)}
      {hex(78, 80, 70, 0.34)}
      {hex(146, 40, 70, 0.22)}
      {hex(10, 120, 70, 0.16)}
      {hex(146, 120, 70, 0.3)}
      {hex(78, 160, 70, 0.2)}
      {hex(44, 200, 70, 0.26)}
      {hex(112, 200, 70, 0.14)}
    </svg>
  );
}

export function ProcessScene() {
  return (
    <svg viewBox="0 0 560 460" fill="none" aria-hidden="true" className="lp-process-svg">
      <defs>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBEBC4" />
          <stop offset="100%" stopColor="#F3D9A0" />
        </linearGradient>
        <linearGradient id="hillG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9AAF63" />
          <stop offset="100%" stopColor="#7A8F4E" />
        </linearGradient>
        <clipPath id="sceneClip">
          <rect x="0" y="0" width="560" height="460" rx="32" />
        </clipPath>
      </defs>
      <g clipPath="url(#sceneClip)">
        <rect width="560" height="460" fill="url(#skyG)" />
        <circle cx="452" cy="86" r="52" fill="#F5B800" opacity="0.9" />
        <circle cx="452" cy="86" r="70" stroke="#F5B800" strokeOpacity="0.35" strokeWidth="3" />
        <path d="M0 300c90-46 170-52 280-18 90 28 170 24 280-20v198H0V300z" fill="url(#hillG)" />
        <path d="M0 350c120-30 220-24 330 8 80 24 150 20 230-6v108H0V350z" fill="#6C7F45" opacity="0.55" />
        {/* hive boxes */}
        <g>
          <rect x="96" y="238" width="120" height="34" rx="6" fill="#F5B800" stroke="#1E1A0F" strokeWidth="3" />
          <rect x="90" y="270" width="132" height="36" rx="6" fill="#E6A817" stroke="#1E1A0F" strokeWidth="3" />
          <rect x="84" y="304" width="144" height="38" rx="6" fill="#F5B800" stroke="#1E1A0F" strokeWidth="3" />
          <rect x="138" y="318" width="36" height="12" rx="6" fill="#1E1A0F" />
          <rect x="78" y="224" width="156" height="20" rx="8" fill="#5A4A2A" stroke="#1E1A0F" strokeWidth="3" />
        </g>
        {/* beekeeper */}
        <g>
          <path d="M356 460v-96c0-26 16-44 42-44s42 18 42 44v96" fill="#FFFDF6" stroke="#1E1A0F" strokeWidth="3.5" />
          <path d="M370 372h56M366 400h64M362 428h72" stroke="#C8860A" strokeWidth="3" opacity="0.7" />
          <circle cx="398" cy="288" r="34" fill="#F0D9B5" stroke="#1E1A0F" strokeWidth="3.5" />
          <path d="M356 274h84c6 0 10 4 10 10v6H346v-6c0-6 4-10 10-10z" fill="#F5B800" stroke="#1E1A0F" strokeWidth="3.5" />
          <ellipse cx="398" cy="256" rx="46" ry="16" fill="#F5B800" stroke="#1E1A0F" strokeWidth="3.5" />
          <path d="M378 300c6 8 14 12 20 12s14-4 20-12" stroke="#1E1A0F" strokeWidth="3" strokeLinecap="round" />
          {/* arm + frame */}
          <path d="M358 350c-24 6-44 22-52 44" stroke="#1E1A0F" strokeWidth="12" strokeLinecap="round" />
          <rect x="268" y="378" width="58" height="46" rx="6" fill="#FFFDF6" stroke="#1E1A0F" strokeWidth="3" transform="rotate(-14 297 401)" />
          <path d="M276 392h40M274 402h42M276 412h36" stroke="#C8860A" strokeWidth="2.5" transform="rotate(-14 297 401)" />
        </g>
        {/* bees + flight paths */}
        <path d="M250 160c40-30 90-20 110 10" stroke="#1E1A0F" strokeWidth="2" strokeDasharray="5 8" strokeLinecap="round" opacity="0.4" />
        <path d="M180 120c-30 20-30 60 6 76" stroke="#1E1A0F" strokeWidth="2" strokeDasharray="5 8" strokeLinecap="round" opacity="0.4" />
        <g>
          <ellipse cx="252" cy="158" rx="8" ry="5" transform="rotate(-24 252 158)" fill="#FFFDF6" stroke="#1E1A0F" strokeWidth="1.4" />
          <ellipse cx="264" cy="156" rx="8" ry="5" transform="rotate(24 264 156)" fill="#FFFDF6" stroke="#1E1A0F" strokeWidth="1.4" />
          <ellipse cx="258" cy="166" rx="9" ry="10" fill="#F5B800" stroke="#1E1A0F" strokeWidth="1.6" />
          <path d="M250 163h16M251 168h14" stroke="#1E1A0F" strokeWidth="2" strokeLinecap="round" />
        </g>
        <g>
          <ellipse cx="176" cy="116" rx="7" ry="4.5" transform="rotate(-24 176 116)" fill="#FFFDF6" stroke="#1E1A0F" strokeWidth="1.4" />
          <ellipse cx="187" cy="114" rx="7" ry="4.5" transform="rotate(24 187 114)" fill="#FFFDF6" stroke="#1E1A0F" strokeWidth="1.4" />
          <ellipse cx="181" cy="123" rx="8" ry="9" fill="#F5B800" stroke="#1E1A0F" strokeWidth="1.6" />
          <path d="M174 121h14M175 126h12" stroke="#1E1A0F" strokeWidth="1.8" strokeLinecap="round" />
        </g>
        {/* flowers */}
        <g fill="#E67E22">
          <circle cx="40" cy="420" r="7" /><circle cx="54" cy="430" r="7" /><circle cx="28" cy="432" r="7" /><circle cx="42" cy="440" r="7" />
          <circle cx="510" cy="428" r="7" /><circle cx="524" cy="438" r="7" /><circle cx="498" cy="440" r="7" />
        </g>
        <circle cx="42" cy="430" r="5" fill="#F5B800" />
        <circle cx="510" cy="436" r="5" fill="#F5B800" />
      </g>
      <rect x="1.5" y="1.5" width="557" height="457" rx="31" stroke="#C8860A" strokeOpacity="0.35" strokeWidth="3" />
    </svg>
  );
}

export function CommitArt() {
  const hex = (x, y, s, fill, o) => (
    <path key={`${x}-${y}-${fill}`} d={`M${x + s / 2} ${y} L${x + s * 0.93} ${y + s * 0.25} L${x + s * 0.93} ${y + s * 0.75} L${x + s / 2} ${y + s} L${x + s * 0.07} ${y + s * 0.75} L${x + s * 0.07} ${y + s * 0.25} Z`} fill={fill} fillOpacity={o} stroke="#C8860A" strokeWidth="2.5" />
  );
  return (
    <svg viewBox="0 0 420 240" fill="none" aria-hidden="true" className="lp-commit-svg">
      <defs>
        <linearGradient id="dripG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7C948" />
          <stop offset="100%" stopColor="#C8860A" />
        </linearGradient>
        <radialGradient id="commitShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1E1A0F" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#1E1A0F" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="210" cy="222" rx="150" ry="16" fill="url(#commitShadow)" />
      {hex(40, 30, 78, '#F5B800', 0.95)}
      {hex(116, -10, 78, '#F7C948', 0.9)}
      {hex(116, 70, 78, '#E6A817', 0.95)}
      {hex(192, 30, 78, '#F5B800', 0.85)}
      {hex(268, 70, 78, '#C8860A', 0.9)}
      {hex(268, -10, 78, '#F7C948', 0.8)}
      {hex(344, 30, 78, '#F5B800', 0.9)}
      {/* comb cells */}
      <path d="M155 108l19 11v22l-19 11-19-11v-22l19-11z" fill="#FFFDF6" fillOpacity="0.45" stroke="#C8860A" strokeWidth="2" />
      <path d="M231 68l19 11v22l-19 11-19-11V79l19-11z" fill="#FFFDF6" fillOpacity="0.45" stroke="#C8860A" strokeWidth="2" />
      {/* drizzle */}
      <path d="M90 150c0 22 14 34 14 56 0 14-10 24-10 24" stroke="url(#dripG)" strokeWidth="14" strokeLinecap="round" />
      <path d="M330 152c0 18 12 28 12 46 0 12-8 20-8 20" stroke="url(#dripG)" strokeWidth="11" strokeLinecap="round" />
      <path d="M94 236a10 10 0 1 1-20 0c0-6 4-14 10-22 6 8 10 16 10 22z" fill="#F5B800" stroke="#C8860A" strokeWidth="2" />
      <path d="M334 226a9 9 0 1 1-18 0c0-5 4-12 9-19 5 7 9 14 9 19z" fill="#F5B800" stroke="#C8860A" strokeWidth="2" />
      {/* nut / seed accents */}
      <ellipse cx="60" cy="200" rx="14" ry="18" fill="#8A5A2B" stroke="#5A3A18" strokeWidth="2.5" transform="rotate(-18 60 200)" />
      <path d="M54 190c4 6 6 14 5 22" stroke="#5A3A18" strokeWidth="2" transform="rotate(-18 60 200)" />
      <ellipse cx="376" cy="196" rx="13" ry="17" fill="#A9713A" stroke="#5A3A18" strokeWidth="2.5" transform="rotate(16 376 196)" />
      <path d="M372 187c3 6 5 13 4 20" stroke="#5A3A18" strokeWidth="2" transform="rotate(16 376 196)" />
    </svg>
  );
}

export function SeedSprig() {
  return (
    <svg viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <ellipse cx="30" cy="38" rx="16" ry="21" fill="#A9713A" stroke="#5A3A18" strokeWidth="2.6" transform="rotate(-14 30 38)" />
      <path d="M24 24c5 8 8 18 7 28" stroke="#5A3A18" strokeWidth="2.2" transform="rotate(-14 30 38)" />
      <ellipse cx="52" cy="44" rx="11" ry="15" fill="#8A5A2B" stroke="#5A3A18" strokeWidth="2.4" transform="rotate(20 52 44)" />
      <circle cx="46" cy="16" r="7" fill="#F5B800" stroke="#C8860A" strokeWidth="2" />
      <circle cx="58" cy="22" r="5" fill="#E67E22" />
    </svg>
  );
}

export function HoneycombPattern() {
  return (
    <svg className="lp-banner-pattern" aria-hidden="true">
      <defs>
        <pattern id="hcPat" width="56" height="64" patternUnits="userSpaceOnUse" patternTransform="scale(1.6)">
          <path d="M28 2l22 13v26L28 54 6 41V15L28 2z" fill="none" stroke="#F5B800" strokeWidth="1.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hcPat)" />
    </svg>
  );
}

export function BrushSwipe() {
  return (
    <svg viewBox="0 0 320 40" fill="none" aria-hidden="true" preserveAspectRatio="none" className="lp-brush-swipe">
      <path
        d="M6 28C70 12 160 8 262 18c48 4 48 10 52 12-6 8-120 18-252 6C30 33 16 31 6 28z"
        fill="#F5B800"
        opacity="0.9"
      />
      <path d="M18 30c88-16 188-14 278 2" stroke="#C8860A" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

export function IoTArt() {
  const dot = (cx, cy, r, c) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={c} />;
  return (
    <svg viewBox="0 0 460 360" fill="none" aria-hidden="true" className="lp-iot-svg">
      <defs>
        <linearGradient id="iotHill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9AAF63" />
          <stop offset="100%" stopColor="#6C7F45" />
        </linearGradient>
        <linearGradient id="iotSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F2E8C6" />
          <stop offset="100%" stopColor="#E8D9AC" />
        </linearGradient>
      </defs>
      <rect width="460" height="360" rx="28" fill="url(#iotSky)" />
      {/* hive box */}
      <g>
        <rect x="90" y="170" width="150" height="42" rx="8" fill="#F5B800" stroke="#1E1A0F" strokeWidth="3" />
        <rect x="82" y="210" width="166" height="46" rx="8" fill="#E6A817" stroke="#1E1A0F" strokeWidth="3" />
        <rect x="74" y="254" width="182" height="48" rx="8" fill="#F5B800" stroke="#1E1A0F" strokeWidth="3" />
        <rect x="148" y="270" width="34" height="12" rx="6" fill="#1E1A0F" />
        <rect x="68" y="152" width="194" height="22" rx="10" fill="#5A4A2A" stroke="#1E1A0F" strokeWidth="3" />
        <circle cx="165" cy="163" r="6" fill="#F5B800" />
      </g>
      {/* sensor nodes connected by dashed links */}
      <g stroke="#C8860A" strokeWidth="2.4" strokeDasharray="5 7" fill="none">
        <path d="M165 290C220 300 260 320 320 306" />
        <path d="M165 220c-2-40 20-64 58-88" />
        <path d="M120 300c-30 20-70 14-96 2" />
      </g>
      {/* phone / dashboard node */}
      <g>
        <rect x="288" y="262" width="64" height="98" rx="12" fill="#1E1A0F" />
        <rect x="296" y="272" width="48" height="76" rx="6" fill="#F2E8C6" />
        {dot(307, 289, 4, '#52B788')}
        {dot(319, 289, 4, '#52B788')}
        {dot(331, 289, 4, '#F5B800')}
        <rect x="300" y="302" width="40" height="5" rx="2.5" fill="#C8860A" />
        <rect x="300" y="313" width="28" height="5" rx="2.5" fill="#8A7050" />
        <rect x="300" y="324" width="34" height="5" rx="2.5" fill="#8A7050" />
        <rect x="312" y="342" width="16" height="4" rx="2" fill="#52B788" />
      </g>
      {/* satellite / tower node */}
      <g>
        <path d="M40 200l14 22 14-22" fill="none" stroke="#1E1A0F" strokeWidth="3" strokeLinejoin="round" />
        <path d="M58 216l20 4M58 224l18 8" stroke="#1E1A0F" strokeWidth="3" strokeLinecap="round" />
        <rect x="34" y="216" width="14" height="34" rx="5" fill="#C8860A" stroke="#1E1A0F" strokeWidth="2.4" />
        <circle cx="41" cy="206" r="7" fill="#F5B800" stroke="#1E1A0F" strokeWidth="2.2" />
      </g>
      {/* AI chip node */}
      <g>
        <rect x="196" y="84" width="54" height="54" rx="10" fill="#1E1A0F" />
        <rect x="204" y="92" width="38" height="38" rx="6" fill="#F5B800" />
        <path d="M213 111h20M223 101v20" stroke="#1E1A0F" strokeWidth="3.4" strokeLinecap="round" />
        {[[210,98],[226,98],[198,111],[226,124],[210,124],[228,111]].map(([x, y], i) => <path key={i} d={`M${x} ${y - 8}v8M${x - 8} ${y}h8`} stroke="#C8860A" strokeWidth="2.4" />)}
        {/* bees */}
        <g>
          <ellipse cx="112" cy="150" rx="7" ry="4.5" transform="rotate(-24 112 150)" fill="#FFFDF6" stroke="#1E1A0F" strokeWidth="1.4" />
          <ellipse cx="123" cy="148" rx="7" ry="4.5" transform="rotate(24 123 148)" fill="#FFFDF6" stroke="#1E1A0F" strokeWidth="1.4" />
          <ellipse cx="117" cy="157" rx="8" ry="9" fill="#F5B800" stroke="#1E1A0F" strokeWidth="1.6" />
          <path d="M110 154h14M111 159h12" stroke="#1E1A0F" strokeWidth="1.8" strokeLinecap="round" />
        </g>
        <rect x="410" y="40" width="34" height="34" rx="8" fill="#F5B800" stroke="#1E1A0F" strokeWidth="2.4" transform="rotate(12 427 57)" />
        <path d="M420 57h14M427 50v14" stroke="#1E1A0F" strokeWidth="2.6" strokeLinecap="round" transform="rotate(12 427 57)" />
      </g>
      {/* ground */}
      <path d="M0 336c120-20 240-14 460-4v28H0v-24z" fill="url(#iotHill)" />
    </svg>
  );
}

export function QrTile({ dark = true }) {
  const squares = [
    [0,0,4,4],[8,0,4,4],[12,8,4,4],[0,12,4,4],[6,6,4,4],
    [0,16,2,2],[2,16,2,4],[6,8,2,2],[10,4,2,2],[8,12,2,2],
    [12,16,4,4],[18,0,4,4],[16,6,2,2],[16,12,2,2],[16,18,2,6],
    [0,20,4,2],[6,20,2,2],[8,22,2,4],[12,20,4,2],[18,16,4,2],
  ];
  const fg = dark ? '#F7F1E1' : '#1E1A0F';
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="lp-qr-tile">
      {squares.map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={fg} />
      ))}
      <circle cx="12" cy="12" r="1.1" fill="#F5B800" />
    </svg>
  );
}

/* ============================================================
   IMAGE-1 HERO ASSETS
   ============================================================ */

/* small 3D honeybee (used near the KVIC badge & near the honeycomb graphic) */
export function SceneBee() {
  return (
    <svg viewBox="0 0 56 52" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="beeBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4B62F" />
          <stop offset="55%" stopColor="#DD9413" />
          <stop offset="100%" stopColor="#C16F09" />
        </linearGradient>
      </defs>
      <ellipse cx="19" cy="15" rx="10.5" ry="6.4" transform="rotate(-28 19 15)" fill="#FFFDF6" opacity="0.88" stroke="#DCCB9F" strokeWidth="1" />
      <ellipse cx="37" cy="15" rx="10.5" ry="6.4" transform="rotate(28 37 15)" fill="#FFFDF6" opacity="0.88" stroke="#DCCB9F" strokeWidth="1" />
      <ellipse cx="28" cy="30" rx="13" ry="14" fill="url(#beeBody)" stroke="#2A1E0B" strokeWidth="1.6" />
      <path d="M16 26h24M16.5 32h23M18 38h20" stroke="#2A1E0B" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M25 17c-2-3-5-4-8-4.4M31 17c2-3 5-4 8-4.4" stroke="#2A1E0B" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="16" cy="11.2" r="2" fill="#2A1E0B" />
      <circle cx="40" cy="11.2" r="2" fill="#2A1E0B" />
      <circle cx="24" cy="27" r="2.2" fill="#2A1E0B" />
      <circle cx="33" cy="27" r="2.2" fill="#2A1E0B" />
      <circle cx="28" cy="31" r="2.6" fill="#1E1A0F" opacity="0.3" />
    </svg>
  );
}

/* short hand-drawn gold underline — spans exactly the word "Blockchain." */
export function GoldSwoosh() {
  return (
    <svg viewBox="0 0 220 22" fill="none" aria-hidden="true" preserveAspectRatio="none">
      <path
        d="M12 15 C 70 5 150 4 204 12"
        stroke="#C9A24A"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.85"
        fill="none"
      />
      <path
        d="M18 13.5 C 72 7.5 142 5.5 196 10.5"
        stroke="#EACB6B"
        strokeWidth="4.5"
        strokeLinecap="round"
        opacity="0.6"
        fill="none"
      />
      <path
        d="M202 10 l 7 3 -6 5 c -2 -2 -2 -5 -1 -8 z"
        fill="#C9A24A"
        opacity="0.9"
      />
    </svg>
  );
}

/* faint gold honeycomb / hexagon graphic behind the upper-right of the jar */
export function HexBackdrop() {
  const hx = (x, y, s, o) => (
    <path
      key={`${x}-${y}`}
      d={`M${x + s / 2} ${y} L${x + s * 0.933} ${y + s * 0.25} L${x + s * 0.933} ${y + s * 0.75} L${x + s / 2} ${y + s} L${x + s * 0.067} ${y + s * 0.75} L${x + s * 0.067} ${y + s * 0.25} Z`}
      fill="none"
      stroke="#C9A24A"
      strokeWidth="1.8"
      opacity={o}
      strokeLinejoin="round"
    />
  );
  return (
    <svg viewBox="0 0 150 150" fill="none" aria-hidden="true">
      {hx(8, 10, 52, 0.14)}
      {hx(84, -6, 52, 0.1)}
      {hx(58, 86, 52, 0.12)}
      {hx(-14, 62, 52, 0.08)}
      {hx(84, 40, 52, 0.09)}
    </svg>
  );
}

/* large green leaf entering from the top-left of the hero */
export function HeroLeafLarge() {
  return (
    <svg viewBox="0 0 150 130" fill="none" aria-hidden="true">
      <path d="M138 6C78 10 28 36 12 92c-2 7-1 12-1 12s30 0 52-13c26-15 52-44 66-68 6-11 10-17 9-17z" fill="#9AAF6B" stroke="#71894A" strokeWidth="2.4" />
      <path d="M16 100C36 70 62 44 92 28" stroke="#71894A" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M38 82c6-9 11-16 17-23M50 90c5-11 10-20 16-30" stroke="#71894A" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/* smaller falling leaf (top-right / left edge atmosphere) */
export function HeroLeafFall() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M56 8C30 8 10 22 8 48c0 4 1 7 1 7s26 2 40-14C63 25 56 8 56 8z" fill="#8A9A5B" stroke="#5F6F3A" strokeWidth="2" />
      <path d="M12 52C24 36 38 24 52 14" stroke="#5F6F3A" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M24 44c4-6 8-10 14-14M32 50c3-8 8-14 14-19" stroke="#5F6F3A" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

/* ============================================================
   IMAGE-1 RIGHT SIDE — STUDIO STILL LIFE
   Full-bleed product photograph composited onto the cream.
   Honeycomb (left) · mason jar (center) · dipper (right) ·
   blossoms + leaves · rough stone slab. No rectangle, ever.
   ============================================================ */
export function StillLifeScene() {
  const blossom = (cx, cy, s = 1) => (
    <g key={`bl-${cx}-${cy}`} transform={`translate(${cx} ${cy}) scale(${s})`}>
      <g fill="#FFFDF6" stroke="#E9E1CF" strokeWidth="0.5">
        <circle cx="0" cy="-2.8" r="2.4" />
        <circle cx="2.7" cy="-0.9" r="2.4" />
        <circle cx="1.7" cy="2.3" r="2.4" />
        <circle cx="-1.7" cy="2.3" r="2.4" />
        <circle cx="-2.7" cy="-0.9" r="2.4" />
      </g>
      <circle cx="0" cy="0" r="1.3" fill="#E9B83A" />
    </g>
  );

  const cell = (x, y, hl = false) => (
    <g key={`c-${x}-${y}`}>
      <path
        d={`M${x} ${y - 16} L${x + 13.9} ${y - 8} L${x + 13.9} ${y + 8} L${x} ${y + 16} L${x - 13.9} ${y + 8} L${x - 13.9} ${y - 8} Z`}
        fill="#F2E3BC"
        stroke="#C9AC6E"
        strokeWidth="1.5"
      />
      <path
        d={`M${x} ${y - 11.5} L${x + 9.9} ${y - 5.7} L${x + 9.9} ${y + 5.7} L${x} ${y + 11.5} L${x - 9.9} ${y + 5.7} L${x - 9.9} ${y - 5.7} Z`}
        fill="url(#slHoney)"
        stroke="#E3B052"
        strokeWidth="0.6"
      />
      {hl && <path d={`M${x - 4.5} ${y - 3} c -1.6 2 -1.6 4 0 6`} stroke="#FFF3C4" strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />}
    </g>
  );

  const drip = (x, y0, len) => (
    <g key={`dr-${x}`}>
      <path
        d={`M${x} ${y0} C${x - 2.2} ${y0 + len * 0.55} ${x - 2.2} ${y0 + len * 0.8} ${x - 1.2} ${y0 + len} C${x - 0.5} ${y0 + len + 2.6} ${x + 0.5} ${y0 + len + 2.6} ${x + 1.2} ${y0 + len} C${x + 2.2} ${y0 + len * 0.8} ${x + 2.2} ${y0 + len * 0.55} ${x} ${y0} Z`}
        fill="url(#slHoneyDeep)"
      />
      <path d={`M${x - 1} ${y0 + len * 0.32} v ${len * 0.32}`} stroke="#FFF3C4" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
    </g>
  );

  const spark = (cx, cy, s = 1) => (
    <g key={`sp-${cx}-${cy}`} transform={`translate(${cx} ${cy}) scale(${s})`} fill="#FFF9E6" opacity="0.9">
      <path d="M0 -6 L 1.3 -1.3 L 6 0 L 1.3 1.3 L 0 6 L -1.3 1.3 L -6 0 L -1.3 -1.3 Z" />
    </g>
  );

  /* honeycomb chunk layout (row -> x-centres, alternate rows offset) */
  const combCells = [
    [118, 146, 174, 202, 230],
    [132, 160, 188, 216],
    [116, 144, 172, 200, 228],
    [130, 158, 186, 214],
    [118, 146, 174, 202, 230],
  ];
  const combRows = [356, 380, 404, 428, 452];

  return (
    <svg className="lp-scene-svg" viewBox="0 0 560 560" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="slGlow" cx="57%" cy="57%" r="52%">
          <stop offset="0%" stopColor="#F3B93E" stopOpacity="0.3" />
          <stop offset="55%" stopColor="#F3B93E" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#F3B93E" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="slHoney" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBCB55" />
          <stop offset="45%" stopColor="#F6AF26" />
          <stop offset="100%" stopColor="#C77F12" />
        </linearGradient>
        <linearGradient id="slHoneyDeep" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7B32B" />
          <stop offset="100%" stopColor="#A96409" />
        </linearGradient>
        <linearGradient id="slGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.68" />
          <stop offset="52%" stopColor="#FFFFFF" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.26" />
        </linearGradient>
        <linearGradient id="slGlint" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="slLid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A3A22" />
          <stop offset="46%" stopColor="#262016" />
          <stop offset="100%" stopColor="#14100A" />
        </linearGradient>
        <linearGradient id="slWood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A9713A" />
          <stop offset="100%" stopColor="#6E4521" />
        </linearGradient>
        <linearGradient id="slStone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EADFC5" />
          <stop offset="74%" stopColor="#D8C6A1" />
          <stop offset="100%" stopColor="#D8C6A1" stopOpacity="0" />
        </linearGradient>
        <filter id="slDoF" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <filter id="slDoF2" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.3" />
        </filter>
        <clipPath id="slClip">
          <rect x="296" y="140" width="48" height="54" />
          <path d="M296 194 C 282 198 276 214 276 230 L 276 396 C 276 428 296 440 320 440 C 344 440 364 428 364 396 L 364 230 C 364 214 358 198 344 194 Z" />
        </clipPath>
      </defs>

      {/* honey-gold studio glow behind the jar */}
      <ellipse cx="320" cy="318" rx="250" ry="228" fill="url(#slGlow)" />

      {/* out-of-focus green leaves drifting in the top-right */}
      <g filter="url(#slDoF)" opacity="0.5">
        <path d="M482 74 C 512 56 540 62 556 88 C 528 118 492 116 482 74 Z" fill="#A9B77A" />
        <path d="M438 40 C 466 24 502 34 508 62 C 480 84 446 74 438 40 Z" fill="#95A66B" />
      </g>
      <g filter="url(#slDoF2)" opacity="0.45">
        <path d="M498 148 C 522 136 546 142 556 160 C 536 184 506 180 498 148 Z" fill="#A9B77A" />
      </g>

      {/* faint hexagon graphic upper-right, behind the jar */}
      <g stroke="#C9A24A" strokeWidth="2" fill="none" opacity="0.14" strokeLinejoin="round">
        <path d="M452 96 l 22 13 v 26 l -22 13 l -22 -13 v -26 Z" />
        <path d="M486 132 l 22 13 v 26 l -22 13 l -22 -13 v -26 Z" opacity="0.7" />
        <path d="M418 132 l 22 13 v 26 l -22 13 l -22 -13 v -26 Z" opacity="0.7" />
      </g>

      {/* rough warm-gray stone slab, edges melting into the cream */}
      <path d="M-20 486 C 90 470 380 468 580 490 L 580 560 C 400 546 140 546 -20 560 Z" fill="url(#slStone)" />
      <path d="M-20 488 C 110 472 400 470 580 492" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="3.5" strokeLinecap="round" />
      <g fill="#B6A27B" opacity="0.4">
        <circle cx="96" cy="512" r="1.8" />
        <circle cx="140" cy="522" r="1.2" />
        <circle cx="210" cy="516" r="1.6" />
        <circle cx="268" cy="520" r="1.2" />
        <circle cx="330" cy="514" r="1.9" />
        <circle cx="380" cy="524" r="1.3" />
        <circle cx="430" cy="516" r="1.7" />
        <circle cx="486" cy="522" r="1.4" />
        <circle cx="64" cy="524" r="1.1" />
      </g>

      {/* soft contact shadows */}
      <ellipse cx="320" cy="462" rx="158" ry="16" fill="#241A0B" opacity="0.13" />
      <ellipse cx="172" cy="486" rx="78" ry="11" fill="#241A0B" opacity="0.09" />
      <ellipse cx="452" cy="494" rx="50" ry="9" fill="#241A0B" opacity="0.1" />

      {/* honey pool from the comb */}
      <ellipse cx="172" cy="504" rx="58" ry="10" fill="url(#slHoney)" opacity="0.85" />
      <ellipse cx="160" cy="502" rx="26" ry="4" fill="#FFF3C4" opacity="0.4" />

      {/* ---------- honeycomb chunk (left) ---------- */}
      <g transform="rotate(-9 170 404)">
        {combRows.map((y, ri) => combCells[ri].map((x) => cell(x, y, (ri + 2) % 3 === 0)))}
        {drip(146, 476, 34)}
        {drip(178, 476, 26)}
        {drip(210, 476, 38)}
        {drip(226, 476, 20)}
      </g>
      {spark(150, 478, 0.7)}

      {/* ---------- wooden honey dipper (right, lying on the stone) ---------- */}
      <g transform="rotate(-18 452 470)">
        <rect x="448" y="180" width="12" height="276" rx="6" fill="url(#slWood)" />
        <rect x="449" y="180" width="3.4" height="276" fill="#FFFFFF" opacity="0.18" />
        <circle cx="454" cy="456" r="16" fill="url(#slHoney)" stroke="#C8860A" strokeWidth="1.8" />
        <circle cx="454" cy="476" r="12" fill="url(#slHoney)" stroke="#C8860A" strokeWidth="1.8" />
        <path d="M439 452h30M440 459h28M441 466h26" stroke="#F3B93E" strokeWidth="1.2" opacity="0.7" />
      </g>
      <path d="M455 478c1 6 2 11 2 15c0 3-1 5-2 7" stroke="url(#slHoneyDeep)" strokeWidth="3.6" strokeLinecap="round" />
      <circle cx="457" cy="500" r="3.2" fill="#F5B800" />
      {spark(462, 498, 0.6)}

      {/* ============================================================
          MASON JAR (center) — glass, honey, black lid, gold ribbon
          ============================================================ */}
      <g>
        {/* body glass silhouette */}
        <path d="M296 194 C 282 198 276 214 276 230 L 276 396 C 276 428 296 440 320 440 C 344 440 364 428 364 396 L 364 230 C 364 214 358 198 344 194 Z" fill="#F7E7BF" />

        <g clipPath="url(#slClip)">
          {/* honey fill */}
          <rect x="270" y="138" width="100" height="316" fill="url(#slHoney)" />
          {/* honey surface sheen */}
          <rect x="270" y="138" width="100" height="8" fill="#FBE7A6" opacity="0.9" />
          {/* soft bubbles in the honey */}
          <circle cx="300" cy="220" r="2.6" fill="#FFFFFF" opacity="0.25" />
          <circle cx="330" cy="250" r="1.8" fill="#FFFFFF" opacity="0.2" />
          <circle cx="308" cy="282" r="2.2" fill="#FFFFFF" opacity="0.22" />
          <circle cx="338" cy="302" r="1.6" fill="#FFFFFF" opacity="0.18" />
          <circle cx="296" cy="340" r="2" fill="#FFFFFF" opacity="0.2" />
          <circle cx="318" cy="382" r="1.6" fill="#FFFFFF" opacity="0.16" />
          {/* inner side shade (right) for depth */}
          <rect x="352" y="138" width="14" height="304" fill="#8A5A10" opacity="0.2" />
          {/* front glass gradient overlay */}
          <rect x="272" y="136" width="96" height="306" fill="url(#slGlass)" />
        </g>

        {/* neck glass */}
        <rect x="296" y="144" width="48" height="50" rx="6" fill="#F9EAC9" fillOpacity="0.4" stroke="#C8860A" strokeOpacity="0.3" strokeWidth="1.2" />

        {/* left vertical highlight */}
        <path d="M284 238c-3 16-4 36-4 58l0 52" stroke="url(#slGlint)" strokeWidth="9" strokeLinecap="round" />
        {/* shoulder sheen */}
        <ellipse cx="302" cy="220" rx="18" ry="8" fill="#FFFFFF" opacity="0.3" />
        {/* bottom rim light */}
        <path d="M292 424 C 302 432 338 432 348 424" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="2" fill="none" />

        {/* collar rib */}
        <rect x="292" y="146" width="56" height="11" rx="3" fill="#EFDEB8" stroke="#C8860A" strokeWidth="1" opacity="0.95" />
        <rect x="294" y="148" width="3" height="7" fill="#FFFFFF" opacity="0.8" />

        {/* honey drip off the rim */}
        <path d="M344 148 C 344 162 342 172 338 180 C 336 184.5 333.5 186 331 186 C 328.5 186 326 184.5 324 180 C 321 174 321 162 323 148 Z" fill="url(#slHoney)" />
        <path d="M336 162 c 1.6 -3 2 -6 2 -10 M335 171 c 1.5 -2.5 1.5 -4.5 1.5 -6" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1.8" strokeLinecap="round" />

        {/* gold ribbon around the neck with a small bow */}
        <g>
          <rect x="296" y="176" width="48" height="12" rx="3" fill="#D9A53B" stroke="#B8860B" strokeWidth="0.8" />
          <path d="M298 178 h44 M298 187 h44" stroke="#B8860B" strokeWidth="0.7" strokeDasharray="1.5 2.5" opacity="0.6" />
          <path d="M310 188 c -4 -4 -8 -4 -10 0 c -1.8 3.2 0 6.5 4.5 8 c 4.5 1.6 8.8 1 10 -1.2 z" fill="#D9A53B" stroke="#B8860B" strokeWidth="0.7" />
          <path d="M330 188 c 4 -4 8 -4 10 0 c 1.8 3.2 0 6.5 -4.5 8 c -4.5 1.6 -8.8 1 -10 -1.2 z" fill="#D9A53B" stroke="#B8860B" strokeWidth="0.7" />
          <circle cx="320" cy="191" r="2.6" fill="#C8902C" />
          <path d="M320 194 c -1 5 -2 9 -2 12" stroke="#C8902C" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M321 194 c 1.6 4 2.6 7.5 3 11" stroke="#B8860B" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* cream label */}
        <g>
          <rect x="288" y="252" width="64" height="78" rx="9" fill="#FFFDF8" stroke="#C9A24A" strokeWidth="1.2" />
          <rect x="292" y="256" width="56" height="70" rx="6" fill="none" stroke="#C9A24A" strokeOpacity="0.4" strokeWidth="0.7" />
          {/* gold hexagon + bee icon */}
          <g transform="translate(320 275)">
            <path d="M0 -9 L 7.8 -4.5 L 7.8 4.5 L 0 9 L -7.8 4.5 L -7.8 -4.5 Z" fill="#F3B93E" stroke="#B8860B" strokeWidth="0.9" />
            <ellipse cx="-3" cy="-3.2" rx="2.6" ry="1.5" transform="rotate(-24 -3 -3.2)" fill="#FFFFFF" opacity="0.9" />
            <ellipse cx="3" cy="-3.2" rx="2.6" ry="1.5" transform="rotate(24 3 -3.2)" fill="#FFFFFF" opacity="0.9" />
            <ellipse cx="0" cy="0.4" rx="3.4" ry="4.2" fill="#1E1A0F" />
            <path d="M-2.4 -0.8 h4.8 M-2.2 1.6 h4.4" stroke="#F3B93E" strokeWidth="0.9" />
          </g>
          <text x="320" y="297" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontWeight="800" fontSize="7.6" letterSpacing="0.9" fill="#1B160D">HONEY CHAIN</text>
          <text x="320" y="303" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="3.2" letterSpacing="0.35" fill="#9A8A66">PURE · TRACEABLE · TRUSTED</text>
          <line x1="298" y1="307" x2="342" y2="307" stroke="#C9A24A" strokeOpacity="0.45" strokeWidth="0.6" />
          <text x="320" y="318" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="6.4" letterSpacing="1.6" fill="#B8860B">RAW HONEY</text>
          <g>
            <path d="M301 327 c -2 -3 0 -6 3 -7 c 3 -1 5 1 5 3 c 0 3 -2 4 -4 4 z" fill="#4C7A34" />
            <text x="306" y="328" fontFamily="'Inter', sans-serif" fontWeight="600" fontSize="3.7" fill="#5C5346">100% NATURAL</text>
          </g>
        </g>

        {/* black lid */}
        <rect x="288" y="116" width="64" height="27" rx="8" fill="url(#slLid)" stroke="#0E0B05" strokeWidth="1" />
        <path d="M294 122 c 14 4 38 4 52 -1" stroke="#FFFFFF" strokeOpacity="0.12" strokeWidth="3" strokeLinecap="round" fill="none" />
        <rect x="300" y="100" width="40" height="17" rx="6" fill="#241C10" stroke="#0E0B05" strokeWidth="1" />
        <rect x="308" y="104" width="24" height="3" rx="1.5" fill="#C8860A" opacity="0.5" />

        {/* honey drip from jar base */}
        <path d="M308 442 c -1 6 -1 11 0 15 c 0.6 2.4 1.4 3.6 3 3.6 c 1.6 0 2.4 -1.2 3 -3.6 c 1 -4 1 -9 0 -15 Z" fill="url(#slHoney)" opacity="0.92" />
      </g>
      {spark(334, 224, 0.8)}
      {spark(300, 320, 0.6)}

      {/* ---------- foreground blossoms + leaves around the base ---------- */}
      <g>
        <path d="M300 512 c -10 -14 -6 -34 12 -46 c 9 12 12 26 4 40 c -6 3 -10 5 -16 6 Z" fill="#7D9A52" stroke="#5F7A3E" strokeWidth="1.4" />
        <path d="M306 508 c 7 -10 9 -20 6 -29" stroke="#5F7A3E" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M356 516 c 4 -18 -2 -38 -24 -50 c -8 16 -11 32 -4 46 c 10 1 18 3 28 4 Z" fill="#8AA962" stroke="#5F7A3E" strokeWidth="1.4" />
        <path d="M350 512 c -8 -12 -11 -24 -8 -36" stroke="#5F7A3E" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M238 514 c -6 -16 0 -34 20 -44 c 6 14 8 28 2 40 c -8 2 -14 3 -22 4 Z" fill="#7D9A52" stroke="#5F7A3E" strokeWidth="1.4" />
        <path d="M244 510 c 6 -10 9 -20 7 -29" stroke="#5F7A3E" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M400 522 c 2 -16 -4 -34 -24 -46 c -7 15 -9 30 -2 44 c 9 1 17 2 26 2 Z" fill="#8AA962" stroke="#5F7A3E" strokeWidth="1.4" />
        {blossom(250, 506, 1.1)}
        {blossom(304, 524, 0.9)}
        {blossom(342, 528, 1)}
        {blossom(388, 514, 1.1)}
        {blossom(214, 522, 0.9)}
        {blossom(464, 530, 0.8)}
        {blossom(150, 524, 0.8)}
      </g>
    </svg>
  );
}
