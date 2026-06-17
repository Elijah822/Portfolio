import { useState, useEffect, useRef, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getProjectMedia, SHOWREEL, videoPoster } from "./data/projectMedia.js"
import { getProjectMeta } from "./data/projectMeta.js"
import { projectThumbnail } from "./lib/siteThumbnail.js"
import SoundButton from "./components/SoundButton.jsx"
import {
  isAudioUnlocked,
  playLoadTick,
  resetLoadTicks,
  setPendingLoadPct,
  unlockAudio,
} from "./lib/portfolioAudio.js"
import { hasIntroLoaderCompleted, markIntroLoaderCompleted } from "./lib/loaderState.js"

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
        year: "2024–25", status: "live", statusLabel: "Live",
        impact: "€40M+ impact", accent: "#c9aa7c",
        url: "https://www.toke.ai/",
        desc: "Lead Product Designer at Toke — an e-commerce and retail platform serving major enterprise clients across storefronts, payments, compliance, and AI-powered design infrastructure. Solely responsible for product design across three concurrent enterprise clients.",
        metrics: [
          { value: "€40M+", label: "Regulatory exposure avoided (KYC)" },
          { value: "€M+", label: "App Store commissions saved" },
          { value: "50%", label: "Team velocity via AI design system" },
          { value: "3", label: "Enterprise clients, simultaneously" },
        ],
        role: "Lead Product Designer",
        about: "At Toke, I operated as the sole designer across three major enterprise clients simultaneously — covering three distinct high-stakes workstreams:",
        streams: [
          {
            title: "AI-Powered Design System",
            desc: "Built a Claude MCP-integrated design system automating token generation, component scaffolding, and documentation — compressing 2-week design cycles to under one week.",
            metric: "50% faster delivery",
          },
          {
            title: "App Store Commission Strategy",
            desc: "Designed compliant alternative payment flows across EU (Digital Markets Act), Thailand, South Africa, and other markets — legally bypassing Apple and Google's 30% billing commission.",
            metric: "Tens of €M saved",
          },
          {
            title: "KYC & Industrial Compliance",
            desc: "Navigated KYC and industrial regulatory requirements to design compliant experiences that eliminated business penalty exposure entirely — across three enterprise clients.",
            metric: "€40M exposure avoided",
          },
        ],
      },
      {
        id: "02", title: "QueuePay — Self-Checkout",
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
        id: "03", title: "SimPat — Medical Simulation",
        cat: "HealthTech · Clinical Training",
        year: "2023–24", status: "live", statusLabel: "Live",
        impact: "35% simulation start rate ↑", accent: "#9b7ec8",
        url: "https://simpat.ai/",
        desc: "Redesigned a clinical training platform for medical students and doctors to practice AI-powered patient consultations — shifting from text-based interaction to voice-based simulation mirroring real OSCE exams.",
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
        year: "2023–24", status: "live", statusLabel: "Live",
        impact: "50% faster resource access", accent: "#f0c060",
        url: "https://theautismhelper.com/",
        desc: "Restructured a digital learning platform for schools supporting autistic students — simplifying navigation, fixing subscription reliability, and introducing school-wide team and access management.",
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
        desc: "Designed a dream journaling app from 0 to 1 — achieving 68% onboarding completion, 35% WAU growth, and a 42% lift in 30-day retention through ritual-based UX and progressive disclosure.",
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
        desc: "Led UX for a career-management platform — driving 70% onboarding completion via progressive disclosure and 60% AI feature adoption through context-aware assistant entry points.",
        metrics: [
          { value: "70%", label: "Onboarding completion" },
          { value: "60%", label: "AI feature adoption" },
          { value: "→", label: "Acquired by LinkedIn" },
        ],
        role: "Lead UX/Product Designer",
        about: "Designed the full product experience from sign-up through daily use — including the AI assistant integration that became the product's core differentiator. The acquisition validated the product direction.",
      },
      {
        id: "07", title: "Svar.se",
        cat: "SaaS · AI · Expert Marketplace",
        year: "2023", status: "live", statusLabel: "Live",
        impact: "<2 min to booking", accent: "#5ba3f5",
        url: "https://svar.se",
        desc: "Redesigned a Swedish expert consultation platform from broad directory browsing to an AI-powered search-led experience — connecting users with vetted experts for video consultations.",
        metrics: [
          { value: "<2min", label: "Search to booking" },
          { value: "40%", label: "Search usage increase" },
          { value: "35%", label: "Free chat usage growth" },
          { value: "20%", label: "Checkout abandonment reduction" },
        ],
        role: "Product Design & UX Strategy",
        about: "Svar.se helps people get expert guidance on home projects, construction, interior design, and more. The redesign introduced AI-powered natural language search, guest access, free first session, and user-controlled booking — cutting time from search to booked session to under 2 minutes.",
      },
    ],
  },
]

export const ALL_PROJECTS = INDUSTRIES.flatMap(g => g.projects)

export const ROLES = [
  "Product Designer",
  "Design Systems Architect",
  "Regulatory UX Strategist",
  "AI Integration Lead",
  "Enterprise UX Lead",
]

export const IMPACT_STATS = [
  { value: "€40M+", label: "Impact delivered" },
  { value: "10+", label: "Products shipped" },
  { value: "6+", label: "Years of craft" },
  { value: "3", label: "Enterprise clients" },
]

// ── HELPERS ───────────────────────────────────────────────────────────────────
const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#!%"

function useScramble(text, trigger, speed = 16) {
  const [out, setOut] = useState("")
  useEffect(() => {
    if (!trigger) return
    let f = 0
    const total = text.length * speed
    let raf
    const tick = () => {
      setOut(text.split("").map((c, i) => {
        if (c === " ") return " "
        return f > i * speed ? c : POOL[Math.floor(Math.random() * POOL.length)]
      }).join(""))
      if (f < total) { f++; raf = requestAnimationFrame(tick) } else setOut(text)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [trigger, text, speed])
  return out
}

function useReveal(threshold = 0.1) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, vis]
}

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

function MediaVideo({ src, label, poster, style = {}, autoPlay = false, muted = true, loop = true, controls = false }) {
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
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }}
    />
  )
}

function Showreel() {
  const [ref, vis] = useReveal(0.15)
  const doubled = [...SHOWREEL, ...SHOWREEL]
  return (
    <section ref={ref} style={{ padding: "72px 0 80px", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)", transition: "all 0.9s" }}>
      <div style={{ padding: "0 56px", marginBottom: 48, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 4, color: GOLD, marginBottom: 16, textTransform: "uppercase" }}>Motion Reel</div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(24px,3vw,36px)", fontWeight: 400, color: TEXT }}>Design in <em>motion</em></div>
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 2, color: DIM, textTransform: "uppercase", maxWidth: 280, lineHeight: 1.6, textAlign: "right" }}>Hover to preview · Click project for full case</div>
      </div>
      <div className="showreel-track-wrap">
        <div className="showreel-track">
          {doubled.map((item, i) => (
            <div key={`${item.id}-${i}`} className="showreel-item">
              <MediaVideo src={item.url} label={item.label} autoPlay muted loop />
              <div className="showreel-item-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
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
    <div onMouseMove={() => { if (!isAudioUnlocked()) unlockAudio() }} onTouchStart={() => { if (!isAudioUnlocked()) unlockAudio() }} onClick={() => { if (!isAudioUnlocked()) unlockAudio() }}
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

// ── NAV ───────────────────────────────────────────────────────────────────────
function Nav({ scrollY }) {
  const max = Math.max(1, (typeof document !== "undefined" ? document.documentElement.scrollHeight : 1) - (typeof window !== "undefined" ? window.innerHeight : 1))
  const pct = Math.min((scrollY / max) * 100, 100)
  const scrolled = scrollY > 60
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "20px 56px", display: "flex", justifyContent: "space-between", alignItems: "center", background: scrolled ? "rgba(7,7,12,0.9)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: `1px solid ${scrolled ? BORDER : "transparent"}`, transition: "all 0.3s" }}>
      <span style={{ fontFamily: "var(--font-heading)", fontSize: 22, color: TEXT, letterSpacing: 3, fontWeight: 300 }}>AE</span>
      <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
        {[["work", "Work"], ["about", "About"], ["exploration", "Explore"], ["contact", "Contact"]].map(([id, label]) => (
          id === "about" || id === "exploration" ? (
            <Link key={id} to={id === "about" ? "/about" : "/exploration"} data-h style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 3, color: DIM, textDecoration: "none", cursor: "none", textTransform: "uppercase", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = TEXT} onMouseLeave={e => e.target.style.color = DIM}>{label}</Link>
          ) : (
            <button key={id} data-h onClick={() => go(id)} style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 3, color: DIM, background: "none", border: "none", cursor: "none", padding: 0, textTransform: "uppercase", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = TEXT} onMouseLeave={e => e.target.style.color = DIM}>{label}</button>
          )
        ))}
        <a data-h href="/games" style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 3, color: DIM, textDecoration: "none", cursor: "none", textTransform: "uppercase", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = GOLD} onMouseLeave={e => e.target.style.color = DIM}>Game ✦</a>
        <SoundButton />
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, height: 1, background: GOLD, width: `${pct}%`, transition: "width 0.1s linear" }} />
    </nav>
  )
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero({ ready }) {
  const w1 = useScramble("PRODUCT", ready, 14)
  const w2 = useScramble("DESIGNER", ready, 12)
  const [roleIdx, setRoleIdx] = useState(0)
  const [roleFade, setRoleFade] = useState(true)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [reelIdx, setReelIdx] = useState(0)
  const heroReel = SHOWREEL[reelIdx]

  useEffect(() => {
    if (!ready) return
    const id = setInterval(() => setReelIdx(i => (i + 1) % SHOWREEL.length), 7000)
    return () => clearInterval(id)
  }, [ready])

  useEffect(() => {
    if (!ready) return
    const id = setInterval(() => {
      setRoleFade(false)
      setTimeout(() => {
        setRoleIdx(i => (i + 1) % ROLES.length)
        setRoleFade(true)
      }, 400)
    }, 2800)
    return () => clearInterval(id)
  }, [ready])

  const handleMouse = useCallback(e => {
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2
    setMouse({ x: (e.clientX - cx) / cx, y: (e.clientY - cy) / cy })
  }, [])

  const f = delay => ({ opacity: ready ? 1 : 0, transition: `opacity 0.9s ${delay}s ease` })

  return (
    <section onMouseMove={handleMouse} style={{ position: "relative", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 56px", overflow: "hidden" }}>
      {heroReel && (
        <div key={heroReel.url} className="hero-reel-float">
          <MediaVideo src={heroReel.url} label={heroReel.label} autoPlay muted loop />
        </div>
      )}

      {/* Ghost initials — parallax background */}
      <div style={{
        position: "absolute", right: "-2vw", bottom: "-8vw",
        fontFamily: "var(--font-heading)", fontSize: "34vw",
        fontWeight: 300, color: "rgba(255,255,255,0.018)",
        lineHeight: 1, userSelect: "none", pointerEvents: "none",
        transform: `translate(${mouse.x * -18}px, ${mouse.y * -12}px)`,
        transition: "transform 0.6s ease",
      }}>AE</div>

      {/* Year label — right column */}
      <div style={{ ...f(1.8), position: "absolute", right: 56, top: "50%", transform: "translateY(-50%) rotate(90deg)", transformOrigin: "center center", fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 5, color: DIM, whiteSpace: "nowrap" }}>
        LAGOS · NIGERIA · 2025
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "85vw" }}>
        {/* Label */}
        <div style={{ ...f(0.2), fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 5, color: DIM, marginBottom: 36 }}>
          [ AKINLOLU ELIJAH · PRODUCT DESIGNER ]
        </div>

        {/* Huge headline */}
        <div style={{ ...f(0.05), fontFamily: "var(--font-heading)", fontVariationSettings: '"wght" 300', fontWeight: 300, lineHeight: 0.87, letterSpacing: -2, transform: `perspective(800px) rotateX(${mouse.y * -2}deg) rotateY(${mouse.x * 3}deg)`, transition: "transform 0.4s ease" }}>
          <div style={{ fontSize: "clamp(68px,12vw,168px)", color: TEXT }}>{w1 || "PRODUCT"}</div>
          <div style={{ fontSize: "clamp(68px,12vw,168px)", color: GOLD, fontWeight: 500 }}>{w2 || "DESIGNER"}</div>
        </div>

        {/* Morphing role */}
        <div style={{ ...f(1.0), marginTop: 28, height: 32, overflow: "hidden" }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "clamp(16px,1.8vw,22px)", fontWeight: 500, color: DIM, opacity: roleFade ? 1 : 0, transform: roleFade ? "none" : "translateY(8px)", transition: "opacity 0.4s ease, transform 0.4s ease" }}>
            {ROLES[roleIdx]}
          </div>
        </div>

        {/* Bio */}
        <p style={{ ...f(1.15), fontFamily: "var(--font-body)", fontSize: "clamp(15px,1.5vw,18px)", fontWeight: 400, color: DIM, lineHeight: 1.8, maxWidth: 560, margin: "24px 0 0" }}>
          I design products people understand and businesses can grow with — riding the AI wave to move faster, think sharper, and ship more. Currently building my own products with{" "}
          <span style={{ color: TEXT }}>Cursor</span> and <span style={{ color: TEXT }}>Claude Code</span>, turning design decisions into working software without the old handoff tax.
        </p>

        {/* Impact stats row */}
        <div style={{ ...f(1.4), display: "flex", gap: 40, marginTop: 40, flexWrap: "wrap" }}>
          {IMPACT_STATS.map(({ value, label }) => (
            <div key={label} style={{ borderLeft: `1px solid ${BORDER}`, paddingLeft: 16 }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 28, fontWeight: 300, color: GOLD, lineHeight: 1 }}>{value}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 2, color: DIM, marginTop: 5, textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ ...f(1.9), marginTop: 44 }}>
          <button data-h onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
            style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 3, color: TEXT, background: "none", border: `1px solid ${BORDER}`, padding: "15px 28px", cursor: "none", textTransform: "uppercase", transition: "all 0.3s" }}
            onMouseEnter={e => { e.target.style.borderColor = GOLD; e.target.style.color = GOLD }}
            onMouseLeave={e => { e.target.style.borderColor = BORDER; e.target.style.color = TEXT }}
          >View Work →</button>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{ ...f(2.4), position: "absolute", bottom: 64, left: 56, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ height: 1, width: 40, background: `linear-gradient(to right, transparent, ${DIM})` }} />
        <span style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 4, color: DIM, textTransform: "uppercase" }}>Scroll to explore</span>
      </div>

      <HeroTicker />
    </section>
  )
}

const TICKER_ITEMS = [
  "FinTech",
  "Healthcare",
  "AI Integration",
  "Design Systems",
  "Regulatory UX",
  "Consumer Apps",
  "Acquired by LinkedIn",
]

function HeroTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 52, borderTop: `1px solid ${BORDER}`, overflow: "hidden", display: "flex", alignItems: "center" }}>
      <div className="hero-ticker-track">
        {items.map((label, i) => (
          <span key={`${label}-${i}`} className="hero-ticker-item">{label}</span>
        ))}
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
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 56px 80px" }}>

        {/* Close */}
        <button data-h onClick={onClose} style={{ position: "fixed", top: 32, right: 56, fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 3, color: DIM, background: "none", border: `1px solid ${BORDER}`, padding: "10px 18px", cursor: "none", transition: "all 0.2s", textTransform: "uppercase" }} onMouseEnter={e => { e.target.style.borderColor = GOLD; e.target.style.color = GOLD }} onMouseLeave={e => { e.target.style.borderColor = BORDER; e.target.style.color = DIM }}>
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

// ── PROJECT CARD ──────────────────────────────────────────────────────────────
function ProjectCard({ p, i }) {
  const navigate = useNavigate()
  const [hov, setHov] = useState(false)
  const [ref, vis] = useReveal(0.05)
  const media = getProjectMedia(p.id)
  const meta = getProjectMeta(p.id)
  const thumb = projectThumbnail(meta) || (!meta?.noThumbnail && media?.hero ? videoPoster(media.hero.url) : null)
  return (
    <div ref={ref} data-h className="project-card"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => navigate(`/work/${p.id}`)}
      style={{
        padding: 0,
        background: BG,
        cursor: "none",
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(14px)",
        transition: `opacity 0.6s ${i * 0.07}s ease, transform 0.6s ${i * 0.07}s ease`,
        display: "flex",
        flexDirection: "column",
        minHeight: thumb ? 340 : 260,
        position: "relative",
        overflow: "hidden",
      }}>
      {thumb && (
        <div className="project-card-thumb">
          <img src={thumb} alt="" />
        </div>
      )}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: p.accent, transform: hov ? "scaleX(1)" : "scaleX(0)", transition: "transform 0.35s ease", transformOrigin: "left", zIndex: 2 }} />

      <div style={{ position: "relative", zIndex: 1, padding: "28px 32px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 52, fontWeight: 300, lineHeight: 1, color: hov ? p.accent : "rgba(255,255,255,0.1)", transition: "color 0.3s", flexShrink: 0 }}>{p.id}</span>
          <StatusBadge status={p.status} label={p.statusLabel} />
        </div>

        {meta && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 14, letterSpacing: 2 }}>{meta.flags.join(" ")}</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 2, color: DIM, textTransform: "uppercase" }}>{meta.region}</span>
          </div>
        )}

        <h3 className="project-card-title" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(22px, 2.2vw, 30px)", fontWeight: 500, color: hov ? TEXT : "rgba(224,219,210,0.85)", transition: "color 0.3s", lineHeight: 1.2, margin: "0 0 18px" }}>{p.title}</h3>

        <div className="project-card-tags" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {p.cat.split(" · ").map(t => (
            <span key={t} style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 2, color: DIM, padding: "4px 10px", border: `1px solid ${hov ? `${p.accent}33` : BORDER}`, textTransform: "uppercase", whiteSpace: "nowrap", transition: "border-color 0.3s" }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 20 }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 24, fontWeight: 300, color: p.accent, whiteSpace: "nowrap" }}>{p.impact}</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 3, color: DIM, whiteSpace: "nowrap", flexShrink: 0 }}>{p.year}</div>
        </div>
      </div>
      </div>
    </div>
  )
}

// ── WORK ──────────────────────────────────────────────────────────────────────
function Work() {
  const [hdr, hdrVis] = useReveal()
  return (
    <section id="work" style={{ paddingTop: 120, paddingBottom: 80 }}>
      <div ref={hdr} style={{ padding: "0 56px", marginBottom: 80, opacity: hdrVis ? 1 : 0, transform: hdrVis ? "none" : "translateY(20px)", transition: "all 0.8s" }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 5, color: DIM, marginBottom: 20, textTransform: "uppercase" }}>[ 01 — Selected Work ]</div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(38px,5.5vw,68px)", fontWeight: 500, color: TEXT, lineHeight: 1.1, margin: "0 0 16px" }}>
          Work that moves<br /><em>the needle</em>
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 17, fontWeight: 400, color: DIM, margin: 0, lineHeight: 1.7 }}>Click any project for the full case study.</p>
      </div>

      {INDUSTRIES.map((group, gi) => (
        <IndustryGroup key={group.id} group={group} gi={gi} />
      ))}
    </section>
  )
}

function IndustryGroup({ group, gi }) {
  const [ref, vis] = useReveal(0.05)
  const projectOffset = INDUSTRIES.slice(0, gi).reduce((sum, g) => sum + g.projects.length, 0)
  const gridClass = group.projects.length === 1
    ? "project-grid project-grid--single"
    : group.projects.length >= 3
      ? "project-grid project-grid--wide"
      : "project-grid"
  return (
    <div style={{ padding: "0 56px", marginBottom: gi === INDUSTRIES.length - 1 ? 0 : 72 }}>
      <div ref={ref} style={{ marginBottom: 28, paddingTop: gi === 0 ? 0 : 8, borderTop: gi === 0 ? "none" : `1px solid ${BORDER}`, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(12px)", transition: "all 0.7s" }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 3, color: GOLD, marginBottom: 8, textTransform: "uppercase" }}>{group.sub}</div>
        <div style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(22px, 2.4vw, 30px)", fontWeight: 400, color: "rgba(224,219,210,0.55)", lineHeight: 1.2 }}>{group.label}</div>
      </div>

      <div className={gridClass}>
        {group.projects.map((p, i) => (
          <ProjectCard key={p.id} p={p} i={projectOffset + i} />
        ))}
      </div>
    </div>
  )
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────
function About() {
  const [ref, vis] = useReveal()
  return (
    <section id="about" ref={ref} style={{ padding: "120px 56px", borderTop: `1px solid ${BORDER}` }}>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 5, color: DIM, marginBottom: 56, textTransform: "uppercase" }}>[ 02 — About ]</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "64px 80px", marginBottom: 64, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)", transition: "all 0.85s" }}>
        <div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(22px,2.6vw,34px)", fontWeight: 400, color: TEXT, lineHeight: 1.55, margin: "0 0 24px" }}>
            I'm a product designer who believes great design is invisible — until it isn't, and then it changes everything.
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 17, fontWeight: 400, color: DIM, lineHeight: 1.95, margin: 0 }}>
            Over 6 years, I've worked across consumer apps, enterprise platforms, fintech, healthcare, and AI-native products. I design where user needs, business goals, and regulatory reality collide — currently at Toke, designing the future of financial product experiences.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignContent: "start" }}>
          {IMPACT_STATS.map(({ value, label }) => (
            <div key={label}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 48, fontWeight: 300, color: GOLD, lineHeight: 1 }}>{value}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 3, color: DIM, marginTop: 8, textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ paddingTop: 36, borderTop: `1px solid ${BORDER}`, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 36, opacity: vis ? 1 : 0, transition: "all 0.85s 0.2s" }}>
        {[
          ["Design", "Figma · Systems · Prototyping · Motion"],
          ["Research", "User Research · Usability · Data Synthesis"],
          ["AI & Tools", "Claude MCP · ChatGPT · AI-native UX"],
          ["Strategy", "Regulatory UX · Compliance · Enterprise"],
        ].map(([cat, skills]) => (
          <div key={cat}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 3, color: GOLD, marginBottom: 12, textTransform: "uppercase" }}>{cat}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 15, color: DIM, lineHeight: 2 }}>{skills}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
function Contact() {
  const [ref, vis] = useReveal()
  return (
    <section id="contact" ref={ref} style={{ padding: "120px 56px 80px", borderTop: `1px solid ${BORDER}` }}>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 5, color: DIM, marginBottom: 56, textTransform: "uppercase" }}>[ 03 — Contact ]</div>
      <div style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)", transition: "all 0.85s" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(16px,2.1vw,26px)", fontWeight: 400, color: DIM, maxWidth: 460, lineHeight: 1.75, margin: "0 0 32px" }}>
          Have a product that needs the right design mind? Let's create something that matters.
        </p>
        <a data-h href="mailto:akinloluelijah822@gmail.com" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(20px,3.5vw,52px)", fontWeight: 300, color: TEXT, textDecoration: "none", display: "inline-block", borderBottom: `1px solid ${BORDER}`, paddingBottom: 6, transition: "all 0.3s" }} onMouseEnter={e => { e.target.style.color = GOLD; e.target.style.borderColor = GOLD }} onMouseLeave={e => { e.target.style.color = TEXT; e.target.style.borderColor = BORDER }}>
          akinloluelijah822@gmail.com
        </a>
        <div style={{ display: "flex", gap: 32, marginTop: 44 }}>
          <a data-h href="https://www.linkedin.com/in/akinlolu-elijah/" target="_blank" rel="noopener" style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 3, color: DIM, textDecoration: "none", textTransform: "uppercase", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = TEXT} onMouseLeave={e => e.target.style.color = DIM}>
            LinkedIn ↗
          </a>
        </div>
      </div>
      <div style={{ marginTop: 100, paddingTop: 28, borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 2, color: DIM }}>
        <span>© 2025 Akinlolu Elijah</span>
        <span>Product Designer · Lagos, Nigeria</span>
      </div>
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
    setLoaded(true)
    setTimeout(() => setReady(true), 100)
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
    <div style={{ background: BG, minHeight: "100vh", cursor: "none", color: TEXT, position: "relative" }}>
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
        @keyframes heroReelFade { from { opacity: 0; } to { opacity: 1; } }
        .hero-reel-float {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          height: 100%;
          width: min(44vw, 520px);
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
        .project-card-thumb {
          position: relative;
          width: 100%;
          height: 160px;
          overflow: hidden;
          opacity: 0.82;
          filter: saturate(0.92);
        }
        .project-card-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .project-card-thumb::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 0%, ${BG}aa 100%);
        }
        .showreel-track-wrap {
          overflow: hidden; border-top: 1px solid ${BORDER}; border-bottom: 1px solid ${BORDER};
        }
        .showreel-track {
          display: flex; width: max-content;
          animation: showreelScroll 48s linear infinite;
        }
        .showreel-track:hover { animation-play-state: paused; }
        .showreel-item {
          position: relative; width: clamp(280px, 28vw, 420px); aspect-ratio: 16/10;
          flex-shrink: 0; border-right: 1px solid ${BORDER}; overflow: hidden;
        }
        .showreel-item-label {
          position: absolute; bottom: 0; left: 0; right: 0; padding: 16px 20px;
          font-family: var(--font-body); font-size: 11px; font-weight: 500; letter-spacing: 1.5px;
          color: ${TEXT}; text-transform: uppercase;
          background: linear-gradient(transparent, rgba(7,7,12,0.92));
        }
        .project-card-media {
          position: absolute; inset: 0; z-index: 0;
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
          row-gap: 8px;
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
            min-height: 220px;
          }
          .project-card {
            min-height: 260px;
          }
        }
      `}</style>

      {!loaded && <Loader onDone={done} />}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav scrollY={scrollY} />
        <Hero ready={ready} />
        <Showreel />
        <Work />
        <Contact />
      </div>
    </div>
  )
}
