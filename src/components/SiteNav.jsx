import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import SoundButton from "./SoundButton.jsx"
import SiteLogo from "./SiteLogo.jsx"

const TEXT = "#e0dbd2"
const DIM = "#a39e98"
const GOLD = "#c9aa7c"
const BORDER = "rgba(255,255,255,0.07)"

const NAV_LINKS = [
  { id: "work", label: "Work", scrollOnHome: true },
  { id: "about", label: "About", href: "/about" },
  { id: "exploration", label: "Explore", href: "/exploration" },
  { id: "contact", label: "Contact", scrollOnHome: true },
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
          padding-left: clamp(20px, 2.5vw, 36px);
          padding-right: clamp(20px, 2.5vw, 36px);
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
          gap: 32px;
          align-items: center;
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
          gap: 8px;
          overflow-y: auto;
        }
        .site-nav__drawer.open {
          display: flex;
        }
        .site-nav__drawer a,
        .site-nav__drawer button {
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
        }
        @media (min-width: 769px) {
          .site-nav {
            padding-top: 20px;
            padding-bottom: 20px;
            padding-left: var(--page-gutter, 56px);
            padding-right: var(--page-gutter, 56px);
          }
          .site-nav__desktop {
            gap: 40px;
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
          {NAV_LINKS.map(({ id, label, href, scrollOnHome }) =>
            scrollOnHome ? (
              <button key={id} type="button" className="site-nav__link" onClick={() => goSection(id)} style={{ ...linkStyle, cursor: "inherit" }}>
                {label}
              </button>
            ) : (
              <Link key={id} to={href} className="site-nav__link" style={linkStyle}>{label}</Link>
            )
          )}
          <Link to="/games" className="site-nav__link site-nav__link--gold" style={linkStyle}>Game ✦</Link>
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
        {NAV_LINKS.map(({ id, label, href, scrollOnHome }) =>
          scrollOnHome ? (
            <button key={id} type="button" onClick={() => goSection(id)}>{label}</button>
          ) : (
            <Link key={id} to={href} onClick={close}>{label}</Link>
          )
        )}
        <Link to="/games" onClick={close}>Game ✦</Link>
      </div>
    </>
  )
}
