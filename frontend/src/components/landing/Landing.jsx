import React, { useEffect, useRef, useState } from 'react';
import {
  Trophy, QrCode, Check, ChevronLeft, ChevronRight, ArrowRight,
  Box, Droplets, Link2, ScanLine, Thermometer, Activity,
  TrendingUp, AlertTriangle, ShieldCheck, Cpu, Wifi, Leaf, BarChart2
} from 'lucide-react';
import {
  ProductJar, FloatHex,
  HoneycombPattern, BannerDrizzle, BannerComb,
  CommitArt, SeedSprig, IoTArt, QrTile,
  SceneBee, GoldSwoosh, HexBackdrop, HeroLeafLarge, HeroLeafFall
} from './Illustrations';
import { shopProducts, shopCategories, stats, iotFeatures, qrVerify, testimonials } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import honeyBeeImg from '../../images/honeybee.png';

const HOW_STEPS = [
  { n: '01', icon: Box, t: 'Hive Registration', d: 'Every colony is registered with location, beekeeper and live IoT sensors.', view: 'monitor' },
  { n: '02', icon: Droplets, t: 'Extraction & Batch Creation', d: 'Harvest becomes a batch — GPS, weight and purity locked to its identity.', view: 'chain' },
  { n: '03', icon: Link2, t: 'Blockchain Record + QR', d: 'Each step is sealed on-ledger and linked to a cryptographic QR code.', view: 'chain' },
  { n: '04', icon: ScanLine, t: 'Consumer Scan & Verify', d: 'Scan the QR to see origin, lab tests and the full chain of custody.', view: 'qr' },
];

const FEATURE_ICONS = {
  Thermometer,
  Activity,
  TrendingUp,
  AlertTriangle,
};


function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            en.target.classList.add('is-visible');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ---------- count-up stat ---------- */
function CountUp({ value, decimals, suffix, start }) {
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    if (!start) return;
    let raf;
    const t0 = performance.now();
    const dur = 1500;
    const tick = (now) => {
      const t = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = value * eased;
      setDisplay(v.toLocaleString('en-IN', { maximumFractionDigits: decimals, minimumFractionDigits: decimals }) + suffix);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, value, decimals, suffix]);
  return <span className="lp-stat-num">{display}</span>;
}

/* ---------- stats / trust bar ---------- */
function StatsBar() {
  const [start, setStart] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { setStart(true); return; }
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { setStart(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="lp-stats reveal" id="stats" ref={ref}>
      <div className="lp-stats-grid">
        {stats.map(s => (
          <div className="lp-stat" key={s.label}>
            <span className="lp-stat-emoji" aria-hidden="true">{s.icon}</span>
            <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} start={start} />
            <div className="lp-stat-label">{s.label}</div>
            <div className="lp-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- browse & trace ---------- */
function BrowseTrace() {
  const [cat, setCat] = useState('All');
  const { switchView } = useApp();
  const trackRef = useRef(null);

  const items = cat === 'All' ? shopProducts : shopProducts.filter(p => p.category === cat);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('.lp-card');
    const step = card ? card.clientWidth + 24 : 320;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <div className="lp-section lp-shop" id="shop">
      <div className="lp-shop-head reveal">
        <div>
          <span className="lp-eyebrow">Our Honey Varieties</span>
          <h2 className="lp-h2">Browse &amp; Trace Every Batch</h2>
          <p className="lp-lede lp-shop-lede">Every variety below carries an on-chain identity — scan any batch code to walk its full journey.</p>
        </div>
      </div>

      <div className="lp-shop-tabs reveal">
        {shopCategories.map(c => (
          <button
            key={c}
            className={`lp-tab ${cat === c ? 'active' : ''}`}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="lp-carousel-wrap reveal">
        <button className="lp-arrow lp-arrow-prev" aria-label="Previous batches" onClick={() => scroll(-1)}>
          <ChevronLeft size={20} />
        </button>
        <div className="lp-carousel" ref={trackRef}>
          {items.map(p => (
            <article className="lp-card" key={p.id}>
              <div className="lp-card-media">
                <span className="lp-card-tag">{p.tag}</span>
                <ProductJar tone={p.tone} deep={p.deep} />
              </div>
              <div className="lp-card-body">
                <h3 className="lp-card-name">{p.name}</h3>
                <div className="lp-card-meta"><span>{p.weight} · {p.category}</span></div>
                <div className="lp-card-badges">
                  <span className="lp-origin-pill">📍 {p.origin}</span>
                  <span className="lp-batch-badge">🔗 {p.batch}</span>
                </div>
              </div>
              <div className="lp-card-foot">
                <button
                  className="lp-card-trace"
                  aria-label={`Scan to trace ${p.name} batch ${p.batch}`}
                  onClick={() => switchView('qr')}
                >
                  <QrCode size={16} /> Scan to Trace
                </button>
              </div>
            </article>
          ))}
        </div>
        <button className="lp-arrow" aria-label="Next batches" onClick={() => scroll(1)}>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

/* ---------- how it works (4-step timeline) ---------- */
function HowItWorks() {
  const { switchView } = useApp();
  return (
    <section className="lp-how lp-banner" id="process">
      <HoneycombPattern />
      <div className="lp-banner-deco-left"><BannerDrizzle /></div>
      <div className="lp-banner-deco-right"><BannerComb /></div>
      <div className="lp-how-head reveal">
        <span className="lp-eyebrow lp-eyebrow-dark">Traceability Process</span>
        <h2>From Hive to Your Table</h2>
        <p className="lp-how-sub">One continuous audit trail, sealed on the blockchain at every step.</p>
      </div>
      <div className="lp-steps reveal">
        {HOW_STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <button
              key={s.n}
              className="lp-step lp-step-btn"
              onClick={() => switchView(s.view)}
            >
              <span className={`lp-step-circle ${i % 2 ? 'alt' : ''}`}>
                <Icon size={26} strokeWidth={1.8} />
                <span className="lp-step-num">{s.n}</span>
              </span>
              <span className="lp-step-t">{s.t}</span>
              <span className="lp-step-d">{s.d}</span>
            </button>
          );
        })}
        <span className="lp-step-connector" aria-hidden="true"></span>
      </div>
    </section>
  );
}

/* ---------- iot + ai features ---------- */
function IoTFeatures() {
  const { switchView } = useApp();
  return (
    <div className="lp-section lp-iot" id="iot">
      <div className="lp-iot-grid">
        <div className="lp-iot-media reveal">
          <IoTArt />
        </div>
        <div className="lp-iot-body">
          <div className="reveal">
            <span className="lp-eyebrow lp-eyebrow-green">Smart Beekeeping</span>
            <h2 className="lp-h2">AI &amp; IoT Powered Hive Intelligence</h2>
            <p className="lp-lede">Thousands of solar-powered hives stream live telemetry into an AI engine that catches problems before they reach the hive door.</p>
          </div>
          <div className="lp-iot-cards">
            {iotFeatures.map(f => {
              const Icon = FEATURE_ICONS[f.icon];
              return (
                <button
                  key={f.title}
                  className="lp-iot-card lp-iot-card-btn reveal"
                  onClick={() => switchView(f.view)}
                >
                  <span className="lp-iot-icon"><Icon size={20} strokeWidth={1.8} /></span>
                  <span className="lp-iot-title">{f.title}</span>
                  <span className="lp-iot-desc">{f.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- QR verify demo ---------- */
function QrVerify() {
  const { switchView } = useApp();
  return (
    <section className="lp-qr-sec lp-banner" id="scan-demo">
      <HoneycombPattern />
      <div className="lp-qr-intro reveal">
        <span className="lp-eyebrow lp-eyebrow-dark">Consumer Trust</span>
        <h2>Scan. Verify. Trust.</h2>
        <p className="lp-how-sub">A single scan pulls the harvest site, lab report and ledger proof for any batch.</p>
      </div>
      <div className="lp-qr-card reveal">
        <div className="lp-qr-visual">
          <QrTile />
        </div>
        <div className="lp-qr-hash">{qrVerify.hash}</div>
        <div className="lp-qr-verified">
          <span className="lp-qr-check"><Check size={15} strokeWidth={3} /></span>
          Verified Authentic — KVIC Certified
        </div>
        <div className="lp-qr-facts">
          <div><span>Origin</span><b>{qrVerify.origin}</b></div>
          <div><span>Date</span><b>{qrVerify.date}</b></div>
          <div><span>Lab Test</span><b>{qrVerify.lab}</b></div>
          <div><span>Certification</span><b>{qrVerify.kvic}</b></div>
        </div>
        <button className="lp-btn lp-btn-light lp-btn-scan" onClick={() => switchView('qr')}>
          Verify a Real Batch <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}

/* ---------- beekeeper stories ---------- */
function BeekeeperStories() {
  const [dot, setDot] = useState(0);
  const pages = 2;
  const visible = testimonials.slice(dot * 3, dot * 3 + 3);

  return (
    <div className="lp-section lp-testimonials" id="testimonials">
      <div className="lp-testimonials-head reveal">
        <div>
          <span className="lp-eyebrow">Rural Impact</span>
          <h2 className="lp-h2">Beekeepers Speak</h2>
        </div>
      </div>

      <div className="lp-testimonials-list">
        <span className="lp-t-deco lp-t-d1"><SeedSprig /></span>
        <span className="lp-t-deco lp-t-d2"><FloatHex filled={false} /></span>
        <span className="lp-t-deco lp-t-d3"><SeedSprig /></span>
        {visible.map(t => (
          <div className="lp-t-card reveal" key={t.id}>
            <div className="lp-t-avatar" style={{ background: t.tone }}>{t.initials}</div>
            <div>
              <span className="lp-t-quote-mark">“</span>
              <blockquote>
                {t.quote}
                <div className="lp-t-who">
                  <div className="lp-t-name">{t.name}</div>
                  <div className="lp-t-role">{t.role}</div>
                </div>
              </blockquote>
            </div>
            {t.kvic && <span className="lp-t-kvic">✓ KVIC Registered</span>}
          </div>
        ))}
      </div>

      <div className="lp-dots reveal">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            className={`lp-dot ${dot === i ? 'active' : ''}`}
            aria-label={`Stories page ${i + 1}`}
            onClick={() => setDot(i)}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- commitment / CTA ---------- */
function Commitment() {
  const { switchView } = useApp();
  return (
    <section className="lp-section lp-commit" id="commitment">
      <div className="lp-commit-art reveal"><CommitArt /></div>
      <div className="reveal">
        <span className="lp-eyebrow">Our Promise</span>
        <h2 className="lp-h2">Our Commitment to <span className="lp-amber-word">100% Authentic Honey</span></h2>
        <p className="lp-lede">
          Every batch is backed by an unbroken chain of custody — harvest, purity, processing and
          delivery, all visible at a scan. Built with and for KVIC's rural beekeepers.
        </p>
        <button className="lp-btn lp-btn-primary" onClick={() => switchView('scale')}>
          Get Started — It's Free <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}

export default function Landing() {
  const { switchView } = useApp();
  useReveal();

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="lp-hero" id="hero">
        <div className="lp-hero-glow" aria-hidden="true" />

        {/* atmosphere: leaves drifting around the still-life */}
        <div className="lp-hero-deco" aria-hidden="true">
          <span className="lp-hd-leaf lp-hd-leaf-large"><HeroLeafLarge /></span>
          <span className="lp-hd-leaf lp-hd-leaf-fall1"><HeroLeafFall /></span>
          <span className="lp-hd-leaf lp-hd-leaf-fall2"><HeroLeafFall /></span>
          <span className="lp-hd-leaf lp-hd-leaf-left"><HeroLeafFall /></span>
        </div>

        <div className="lp-hero-grid">
          <div className="lp-hero-copy">
            <div className="lp-hero-badge reveal is-visible">
              <span className="lp-bee-nearbadge" aria-hidden="true">
                <svg className="lp-bee-trail" viewBox="0 0 40 30" fill="none">
                  <path d="M38 6C26 14 14 18 4 24" stroke="#C9A24A" strokeWidth="2.4" strokeDasharray="0 7" strokeLinecap="round" opacity="0.6" />
                </svg>
                <SceneBee />
              </span>
              <span className="lp-hero-pill"><Trophy size={14} strokeWidth={1.9} /> KVIC HONEY MISSION</span>
            </div>
            <h1 className="lp-hero-title reveal is-visible">
              <span className="lp-hero-line">Pure Honey,</span>
              <span className="lp-hero-line">Verified on</span>
              <span className="lp-hero-line">
                <span className="lp-hero-gold">Blockchain.<span className="lp-swoosh"><GoldSwoosh /></span></span>
              </span>
            </h1>
            <p className="lp-hero-lead reveal is-visible">
              QR-verified authenticity · IoT hive monitoring · AI disease detection
              <br />— built for India's rural beekeepers.
            </p>

            <div className="lp-hero-cta reveal is-visible">
              <button className="lp-btn lp-btn-primary" onClick={() => switchView('qr')}>
                <QrCode size={17} strokeWidth={1.9} /> Scan &amp; Verify Honey <ArrowRight size={15} className="lp-arrow-r" />
              </button>
              <button className="lp-btn lp-btn-ghost" onClick={() => switchView('monitor')}>
                <BarChart2 size={17} strokeWidth={1.9} /> Explore Dashboard <ArrowRight size={15} className="lp-arrow-r" />
              </button>
            </div>

            <div className="lp-hero-trust reveal is-visible" role="list">
              <span className="lp-t-item" role="listitem"><ShieldCheck size={15} strokeWidth={2.1} className="lp-icon-green" /> Blockchain Secured</span>
              <span className="lp-t-item" role="listitem"><Cpu size={15} strokeWidth={2.1} className="lp-icon-blue" /> AI Powered</span>
              <span className="lp-t-item" role="listitem"><Wifi size={15} strokeWidth={2.1} className="lp-icon-green" /> IoT Connected</span>
            </div>
          </div>

          <div className="lp-hero-visual reveal is-visible">
            <div className="lp-scene-stage">
              <span className="lp-vis-deco lp-d-hexbg" aria-hidden="true"><HexBackdrop /></span>

              <div className="lp-hero-scene">
                <img className="lp-scene-img" src={honeyBeeImg} alt="Raw honey jar with honeycomb, flowers and honey dipper" />
              </div>

              <div className="lp-hf-card lp-hf-qr">
                <span className="lp-hf-qr-glyph"><QrTile dark={false} /></span>
                <span className="lp-hf-text">
                  <b>Batch #HC2025</b>
                  <span className="lp-hf-ok"><Check size={12} strokeWidth={3.2} /> Verified on Blockchain</span>
                </span>
              </div>

              <div className="lp-hf-card lp-hf-pure">
                <span className="lp-hf-ico"><Leaf size={18} strokeWidth={1.9} /></span>
                <span className="lp-hf-text"><b>100% Pure</b><small>Natural Honey</small></span>
              </div>

              <div className="lp-hf-card lp-hf-ethic">
                <span className="lp-hf-ico"><ShieldCheck size={18} strokeWidth={1.9} /></span>
                <span className="lp-hf-text"><b>Ethically Sourced</b><small>Rural India</small></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- STATS / TRUST BAR ---------- */}
      <StatsBar />

      {/* ---------- BROWSE & TRACE ---------- */}
      <BrowseTrace />

      {/* ---------- HOW IT WORKS (dark) ---------- */}
      <HowItWorks />

      {/* ---------- IoT + AI FEATURES ---------- */}
      <IoTFeatures />

      {/* ---------- QR VERIFY DEMO (dark) ---------- */}
      <QrVerify />

      {/* ---------- BEEKEEPER STORIES ---------- */}
      <BeekeeperStories />

      {/* ---------- COMMITMENT ---------- */}
      <Commitment />
    </>
  );
}