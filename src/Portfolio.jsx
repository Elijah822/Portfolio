import { useState, useEffect, useRef, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getProjectMedia, SHOWREEL, videoPoster } from "./data/projectMedia.js"
import { getProjectMeta } from "./data/projectMeta.js"
import SocialLinks from "./components/SocialLinks.jsx"
import ScrollReveal from "./components/ScrollReveal.jsx"
import SiteNav from "./components/SiteNav.jsx"
import { HeroSection } from "./components/HeroSection.jsx"
import { useFinePointer } from "./hooks/useMediaQuery.js"
import { CONTACT } from "./data/contact.js"
import { TESTIMONIALS } from "./data/testimonials.js"
import {
  isAudioUnlocked,
  playLoadTick,
  resetLoadTicks,
  setPendingLoadPct,
  unlockAudio,
} from "./lib/portfolioAudio.js"
import { hasIntroLoaderCompleted, markIntroLoaderCompleted } from "./lib/loaderState.js"
import { saveHomeScroll } from "./lib/scrollRestore.js"
import { enforceScrollPosition } from "./lib/scrollToTop.js"

// ── TOKENS ────────────────────────────────────────────────────────────────────
const BG    = "#07070c"
const TEXT  = "#e0dbd2"
const DIM   = "#a39e98"
const GOLD  = "#c9aa7c"
const BORDER = "rgba(255,255,255,0.07)"

// ── DATA ──────────────────────────────────────────────────────────────────────
export const INDUSTRIES = [
  {
    id: "fintech",
    label: "Retail, E-Commerce, FinTech & Compliance",
    sub: "E-Commerce · Retail · Payments · Compliance",
    projects: [
      {
        id: "01", title: "Toke",
        cat: "E-Commerce · Retail · Design Systems · AI",
        year: "2024 to 25", status: "live", statusLabel: "Live",
        impact: "€50M+ impact", accent: "#c9aa7c",
        url: "https://www.toke.ai/",
        desc: "Lead Product Designer at Toke, an e-commerce and retail platform serving major enterprise clients across storefronts, payments, compliance, and AI-powered design infrastructure. Solely responsible for product design across three concurrent enterprise clients.",
        metrics: [
          { value: "€40M+", label: "Regulatory exposure avoided (KYC)" },
          { value: "€10M+", label: "Potential App Store commission saved" },
          { value: "50%", label: "Team velocity via AI design system" },
          { value: "3", label: "Enterprise clients, simultaneously" },
        ],
        role: "Lead Product Designer",
        about: "At Toke, I operated as the sole designer across three major enterprise clients simultaneously, covering three distinct high-stakes workstreams:",
        streams: [
          {
            title: "AI-Powered Design System",
            desc: "Built a Claude MCP-integrated design system automating token generation, component scaffolding, and documentation, compressing 2-week design cycles to under one week.",
            metric: "50% faster delivery",
          },
          {
            title: "App Store Commission Strategy",
            desc: "Designed compliant alternative payment flows across EU (Digital Markets Act), Thailand, South Africa, and other markets, legally bypassing Apple and Google's 30% billing commission.",
            metric: "€10M+ potential saved",
          },
          {
            title: "KYC & Industrial Compliance",
            desc: "Navigated KYC and industrial regulatory requirements to design compliant experiences that eliminated business penalty exposure entirely, across three enterprise clients.",
            metric: "€40M exposure avoided",
          },
        ],
      },
      {
        id: "02", title: "QueuePay: Self-Checkout",
        cat: "Retail Tech · Hardware UX",
        year: "2022", status: "partial", statusLabel: "Admin & Cashier Live",
        impact: "60% checkout time ↓", accent: "#5ecfb1",
        url: null,
        desc: "Designed 4 interface variants (kiosk, cashier, handheld, mobile) for a retail self-checkout system deployed to 400+ locations, reducing average checkout time by 60%.",
        metrics: [
          { value: "60%", label: "Checkout time reduction" },
          { value: "400+", label: "Deployment locations" },
          { value: "4", label: "Interface variants" },
        ],
        role: "Lead UX/Product Designer",
        about: "Multi-surface design challenge: each variant (customer kiosk, cashier dashboard, handheld scanner, mobile app) had different users, contexts, and constraints. Full customer-facing launch still in progress.",
      },
    ],
  },
  {
    id: "health",
    label: "Health & Accessibility",
    sub: "Medical · EdTech · Inclusive Design",
    projects: [
      {
        id: "03", title: "SimPat: Medical Simulation",
        cat: "HealthTech · Clinical Training",
        year: "2023 to 24", status: "live", statusLabel: "Live",
        impact: "35% simulation start rate ↑", accent: "#9b7ec8",
        url: "https://simpat.ai/",
        desc: "Redesigned a clinical training platform for medical students and doctors to practice AI-powered patient consultations, shifting from text-based interaction to voice-based simulation mirroring real OSCE exams.",
        metrics: [
          { value: "35%", label: "Simulation start rate increase" },
          { value: "28%", label: "Completion rate improvement" },
          { value: "2×", label: "Longer post-session review" },
          { value: "40%", label: "Faster case selection" },
        ],
        role: "UI/UX & Product Designer",
        about: "SimPat brings medical learning closer to real clinical practice. The redesign introduced voice-based consultation, difficulty indicators, and a side-by-side transcript + AI examiner feedback experience. Built around the structure of OSCE exams.",
      },
      {
        id: "04", title: "The Autism Helper",
        cat: "EdTech · Accessibility · SaaS",
        year: "2023 to 24", status: "live", statusLabel: "Live",
        impact: "50% faster resource access", accent: "#f0c060",
        url: "https://theautismhelper.com/",
        desc: "Restructured a digital learning platform for schools supporting autistic students, simplifying navigation, fixing subscription reliability, and introducing school-wide team and access management.",
        metrics: [
          { value: "50%", label: "Faster resource access" },
          { value: "70%", label: "Task completion improvement" },
          { value: "40%+", label: "Monthly active usage increase" },
          { value: "50%+", label: "Fewer subscription issues" },
        ],
        role: "Product Design & UX Strategy",
        about: "The platform supports educators working with autistic students in fast-paced school environments. Redesigned navigation from 4-layer hierarchy to 2-layer, eliminated subscription sync failures, and introduced school seat management and student assessment flows.",
      },
    ],
  },
  {
    id: "consumer",
    label: "Consumer & SaaS",
    sub: "0→1 · Growth · AI Features",
    projects: [
      {
        id: "05", title: "Dreamtter",
        cat: "iOS · Android · 0→1",
        year: "2023", status: "testing", statusLabel: "In Testing",
        impact: "42% retention lift", accent: "#c47fdd",
        url: null,
        desc: "Designed a dream journaling app from 0 to 1, achieving 68% onboarding completion, 35% WAU growth, and a 42% lift in 30-day retention through ritual-based UX and progressive disclosure.",
        metrics: [
          { value: "68%", label: "Onboarding completion" },
          { value: "42%", label: "30-day retention lift" },
          { value: "35%", label: "WAU growth" },
        ],
        role: "Lead Product Designer",
        about: "Dreamtter was built from scratch. The core design challenge was turning a daily journaling habit into a ritual users wanted to return to. Progressive disclosure, streak mechanics, and a calming visual language drove the retention gains.",
      },
      {
        id: "06", title: "Career Tracker Plus",
        cat: "SaaS · AI Features · Career",
        year: "2023", status: "acquired", statusLabel: "Acquired by LinkedIn",
        impact: "70% onboarding lift", accent: "#e87a65",
        url: null,
        desc: "Led UX for a career-management platform, driving 70% onboarding completion via progressive disclosure and 60% AI feature adoption through context-aware assistant entry points.",
        metrics: [
          { value: "70%", label: "Onboarding completion" },
          { value: "60%", label: "AI feature adoption" },
          { value: "→", label: "Acquired by LinkedIn" },
        ],
        role: "Lead UX/Product Designer",
        about: "Designed the full product experience from sign-up through daily use, including the AI assistant integration that became the product's core differentiator. The acquisition validated the product direction.",
      },
      {
        id: "07", title: "Svar.se",
        cat: "SaaS · AI · Expert Marketplace",
        year: "2023", status: "live", statusLabel: "Live",
        impact: "<2 min to booking", accent: "#5ba3f5",
        url: "https://svar.se",
        desc: "Redesigned a Swedish expert consultation platform from broad directory browsing to an AI-powered search-led experience, connecting users with vetted experts for video consultations.",
        metrics: [
          { value: "<2min", label: "Search to booking" },
          { value: "40%", label: "Search usage increase" },
          { value: "35%", label: "Free chat usage growth" },
          { value: "20%", label: "Checkout abandonment reduction" },
        ],
        role: "Product Design & UX Strategy",
        about: "Svar.se helps people get expert guidance on home projects, construction, interior design, and more. The redesign introduced AI-powered natural language search, guest access, free first session, and user-controlled booking, cutting time from search to booked session to under 2 minutes.",
      },
    ],
  },
]

export const ALL_PROJECTS = INDUSTRIES.flatMap(g => g.projects)

// ── HELPERS ───────────────────────────────────────────────────────────────────
function StatusBadge({ status, label }) {
  const cfg = {
    live:     { dot: "#4ade80", color: "#4ade80", bg: "rgba(74,222,128,0.08)" },
    partial:  { dot: "#60a5fa", color: "#60a5fa", bg: "rgba(96,165,250,0.08)" },
    testing:  { dot: "#fbbf24", color: "#fbbf24", bg: "rgba(251,191,36,0.08)" },
    acquired: { dot: "#c9aa7c", color: "#c9aa7c", bg: "rgba(201,170,124,0.12)" },
    proven:   { dot: "#9b7ce0", color: "#9b7ce0", bg: "rgba(155,124,224,0.10)" },
  }
  const c = cfg[status] || cfg.testing
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 2,
      color: c.color, background: c.bg,
      padding: "4px 10px", border: `1px solid ${c.color}22`,
      textTransform: "uppercase",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot, flexShrink: 0, animation: status === "live" ? "pulse 2s ease-in-out infinite" : "none" }} />
      {label}
    </span>
  )
}

// ── CANVAS PARTICLES ──────────────────────────────────────────────────────────
function Stars() {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let W, H, pts, raf
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight }
    resize()
    pts = Array.from({ length: 75 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.0 + 0.3,
    }))
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (const p of pts) {
        const dx = mouse.current.x - p.x, dy = mouse.current.y - p.y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 160) { p.vx += dx / d * 0.01; p.vy += dy / d * 0.01 }
        p.vx *= 0.987; p.vy *= 0.987
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 110) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(201,170,124,${(1 - d / 110) * 0.1})`
            ctx.lineWidth = 0.5
            ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y)
            ctx.stroke()
          }
        }
        const dx = pts[i].x - mouse.current.x, dy = pts[i].y - mouse.current.y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 170) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(201,170,124,${(1 - d / 170) * 0.4})`
          ctx.lineWidth = 0.5
          ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(mouse.current.x, mouse.current.y)
          ctx.stroke()
        }
        ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, pts[i].r, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(201,170,124,0.4)"; ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    const onMove = e => { const r = canvas.getBoundingClientRect(); mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top } }
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", onMove)
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMove) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
}

// ── AMBIENT LAYERS ────────────────────────────────────────────────────────────
function AmbientOrbs({ scrollY }) {
  const orbs = [
    { x: "12%", y: "18%", size: 420, color: "rgba(201,170,124,0.07)", speed: 0.0004 },
    { x: "78%", y: "62%", size: 520, color: "rgba(155,124,224,0.06)", speed: 0.0003 },
    { x: "55%", y: "82%", size: 360, color: "rgba(94,207,177,0.05)", speed: 0.0005 },
  ]
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {orbs.map((o, i) => (
        <div key={i} className="ambient-orb" style={{
          position: "absolute",
          left: o.x, top: o.y,
          width: o.size, height: o.size,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
          transform: `translateY(${Math.sin(scrollY * o.speed + i) * 40}px) translateX(${Math.cos(scrollY * o.speed * 1.3 + i) * 24}px)`,
          transition: "transform 0.1s linear",
          filter: "blur(40px)",
        }} />
      ))}
    </div>
  )
}

function FilmGrain() {
  return <div className="film-grain" aria-hidden="true" />
}

function MediaVideo({ src, label, poster, style = {}, autoPlay = false, muted = true, loop = true, controls = false, heroVideo = false }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!autoPlay || !ref.current) return
    ref.current.play().catch(() => {})
  }, [autoPlay, src])
  return (
    <video
      ref={ref}
      src={src}
      poster={poster || videoPoster(src)}
      muted={muted}
      loop={loop}
      playsInline
      controls={controls}
      aria-label={label}
      {...(heroVideo ? { "data-hero-video": true } : {})}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }}
    />
  )
}

function Showreel() {
  const doubled = [...SHOWREEL, ...SHOWREEL]
  return (
    <ScrollReveal as="section" variant="fade-up" threshold={0.08} className="showreel-section" style={{ paddingTop: 72, paddingBottom: 80 }}>
      <div className="page-pad-x" style={{ marginBottom: 48 }}>
        <div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 4, color: GOLD, marginBottom: 16, textTransform: "uppercase" }}>Motion Reel</div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(24px,3vw,36px)", fontWeight: 400, color: TEXT, marginBottom: 12 }}>Design in <em>motion</em></div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 2, color: DIM, textTransform: "uppercase", lineHeight: 1.6 }}>Click project for full case</div>
        </div>
      </div>
      <div className="showreel-track-wrap">
        <div className="showreel-track">
          {doubled.map((item, i) => (
            <Link
              key={`${item.id}-${i}`}
              to={`/work/${item.id}`}
              data-h
              className="showreel-item"
              aria-label={`Open ${item.label} case study`}
              onClick={() => saveHomeScroll()}
            >
              <MediaVideo src={item.url} label={item.label} autoPlay muted loop />
              <div className="showreel-item-label">{item.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </ScrollReveal>
  )
}

// ── LOADER ────────────────────────────────────────────────────────────────────
function Loader({ onDone }) {
  const [n, setN] = useState(0)
  const [exit, setExit] = useState(false)

  useEffect(() => {
    let v = 0
    const id = setInterval(() => {
      v += Math.random() * 3.5
      if (v >= 100) {
        setN(100)
        setPendingLoadPct(100)
        if (isAudioUnlocked()) playLoadTick(100)
        clearInterval(id)
        setTimeout(() => { setExit(true); setTimeout(onDone, 600) }, 400)
      } else {
        const pct = Math.floor(v)
        setN(pct)
        setPendingLoadPct(pct)
        if (isAudioUnlocked()) playLoadTick(pct)
      }
    }, 22)
    return () => clearInterval(id)
  }, [onDone])

  const R = 64
  const CIRC = 2 * Math.PI * R
  const dash = (n / 100) * CIRC
  const gap = CIRC - dash

  return (
    <div
      onTouchStart={() => { if (!isAudioUnlocked()) unlockAudio() }}
      onClick={() => { if (!isAudioUnlocked()) unlockAudio() }}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "opacity 0.7s ease, transform 0.7s ease", opacity: exit ? 0 : 1, transform: exit ? "scale(0.96)" : "scale(1)", pointerEvents: exit ? "none" : "all" }}>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 5, color: DIM, marginBottom: 48, textTransform: "uppercase" }}>Akinlolu Elijah</div>

      <div style={{ position: "relative", width: 160, height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="160" height="160" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
          <circle cx="80" cy="80" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <circle
            cx="80" cy="80" r={R}
            fill="none"
            stroke={GOLD}
            strokeWidth="1"
            strokeDasharray={`${dash} ${gap}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.04s linear" }}
          />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 52, fontWeight: 300, color: TEXT, lineHeight: 1 }}>{n}</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 3, color: GOLD }}>%</span>
        </div>
      </div>
    </div>
  )
}

// ── PROJECT DETAIL OVERLAY ────────────────────────────────────────────────────
function ProjectDetail({ project, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  if (!project) return null

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(7,7,12,0.97)", overflow: "auto", animation: "fadeIn 0.3s ease" }}>
      <div className="page-pad-x page-shell" style={{ paddingTop: 120, paddingBottom: 80 }}>

        {/* Close */}
        <button data-h onClick={onClose} style={{ position: "fixed", top: 32, right: "var(--page-gutter)", fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 3, color: DIM, background: "none", border: `1px solid ${BORDER}`, padding: "10px 18px", cursor: "none", transition: "all 0.2s", textTransform: "uppercase" }} onMouseEnter={e => { e.target.style.borderColor = GOLD; e.target.style.color = GOLD }} onMouseLeave={e => { e.target.style.borderColor = BORDER; e.target.style.color = DIM }}>
          ESC / Close
        </button>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 64, fontWeight: 300, color: project.accent, lineHeight: 1 }}>{project.id}</span>
            <StatusBadge status={project.status} label={project.statusLabel} />
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(36px,5vw,64px)", fontWeight: 300, color: TEXT, margin: "0 0 16px", lineHeight: 1.1 }}>{project.title}</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {project.cat.split(" · ").map(t => (
              <span key={t} style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 2, color: DIM, padding: "3px 9px", border: `1px solid ${BORDER}`, textTransform: "uppercase" }}>{t}</span>
            ))}
            <span style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 2, color: DIM, padding: "3px 9px", border: `1px solid ${BORDER}` }}>{project.year}</span>
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 2, color: DIM }}>
            Role: {project.role}
          </div>
        </div>

        <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

        {getProjectMedia(project.id)?.hero && (
          <div style={{ marginBottom: 56, borderRadius: 2, overflow: "hidden", border: `1px solid ${BORDER}`, aspectRatio: "16/9", background: "#0a0a10" }}>
            <MediaVideo
              src={getProjectMedia(project.id).hero.url}
              label={getProjectMedia(project.id).hero.label}
              autoPlay
              muted
              loop
              controls
              heroVideo
            />
          </div>
        )}

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 80, marginBottom: 64 }}>
          {/* Description */}
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 4, color: GOLD, marginBottom: 20, textTransform: "uppercase" }}>Overview</div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(18px,2vw,24px)", fontWeight: 300, color: TEXT, lineHeight: 1.65, margin: "0 0 24px" }}>{project.desc}</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 17, fontWeight: 400, color: DIM, lineHeight: 1.9, margin: "0 0 40px" }}>{project.about}</p>

            {/* Work streams (Toke) */}
            {project.streams && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {project.streams.map((s, i) => (
                  <div key={i} style={{ paddingLeft: 20, borderLeft: `2px solid ${project.accent}33` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 20, fontWeight: 500, color: TEXT }}>{s.title}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 2, color: project.accent, whiteSpace: "nowrap", marginLeft: 16 }}>{s.metric}</div>
                    </div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 400, color: DIM, lineHeight: 1.8, margin: 0 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Metrics */}
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 4, color: GOLD, marginBottom: 20, textTransform: "uppercase" }}>Impact</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {project.metrics.map(({ value, label }) => (
                <div key={label} style={{ borderLeft: `2px solid ${project.accent}`, paddingLeft: 20 }}>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 40, fontWeight: 300, color: project.accent, lineHeight: 1 }}>{value}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 2, color: DIM, marginTop: 6, textTransform: "uppercase" }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Live link */}
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener" data-h style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 40, fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 3, color: GOLD, textDecoration: "none", textTransform: "uppercase", borderBottom: `1px solid ${GOLD}44`, paddingBottom: 4, transition: "opacity 0.2s" }} onMouseEnter={e => e.target.style.opacity = "0.7"} onMouseLeave={e => e.target.style.opacity = "1"}>
                Visit Live Site ↗
              </a>
            )}

            {/* CTA (strategy/foresight projects) */}
            {project.cta && (
              <div style={{ marginTop: 48, padding: "32px 36px", border: `1px solid ${project.accent}33`, background: `${project.accent}06` }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 4, color: project.accent, marginBottom: 16, textTransform: "uppercase" }}>Work with me</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "clamp(18px,2vw,26px)", fontWeight: 300, color: TEXT, lineHeight: 1.55, marginBottom: 24 }}>{project.cta}</div>
                <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) }} data-h style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 3, color: project.accent, textDecoration: "none", textTransform: "uppercase", borderBottom: `1px solid ${project.accent}55`, paddingBottom: 4, cursor: "none", transition: "opacity 0.2s" }} onMouseEnter={e => e.target.style.opacity = "0.7"} onMouseLeave={e => e.target.style.opacity = "1"}>
                  Let's talk ↗
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Media */}
        <div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 4, color: GOLD, marginBottom: 24, textTransform: "uppercase" }}>Media & Visuals</div>
          {getProjectMedia(project.id)?.hero ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
              <div style={{ aspectRatio: "16/9", border: `1px solid ${BORDER}`, overflow: "hidden", background: "#0a0a10" }}>
                <MediaVideo
                  src={getProjectMedia(project.id).hero.url}
                  label={getProjectMedia(project.id).hero.label}
                  controls
                  muted={false}
                  loop={false}
                  heroVideo
                />
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 400, color: DIM }}>
                {getProjectMedia(project.id).hero.label}
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {[
                { label: "Hero Screen", type: "image" },
                { label: "User Flow", type: "image" },
                { label: "Product Demo", type: "video" },
                { label: "Mobile View", type: "image" },
                { label: "Design System", type: "image" },
                { label: "Case Study", type: "image" },
              ].map(({ label, type }) => (
                <div key={label} style={{ aspectRatio: "16/9", background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 2, color: DIM, textTransform: "uppercase" }}>{type === "video" ? "▶ Video" : "◻ Image"}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 400, color: DIM }}>{label}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 8, letterSpacing: 2, color: "rgba(100,96,91,0.5)", textTransform: "uppercase" }}>Coming soon</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

// ── PROJECT CARD TEXTURE ───────────────────────────────────────────────────────
function ProjectCardTexture({ variant, accent }) {
  return (
    <div
      className={`project-card-texture project-card-texture--${variant}`}
      aria-hidden="true"
    >
      <div
        className="project-card-texture-glow"
        style={{ background: `radial-gradient(ellipse 80% 60% at 22% 12%, ${accent}30 0%, transparent 58%), radial-gradient(ellipse 65% 50% at 88% 88%, rgba(96, 165, 250, 0.12) 0%, transparent 52%)` }}
      />
      {variant === "noise" ? (
        <svg className="project-card-noise-layer" preserveAspectRatio="none" aria-hidden="true">
          <rect width="100%" height="100%" filter="url(#card-noise)" />
        </svg>
      ) : (
        <div className="project-card-mosaic-layer" />
      )}
    </div>
  )
}

// ── PROJECT CARD ──────────────────────────────────────────────────────────────
function ProjectCard({ p, i }) {
  const navigate = useNavigate()
  const finePointer = useFinePointer()
  const [hov, setHov] = useState(false)
  const meta = getProjectMeta(p.id)
  const texture = i % 2 === 0 ? "noise" : "mosaic"
  const active = finePointer && hov
  return (
    <ScrollReveal
      as="div"
      data-h
      className="project-card"
      variant="scale-up"
      threshold={0.06}
      delay={Math.min(i * 70, 420)}
      onMouseEnter={finePointer ? () => setHov(true) : undefined}
      onMouseLeave={finePointer ? () => setHov(false) : undefined}
      onClick={() => {
        saveHomeScroll()
        navigate(`/work/${p.id}`)
      }}
      style={{
        padding: 0,
        background: BG,
        display: "flex",
        flexDirection: "column",
        minHeight: 400,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ProjectCardTexture variant={texture} accent={p.accent} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: p.accent, transform: active ? "scaleX(1)" : "scaleX(0)", transition: "transform 0.35s ease", transformOrigin: "left", zIndex: 4 }} />

      <div
        className="project-card-hover-layer"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          background: "linear-gradient(180deg, rgba(7,7,12,0.55) 0%, rgba(7,7,12,0.96) 72%)",
          padding: "28px 32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
          pointerEvents: "none",
        }}
      >
        <p style={{ fontFamily: "var(--font-body)", fontSize: 17, fontWeight: 400, color: "rgba(224,219,210,0.88)", lineHeight: 1.75, margin: "0 0 16px" }}>
          {p.desc}
        </p>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 3, color: p.accent, textTransform: "uppercase" }}>
          View case study →
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "28px 32px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 52, fontWeight: 300, lineHeight: 1, color: active ? p.accent : "rgba(255,255,255,0.1)", transition: "color 0.3s", flexShrink: 0 }}>{p.id}</span>
          <StatusBadge status={p.status} label={p.statusLabel} />
        </div>

        {meta && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 14, letterSpacing: 2 }}>{meta.flags.join(" ")}</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 2, color: DIM, textTransform: "uppercase" }}>{meta.region}</span>
          </div>
        )}

        <h3 className="project-card-title" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(22px, 2.2vw, 30px)", fontWeight: 500, color: active ? TEXT : "rgba(224,219,210,0.85)", transition: "color 0.3s", lineHeight: 1.2, margin: "0 0 18px" }}>{p.title}</h3>

        <div className="project-card-tags">
          {p.cat.split(" · ").map(t => (
            <span key={t} className="project-card-tag" style={{ borderColor: active ? `${p.accent}33` : BORDER }}>{t}</span>
          ))}
        </div>

        <div className="project-card-mobile-detail">
          <p className="project-card-mobile-desc">{p.desc}</p>
          <div className="project-card-mobile-cta" style={{ color: p.accent }}>View case study →</div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 20 }}>
          <div className="project-card-impact" style={{ fontFamily: "var(--font-body)", fontSize: 19, fontWeight: 300, color: p.accent, whiteSpace: "nowrap" }}>{p.impact}</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 3, color: DIM, whiteSpace: "nowrap", flexShrink: 0 }}>{p.year}</div>
        </div>
      </div>
      </div>
    </ScrollReveal>
  )
}

// ── WORK ──────────────────────────────────────────────────────────────────────
function Work() {
  return (
    <section id="work" className="work-section" style={{ paddingTop: 120, paddingBottom: 80 }}>
      <ScrollReveal variant="fade-up" className="page-pad-x work-section-intro" style={{ marginBottom: 80 }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 5, color: DIM, marginBottom: 20, textTransform: "uppercase" }}>[ 01 Selected Work ]</div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(38px,5.5vw,68px)", fontWeight: 500, color: TEXT, lineHeight: 1.1, margin: "0 0 16px" }}>
          Work that moves<br /><em>the needle</em>
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 17, fontWeight: 400, color: DIM, margin: 0, lineHeight: 1.7 }}>Click any project for the full case study.</p>
      </ScrollReveal>

      {INDUSTRIES.map((group, gi) => (
        <IndustryGroup key={group.id} group={group} gi={gi} />
      ))}
    </section>
  )
}

function IndustryGroup({ group, gi }) {
  const projectOffset = INDUSTRIES.slice(0, gi).reduce((sum, g) => sum + g.projects.length, 0)
  const gridClass = group.projects.length === 1
    ? "project-grid project-grid--single"
    : group.projects.length >= 3
      ? "project-grid project-grid--wide"
      : "project-grid"
  return (
    <div className="page-pad-x" style={{ marginBottom: gi === INDUSTRIES.length - 1 ? 0 : 72 }}>
      <ScrollReveal variant="slide-left" delay={gi * 80} style={{ marginBottom: 28, paddingTop: gi === 0 ? 0 : 32 }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 3, color: GOLD, marginBottom: 8, textTransform: "uppercase", lineHeight: 1.75 }} className="industry-group-sub">{group.sub}</div>
        <div style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(22px, 2.4vw, 30px)", fontWeight: 400, color: "rgba(224,219,210,0.55)", lineHeight: 1.2 }}>{group.label}</div>
      </ScrollReveal>

      <div className={gridClass}>
        {group.projects.map((p, i) => (
          <ProjectCard key={p.id} p={p} i={projectOffset + i} />
        ))}
      </div>
    </div>
  )
}

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────
function TestimonialCard({ t }) {
  return (
    <article className="testimonial-card">
      <p className="testimonial-card__quote">"{t.quote}"</p>
      <div className="testimonial-card__author">
        <div className="testimonial-card__avatar" style={{ borderColor: `${t.accent}44`, background: `linear-gradient(135deg, ${t.accent}44, rgba(255,255,255,0.06))`, color: t.accent }}>
          {t.avatar ? (
            <img src={t.avatar} alt="" />
          ) : (
            t.name.split(" ").map(n => n[0]).join("").slice(0, 2)
          )}
        </div>
        <div>
          <div className="testimonial-card__name">
            {t.name}{t.company ? `, ${t.company}` : ""}
          </div>
          <div className="testimonial-card__meta">
            {t.role}{t.country ? ` · ${t.country}` : ""}{t.date ? ` · ${t.date}` : ""}
          </div>
        </div>
      </div>
    </article>
  )
}

function Testimonials() {
  const [idx, setIdx] = useState(0)
  const total = TESTIMONIALS.length
  const current = TESTIMONIALS[idx]

  const goPrev = () => setIdx(i => (i - 1 + total) % total)
  const goNext = () => setIdx(i => (i + 1) % total)

  return (
    <section id="testimonials" className="testimonials-section page-pad-x" style={{ paddingTop: 120, paddingBottom: 120, borderTop: `1px solid ${BORDER}` }}>
      <ScrollReveal variant="fade-up">
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 5, color: DIM, marginBottom: 56, textTransform: "uppercase" }}>[ 02 Testimonials ]</div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontVariationSettings: '"wght" 500', fontSize: "clamp(34px,4.5vw,56px)", fontWeight: 500, color: TEXT, lineHeight: 1.1, margin: "0 0 16px" }}>
          What clients say
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 17, color: DIM, lineHeight: 1.7, margin: "0 0 48px", maxWidth: 560 }}>
          From founders and teams I've shipped with.
        </p>
      </ScrollReveal>

      <div className="testimonials-desktop">
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal key={t.id} variant="scale-up" delay={i * 100}>
              <TestimonialCard t={t} />
            </ScrollReveal>
          ))}
        </div>
      </div>

      <ScrollReveal variant="fade-up" delay={100} className="testimonials-mobile">
        <div className="testimonial-carousel testimonial-carousel--mobile">
          <div className="testimonial-carousel__viewport">
            <div key={current.id} className="testimonial-carousel__slide">
              <TestimonialCard t={current} />
            </div>
          </div>

          <div className="testimonial-carousel__controls">
            <button type="button" className="testimonial-carousel__arrow-btn" onClick={goPrev} aria-label="Previous testimonial">
              ←
            </button>
            <div className="testimonial-carousel__dots" role="tablist" aria-label="Testimonials">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={i === idx}
                  aria-label={`Testimonial ${i + 1} of ${total}`}
                  className={`testimonial-carousel__dot${i === idx ? " is-active" : ""}`}
                  onClick={() => setIdx(i)}
                />
              ))}
            </div>
            <button type="button" className="testimonial-carousel__arrow-btn" onClick={goNext} aria-label="Next testimonial">
              →
            </button>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contact" className="contact-section page-pad-x" style={{ paddingTop: 120, paddingBottom: 80, borderTop: `1px solid ${BORDER}` }}>
      <ScrollReveal variant="fade-up">
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 5, color: DIM, marginBottom: 56, textTransform: "uppercase" }}>[ 03 Contact ]</div>
      </ScrollReveal>
      <ScrollReveal variant="fade-up" delay={80}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(16px,2.1vw,26px)", fontWeight: 400, color: DIM, maxWidth: 460, lineHeight: 1.75, margin: "0 0 32px" }}>
          Have a product that needs the right design mind? Let's create something that matters.
        </p>
        <a data-h href={`mailto:${CONTACT.email}`} className="contact-email" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(20px,3.5vw,52px)", fontWeight: 300, color: TEXT, textDecoration: "none", display: "inline-block", borderBottom: `1px solid ${BORDER}`, paddingBottom: 6, transition: "all 0.3s", wordBreak: "break-all" }}>
          {CONTACT.email}
        </a>
        <SocialLinks style={{ marginTop: 44 }} />
      </ScrollReveal>
      <ScrollReveal variant="fade" delay={160} style={{ marginTop: 100, paddingTop: 28, borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 2, color: DIM }}>
        <span>© 2025 Akinlolu Elijah · also known as {CONTACT.alias}</span>
        <SocialLinks />
      </ScrollReveal>
    </section>
  )
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const introDone = hasIntroLoaderCompleted()
  const [loaded, setLoaded] = useState(introDone)
  const [ready, setReady] = useState(introDone)
  const [scrollY, setScrollY] = useState(0)
  const done = useCallback(() => {
    markIntroLoaderCompleted()
    resetLoadTicks()
    enforceScrollPosition()
    setLoaded(true)
    setTimeout(() => {
      enforceScrollPosition()
      setReady(true)
    }, 100)
  }, [])

  useEffect(() => {
    if (introDone) resetLoadTicks()
  }, [introDone])

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="portfolio-root" style={{ background: BG, minHeight: "100vh", color: TEXT, position: "relative" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${GOLD}; color: ${BG}; }
        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-track { background: ${BG}; }
        ::-webkit-scrollbar-thumb { background: ${GOLD}; border-radius: 2px; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .hero-ticker-track {
          display: flex;
          white-space: nowrap;
          animation: ticker 45s linear infinite;
        }
        .hero-ticker-item {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 2px;
          color: ${DIM};
          text-transform: uppercase;
          padding: 0 40px;
          flex-shrink: 0;
        }
        .hero-ticker-item::after {
          content: "·";
          margin-left: 40px;
          opacity: 0.35;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes musicPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        @keyframes showreelScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes heroReelFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes testimonialFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .hero-reel-float {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          height: 100%;
          width: min(44vw, 520px);
          max-width: 100%;
          z-index: 0;
          opacity: 0.32;
          overflow: hidden;
          border-left: 1px solid ${BORDER};
          animation: heroReelFade 1.2s ease;
          mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.5) 28%, rgba(0,0,0,0.9) 100%);
        }
        .hero-reel-float::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, ${BG} 0%, transparent 35%, ${BG}88 100%);
          pointer-events: none;
        }
        .hero-stats-mobile {
          display: none;
        }
        .testimonials-mobile {
          display: none;
        }
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          width: 100%;
        }
        .testimonials-grid > * {
          height: 100%;
        }
        @media (min-width: 769px) and (max-width: 1099px) {
          .testimonials-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        .testimonial-carousel--mobile {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: none;
        }
        .testimonial-carousel--mobile .testimonial-carousel__viewport {
          width: 100%;
          min-width: 0;
        }
        .testimonial-carousel__controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-top: 24px;
        }
        .testimonial-carousel__arrow-btn {
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-body);
          font-size: 20px;
          line-height: 1;
          color: ${DIM};
          background: rgba(255,255,255,0.03);
          border: 1px solid ${BORDER};
          border-radius: 10px;
          padding: 0;
          transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .testimonial-carousel__nav {
          font-family: var(--font-body);
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: ${DIM};
          background: none;
          border: none;
          padding: 8px 4px;
          flex-shrink: 0;
          transition: color 0.2s ease;
        }
        .testimonial-carousel--mobile .testimonial-carousel__dots {
          margin-top: 0;
          max-width: none;
          flex-wrap: wrap;
        }
        @media (hover: hover) and (pointer: fine) {
          .portfolio-root { cursor: none; }
          .hero-cta-btn:hover { border-color: ${GOLD} !important; color: ${GOLD} !important; }
          .contact-email:hover { color: ${GOLD} !important; border-color: ${GOLD} !important; }
        }
        .hero-section {
          min-height: 100vh;
          padding: 100px var(--page-gutter) 88px;
          max-width: 100%;
        }
        .hero-inner {
          max-width: 85vw;
        }
        .showreel-section {
          padding-top: 48px !important;
          padding-bottom: 56px !important;
        }
        .showreel-track-wrap {
          overflow: hidden;
          border-top: 1px solid ${BORDER};
          border-bottom: 1px solid ${BORDER};
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%);
          animation: showreelFadeIn 1.2s ease both;
        }
        @keyframes showreelFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .showreel-track {
          display: flex; width: max-content;
          animation: showreelScroll 48s linear infinite;
        }
        .showreel-track:hover { animation-play-state: paused; }
        .showreel-item {
          position: relative; width: clamp(280px, 28vw, 420px); aspect-ratio: 16/10;
          flex-shrink: 0; border-right: 1px solid ${BORDER}; overflow: hidden;
          display: block; text-decoration: none; color: inherit;
        }
        .showreel-item video {
          filter: brightness(0.62) contrast(1.08) saturate(0.78);
          transition: filter 0.45s ease;
        }
        .showreel-item:hover video {
          filter: brightness(0.82) contrast(1.02) saturate(0.92);
        }
        .showreel-item::after {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(7,7,12,0.18);
          pointer-events: none;
          transition: opacity 0.45s ease;
        }
        .showreel-item:hover::after {
          opacity: 0.35;
        }
        .showreel-item-label {
          position: absolute; bottom: 0; left: 0; right: 0; padding: 16px 20px;
          font-family: var(--font-body); font-size: 11px; font-weight: 500; letter-spacing: 1.5px;
          color: ${TEXT}; text-transform: uppercase;
          background: linear-gradient(transparent, rgba(7,7,12,0.92));
        }
        .project-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        .project-card-title {
          word-break: keep-all;
          overflow-wrap: normal;
          hyphens: none;
        }
        .project-card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 6px;
          row-gap: 14px;
        }
        .project-card-tag {
          font-family: var(--font-body);
          font-size: 11px;
          letter-spacing: 2px;
          line-height: 1.55;
          color: ${DIM};
          padding: 6px 10px;
          border: 1px solid ${BORDER};
          text-transform: uppercase;
          white-space: nowrap;
          transition: border-color 0.3s;
        }
        .industry-group-sub {
          max-width: none;
          white-space: nowrap;
        }
        .project-card-mobile-detail {
          display: none;
        }
        .testimonial-carousel__slide {
          animation: testimonialFade 0.45s ease;
        }
        .testimonial-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid ${BORDER};
          padding: 32px 32px 28px;
          display: flex;
          flex-direction: column;
          gap: 28px;
          min-height: 280px;
          height: 100%;
        }
        .testimonial-card__quote {
          font-family: var(--font-body);
          font-size: clamp(16px, 1.6vw, 18px);
          color: ${TEXT};
          line-height: 1.8;
          margin: 0;
          flex: 1;
        }
        .testimonial-card__author {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .testimonial-card__avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 600;
        }
        .testimonial-card__avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .testimonial-card__name {
          font-family: var(--font-body);
          font-size: 16px;
          font-weight: 600;
          color: ${TEXT};
          margin-bottom: 4px;
        }
        .testimonial-card__meta {
          font-family: var(--font-body);
          font-size: 13px;
          color: ${DIM};
        }
        .testimonial-carousel__dot.is-active {
          background: ${GOLD};
          transform: scale(1.2);
        }
        .testimonial-carousel__dots {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }
        .testimonial-carousel__dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          padding: 0;
          background: rgba(255,255,255,0.18);
          transition: transform 0.25s ease, background 0.25s ease;
        }
        @media (hover: hover) and (pointer: fine) {
          .testimonial-carousel__nav:hover,
          .testimonial-carousel__arrow-btn:hover {
            color: ${GOLD};
            border-color: rgba(201,170,124,0.35);
          }
          .testimonial-carousel__dot:hover {
            background: rgba(201,170,124,0.45);
          }
        }
        .project-card {
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .project-card-texture {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          background: ${BG};
        }
        .project-card-texture-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .project-card-noise-layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.32;
          mix-blend-mode: soft-light;
          pointer-events: none;
        }
        .project-card-mosaic-layer {
          position: absolute;
          inset: 0;
          opacity: 0.5;
          background-image: radial-gradient(rgba(255,255,255,0.16) 0.65px, transparent 0.65px);
          background-size: 5px 5px;
          mask-image: radial-gradient(ellipse 90% 80% at 50% 40%, #000 20%, transparent 78%);
          pointer-events: none;
        }
        .project-card-texture--mosaic::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 30% 25%, rgba(96, 165, 250, 0.1), transparent 42%),
            radial-gradient(circle at 75% 70%, rgba(59, 130, 246, 0.08), transparent 40%);
          pointer-events: none;
        }
        @media (min-width: 900px) {
          .project-grid .project-card {
            border-radius: 0;
            border: none;
          }
        }
        @media (min-width: 900px) {
          .project-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1px;
            background: ${BORDER};
            border: 1px solid ${BORDER};
          }
          .project-grid--wide {
            grid-template-columns: repeat(3, 1fr);
          }
          .project-grid--single {
            grid-template-columns: 1fr;
          }
          .project-grid--single .project-card {
            min-height: 360px;
          }
          .project-card {
            min-height: 420px;
          }
        }
        .work-section-intro {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .work-section-intro h2,
        .work-section-intro p {
          max-width: none;
          margin-left: 0;
          margin-right: 0;
        }
        @media (min-width: 769px) {
          .work-section-intro {
            align-items: center;
            text-align: center;
          }
          .work-section-intro h2 {
            margin: 0 0 16px;
            max-width: 720px;
          }
          .work-section-intro p {
            margin: 0;
            max-width: 480px;
          }
        }
        @media (max-width: 768px) {
          .hero-section {
            min-height: auto;
            padding-top: 88px;
            padding-bottom: 72px;
          }
          .hero-inner {
            max-width: 100%;
          }
          .hero-ghost,
          .hero-side-label {
            display: none;
          }
          .hero-reel-float {
            display: none !important;
          }
          .hero-stats-desktop {
            display: none !important;
          }
          .hero-stats-mobile {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 28px 32px;
          }
          .hero-scroll-cue {
            visibility: hidden;
            pointer-events: none;
          }
          .work-section {
            padding-top: 80px !important;
            padding-bottom: 56px !important;
          }
          .testimonials-desktop {
            display: none !important;
          }
          .testimonials-mobile {
            display: block !important;
          }
          .testimonials-section {
            padding-top: 80px !important;
          }
          .testimonial-carousel--mobile .testimonial-card {
            min-height: auto !important;
            padding: 24px 20px 22px !important;
          }
          .testimonial-carousel--mobile .testimonial-carousel__controls {
            position: relative;
            justify-content: space-between;
            margin-inline: calc(16px - var(--page-gutter));
            gap: 0;
          }
          .testimonial-carousel--mobile .testimonial-carousel__dots {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
          .contact-section {
            padding-top: 80px !important;
          }
          .project-card-tags {
            row-gap: 16px;
            gap: 10px 6px;
          }
          .project-card-tag {
            line-height: 1.65;
            padding: 7px 10px;
          }
          .industry-group-sub {
            line-height: 1.85;
            max-width: none;
            white-space: normal;
          }
          .project-card {
            min-height: auto !important;
          }
          .project-grid {
            gap: 24px;
          }
          .project-card > div:last-child {
            padding: 28px 16px !important;
          }
          .project-card > div:last-child > div:last-child {
            margin-top: 32px !important;
          }
          .project-card-mobile-detail {
            display: block;
            margin-top: 26px;
            padding-top: 26px;
            padding-bottom: 8px;
            border-top: 1px solid ${BORDER};
          }
          .project-card-mobile-desc {
            font-family: var(--font-body);
            font-size: 16px;
            font-weight: 400;
            color: ${DIM};
            line-height: 1.75;
            margin: 0 0 22px;
          }
          .project-card-mobile-cta {
            font-family: var(--font-body);
            font-size: 11px;
            letter-spacing: 3px;
            text-transform: uppercase;
            padding-bottom: 8px;
          }
          .showreel-item {
            width: min(78vw, 300px) !important;
          }
          .hero-ticker-item {
            padding: 0 24px;
          }
          .hero-ticker {
            display: none;
          }
        }
      `}</style>

      <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
        <filter id="card-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      {!loaded && <Loader onDone={done} />}
      <div style={{ position: "relative", zIndex: 1 }}>
        <SiteNav scrollY={scrollY} home />
        <HeroSection />
        <Showreel />
        <Work />
        <Testimonials />
        <Contact />
      </div>
    </div>
  )
}
