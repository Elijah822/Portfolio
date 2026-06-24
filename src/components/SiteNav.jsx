import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import SoundButton from "./SoundButton.jsx"
import SiteLogo from "./SiteLogo.jsx"
import WorkDropdown from "./WorkDropdown.jsx"
import { CONTACT, openCalendly } from "../data/contact.js"
import { FEATURED_WORK } from "../data/featuredWork.js"
import { saveHomeScroll } from "../lib/scrollRestore.js"
import "./WorkDropdown.css"

const TEXT = "#e0dbd2"
const DIM = "#a39e98"
const GOLD = "#c9aa7c"
const BORDER = "rgba(255,255,255,0.07)"

const PAGE_LINKS = [
  { label: "About", href: "/about" },
  { label: "Explore", href: "/exploration" },
]

const MOBILE_SCROLL_LINKS = [
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "faq", label: "FAQ" },
]

const linkStyle = {
  fontFamily: "var(--font-body)",
  fontSize: 12,
  letterSpacing: 3,
  color: DIM,
  textDecoration: "none",
  textTransform: "uppercase",
  background: "none",
  border: "none",
  padding: 0,
}

export default function SiteNav({ scrollY = 0, home = false, sticky = false }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [workOpen, setWorkOpen] = useState(false)
  const max = Math.max(
    1,
    (typeof document !== "undefined" ? document.documentElement.scrollHeight : 1) -
      (typeof window !== "undefined" ? window.innerHeight : 1)
  )
  const pct = home ? Math.min((scrollY / max) * 100, 100) : 0
  const scrolled = home ? scrollY > 60 : true

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = e => { if (e.key === "Escape") setOpen(false) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  useEffect(() => {
    if (!open) setWorkOpen(false)
  }, [open])

  const close = () => setOpen(false)

  const goSection = id => {
    close()
    if (home) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    } else {
      navigate(`/#${id}`)
    }
  }

  const navBg = sticky || scrolled ? "rgba(7,7,12,0.94)" : "transparent"

  return (
    <>
      <style>{`
        .site-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding-top: 16px;
          padding-bottom: 16px;
          padding-left: var(--page-gutter);
          padding-right: var(--page-gutter);
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.3s, border-color 0.3s;
        }
        .site-nav__logo {
          margin: 0;
          padding: 0;
        }
        .site-nav--sticky {
          position: sticky;
        }
        .site-nav__desktop {
          display: flex;
          gap: 28px;
          align-items: center;
          flex-shrink: 0;
        }
        .site-nav__cta {
          font-family: var(--font-body);
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #07070c;
          background: ${GOLD};
          text-decoration: none;
          padding: 10px 18px;
          border-radius: 999px;
          white-space: nowrap;
        }
        .site-nav__mobile-tools {
          display: none;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .site-nav__burger {
          display: none;
          width: 44px;
          height: 44px;
          border: 1px solid ${BORDER};
          background: rgba(7,7,12,0.6);
          color: ${TEXT};
          border-radius: 8px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 0;
          flex-shrink: 0;
        }
        .site-nav__burger span {
          display: block;
          width: 18px;
          height: 1.5px;
          background: ${TEXT};
          transition: transform 0.25s ease, opacity 0.25s ease;
        }
        .site-nav__burger[aria-expanded="true"] span:nth-child(1) {
          transform: translateY(6.5px) rotate(45deg);
        }
        .site-nav__burger[aria-expanded="true"] span:nth-child(2) {
          opacity: 0;
        }
        .site-nav__burger[aria-expanded="true"] span:nth-child(3) {
          transform: translateY(-6.5px) rotate(-45deg);
        }
        .site-nav__drawer {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 99;
          background: rgba(7,7,12,0.97);
          backdrop-filter: blur(20px);
          padding: 88px var(--page-gutter) 32px;
          flex-direction: column;
          gap: 0;
          overflow-y: auto;
        }
        .site-nav__drawer.open {
          display: flex;
        }
        .site-nav__drawer > a,
        .site-nav__drawer > button {
          font-family: var(--font-body);
          font-size: 22px;
          font-weight: 400;
          letter-spacing: 2px;
          color: ${TEXT};
          text-decoration: none;
          text-transform: uppercase;
          text-align: left;
          background: none;
          border: none;
          padding: 16px 0;
          border-bottom: 1px solid ${BORDER};
          width: 100%;
          cursor: inherit;
        }
        .site-nav__drawer-group {
          border-bottom: 1px solid ${BORDER};
        }
        .site-nav__drawer-work-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          width: 100%;
          font-family: var(--font-body);
          font-size: 22px;
          font-weight: 400;
          letter-spacing: 2px;
          color: ${TEXT};
          text-transform: uppercase;
          text-align: left;
          background: none;
          border: none;
          padding: 16px 0;
          cursor: inherit;
        }
        .site-nav__drawer-work-trigger.is-open {
          color: ${GOLD};
        }
        .site-nav__drawer-chevron {
          font-size: 20px;
          font-weight: 300;
          color: ${DIM};
          line-height: 1;
          flex-shrink: 0;
        }
        .site-nav__drawer-work-trigger.is-open .site-nav__drawer-chevron {
          color: ${GOLD};
        }
        .site-nav__drawer-work-panel {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 0 0 14px;
        }
        .site-nav__drawer-work-item {
          display: grid;
          grid-template-columns: 28px minmax(0, 1fr);
          gap: 12px;
          align-items: start;
          padding: 14px 14px;
          border-radius: 10px;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .site-nav__drawer-work-num {
          font-family: var(--font-body);
          font-size: 11px;
          letter-spacing: 0.06em;
          color: rgba(163, 158, 152, 0.75);
          padding-top: 3px;
          font-variant-numeric: tabular-nums;
        }
        .site-nav__drawer-work-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }
        .site-nav__drawer-work-title {
          font-family: var(--font-heading);
          font-size: 17px;
          font-weight: 400;
          color: ${TEXT};
          line-height: 1.3;
          text-transform: none;
          letter-spacing: 0.01em;
        }
        .site-nav__drawer-work-meta {
          font-family: var(--font-body);
          font-size: 11px;
          line-height: 1.45;
          color: ${DIM};
          text-transform: none;
          letter-spacing: 0.02em;
          white-space: normal;
        }
        .site-nav__drawer-work-all {
          margin-top: 4px;
          padding: 10px 0 2px;
          font-family: var(--font-body);
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${GOLD};
          background: none;
          border: none;
          text-align: left;
          cursor: inherit;
        }
        .site-nav__drawer-cta {
          margin-top: 24px;
          display: block;
          font-size: 14px !important;
          letter-spacing: 3px !important;
          color: #07070c !important;
          background: ${GOLD};
          padding: 16px 24px !important;
          border-radius: 999px;
          border: none !important;
          text-align: center;
          width: 100% !important;
        }
        .site-nav__drawer-scroll {
          font-size: 18px !important;
          letter-spacing: 2px !important;
          color: ${DIM} !important;
        }
        @media (min-width: 769px) {
          .site-nav {
            padding-top: 20px;
            padding-bottom: 20px;
          }
          .site-nav__desktop {
            gap: 32px;
          }
        }
        @media (max-width: 768px) {
          .site-nav__desktop {
            display: none;
          }
          .site-nav__mobile-tools {
            display: flex;
          }
          .site-nav__burger {
            display: flex;
          }
        }
        @media (hover: hover) and (pointer: fine) {
          .site-nav__link:hover { color: ${TEXT} !important; }
          .site-nav__link--gold:hover { color: ${GOLD} !important; }
          .site-nav__cta:hover { background: ${TEXT}; }
          .site-nav__drawer-work-item:hover {
            background: rgba(255, 255, 255, 0.04);
            border-color: rgba(255, 255, 255, 0.1);
          }
          .site-nav__drawer-work-all:hover { color: ${TEXT}; }
        }
      `}</style>

      <nav
        className={`site-nav${sticky ? " site-nav--sticky" : ""}`}
        style={{
          background: navBg,
          backdropFilter: sticky || scrolled ? "blur(20px)" : "none",
          borderBottom: `1px solid ${sticky || scrolled ? BORDER : "transparent"}`,
        }}
      >
        <Link to="/" onClick={close} className="site-nav__logo" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
          <SiteLogo size={30} />
        </Link>

        <div className="site-nav__desktop">
          <WorkDropdown home={home} onNavigate={close} />
          {PAGE_LINKS.map(({ label, href }) => (
            <Link key={href} to={href} className="site-nav__link" style={linkStyle}>{label}</Link>
          ))}
          <Link to="/contact" className="site-nav__link" style={linkStyle}>Contact</Link>
          <Link to="/games" className="site-nav__link site-nav__link--gold" style={linkStyle}>Game ✦</Link>
          <a href={CONTACT.calendly} target="_blank" rel="noopener noreferrer" className="site-nav__cta" data-h onClick={openCalendly}>Book a call</a>
          <SoundButton />
        </div>

        <div className="site-nav__mobile-tools">
          <SoundButton compact />
          <button
            type="button"
            className="site-nav__burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {home && (
          <div style={{ position: "absolute", bottom: 0, left: 0, height: 1, background: GOLD, width: `${pct}%`, transition: "width 0.1s linear" }} />
        )}
      </nav>

      <div className={`site-nav__drawer${open ? " open" : ""}`} aria-hidden={!open}>
        <div className="site-nav__drawer-group">
          <button
            type="button"
            className={`site-nav__drawer-work-trigger${workOpen ? " is-open" : ""}`}
            aria-expanded={workOpen}
            onClick={() => setWorkOpen(v => !v)}
          >
            <span>Work</span>
            <span className="site-nav__drawer-chevron" aria-hidden>{workOpen ? "−" : "+"}</span>
          </button>
          {workOpen && (
            <div className="site-nav__drawer-work-panel">
              {FEATURED_WORK.map(p => (
                <Link
                  key={p.id}
                  to={`/work/${p.id}`}
                  className="site-nav__drawer-work-item"
                  onClick={() => { close(); saveHomeScroll() }}
                >
                  <span className="site-nav__drawer-work-num">{p.id}</span>
                  <span className="site-nav__drawer-work-body">
                    <span className="site-nav__drawer-work-title">{p.title}</span>
                    <span className="site-nav__drawer-work-meta">{p.cat} · {p.year}</span>
                  </span>
                </Link>
              ))}
              <button type="button" className="site-nav__drawer-work-all" onClick={() => goSection("work")}>
                View all work →
              </button>
            </div>
          )}
        </div>
        {MOBILE_SCROLL_LINKS.map(({ id, label }) => (
          <button key={id} type="button" className="site-nav__drawer-scroll" onClick={() => goSection(id)}>{label}</button>
        ))}
        {PAGE_LINKS.map(({ label, href }) => (
          <Link key={href} to={href} onClick={close}>{label}</Link>
        ))}
        <Link to="/contact" onClick={close}>Contact</Link>
        <Link to="/games" onClick={close}>Game ✦</Link>
        <a href={CONTACT.calendly} target="_blank" rel="noopener noreferrer" onClick={e => { close(); openCalendly(e) }} className="site-nav__drawer-cta">Book a call</a>
      </div>
    </>
  )
}
