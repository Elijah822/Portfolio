import { useEffect, useRef, useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext.jsx';
import { useCoarsePointer, useFinePointer } from '../hooks/useMediaQuery.js';
import { usePlayWhenVisible } from '../hooks/usePlayWhenVisible.js';
import './HeroSection.css';

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target, duration = 1800, inView = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setValue(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);
  return value;
}

// ─── Stat chip ────────────────────────────────────────────────────────────────
function Stat({ prefix = '', value, suffix = '', label, inView }) {
  const count = useCountUp(value, 1600, inView);
  return (
    <div className="hero-stat" role="listitem">
      <span className="hero-stat__number">{prefix}{count}{suffix}</span>
      <span className="hero-stat__label">{label}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function HeroSection() {
  const glowRef    = useRef(null);
  const reelRef    = useRef(null);
  const shimmerRef = useRef(null);
  const statsRef   = useRef(null);
  const heroVideoRef = useRef(null);
  const [statsInView, setStatsInView] = useState(false);
  const finePointer = useFinePointer();
  const coarsePointer = useCoarsePointer();
  const { reduceMotion } = useAccessibility();

  usePlayWhenVisible(heroVideoRef, true);

  // Cursor parallax + shimmer — desktop only, saves mobile GPU/battery
  useEffect(() => {
    if (!finePointer || reduceMotion) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMove, { passive: true });

    let rafId;
    const tick = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const nx = (mx / vw - 0.5) * 2;
      const ny = (my / vh - 0.5) * 2;

      if (glowRef.current)
        glowRef.current.style.transform =
          `translate(${mx - 300}px, ${my - 300}px)`;

      if (reelRef.current)
        reelRef.current.style.transform =
          `translate(${-nx * 20}px, ${-ny * 12}px) rotate(${nx * 0.7}deg)`;

      if (shimmerRef.current)
        shimmerRef.current.style.backgroundPosition =
          `${((mx / vw) * 100).toFixed(1)}% 50%`;

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, [finePointer, reduceMotion]);

  // Stats intersection observer
  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsInView(true); },
      { threshold: 0.3 }
    );
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="hero" aria-label="Hero">

      {/* Dot-grid */}
      <svg className="hero__grid" aria-hidden="true">
        <defs>
          <pattern id="hero-dots" x="0" y="0" width="28" height="28"
            patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.045)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-dots)" />
      </svg>

      {/* Grain */}
      <div className="hero__grain" aria-hidden="true" />

      {/* Cursor glow — hidden on touch devices via CSS */}
      <div ref={glowRef} className="hero__glow" aria-hidden="true" />

      {/* ── Inner grid ── */}
      <div className="hero__inner">

        {/* LEFT */}
        <div className="hero__left">

          <div className="hero__pill" role="status">
            <span className="hero__pill-dot" aria-hidden="true" />
            Available for work
          </div>

          <p className="hero__eyebrow">Hello, it's me</p>

          <h1 className="hero__name" aria-label="Akinlolu Elijah">
            <span ref={shimmerRef} className="hero__name-shimmer">
              Akinlolu<br />Elijah
            </span>
          </h1>

          <p className="hero__role">
            I'm a{' '}
            <strong className="hero__role-accent">Fullstack product designer</strong>
            {' '}and{' '}
            <strong className="hero__role-accent">AI engineer</strong>
          </p>

          <p className="hero__body">
            Sharp design is my craft — I turn complex products into experiences
            people actually get. I use{' '}
            <strong className="hero__tool">Figma MCP</strong>,{' '}
            <strong className="hero__tool">Claude Code</strong> and{' '}
            <strong className="hero__tool">Cursor</strong> to move at{' '}
            <strong className="hero__tool">10× speed</strong>, shipping design decisions as working software.
          </p>

          <div className="hero__ctas">
            <a href="#work" className="hero__btn hero__btn--primary">
              View Work
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none"
                aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round" />
              </svg>
            </a>
            <button
              className="hero__btn hero__btn--ghost"
              type="button"
              onClick={() =>
                window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
              }
            >
              <span className="hero__btn-line" />
              Scroll to explore
            </button>
          </div>
        </div>

        {/* RIGHT — cinematic video panel */}
        <div className="hero__right">
          <div className="hero__rings" aria-hidden="true">
            <div className="hero__ring hero__ring--1" />
            <div className="hero__ring hero__ring--2" />
            <div className="hero__ring hero__ring--3" />
          </div>

          <div ref={reelRef} className="hero__device">
            <video
              ref={heroVideoRef}
              className="hero__device-video"
              src="https://res.cloudinary.com/dj8jyjcvo/video/upload/v1781689583/freecompress-Svar_Portfolio_FINAL_1_1_ri3rzv.mp4"
              poster="https://res.cloudinary.com/dj8jyjcvo/video/upload/so_0,f_jpg,w_1200,q_auto/v1781689583/freecompress-Svar_Portfolio_FINAL_1_1_ri3rzv.mp4"
              muted
              loop
              playsInline
              preload={coarsePointer ? "none" : "metadata"}
              data-hero-video
              aria-label="Project preview reel"
            />
            <div className="hero__device-vignette" aria-hidden="true" />
            <div className="hero__device-glare"   aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div
        ref={statsRef}
        className="hero__stats"
        role="list"
        aria-label="Key achievements"
      >
        <Stat prefix="£" value={50} suffix="M+" label="Impact delivered"   inView={statsInView} />
        <div className="hero__stats-divider" aria-hidden="true" />
        <Stat value={18} suffix="+"           label="Products shipped"     inView={statsInView} />
        <div className="hero__stats-divider" aria-hidden="true" />
        <Stat value={8}                        label="Countries"            inView={statsInView} />
        <div className="hero__stats-divider" aria-hidden="true" />
        <Stat value={6}  suffix="+"           label="Years of craft"       inView={statsInView} />
        <div className="hero__stats-divider" aria-hidden="true" />
        <Stat value={3}                        label="Enterprise clients"   inView={statsInView} />
      </div>

    </section>
  );
}
