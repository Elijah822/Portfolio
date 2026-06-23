import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FEATURED_WORK } from "../data/featuredWork.js"
import { videoPoster } from "../data/projectMedia.js"
import { useCoarsePointer } from "../hooks/useMediaQuery.js"
import { saveHomeScroll } from "../lib/scrollRestore.js"
import "./WorkDropdown.css"

export default function WorkDropdown({ home, onNavigate }) {
  const navigate = useNavigate()
  const coarsePointer = useCoarsePointer()
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState(FEATURED_WORK[0]?.id ?? "01")
  const wrapRef = useRef(null)
  const closeTimer = useRef(null)

  const active = FEATURED_WORK.find(p => p.id === activeId) ?? FEATURED_WORK[0]

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const scheduleClose = () => {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => setOpen(false), 180)
  }

  const openMenu = () => {
    clearCloseTimer()
    setOpen(true)
  }

  useEffect(() => () => clearCloseTimer(), [])

  useEffect(() => {
    if (!open) return
    const onKey = e => { if (e.key === "Escape") setOpen(false) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const goWork = () => {
    setOpen(false)
    onNavigate?.()
    if (home) {
      document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })
    } else {
      navigate("/#work")
    }
  }

  return (
    <div
      ref={wrapRef}
      className={`work-dropdown${open ? " is-open" : ""}`}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className="work-dropdown__trigger site-nav__link"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(v => !v)}
      >
        Work
        <span className="work-dropdown__chevron" aria-hidden>▾</span>
      </button>

      <div className="work-dropdown__panel" hidden={!open}>
        <div className="work-dropdown__inner page-pad-x">
          <div className="work-dropdown__grid">
            <div className="work-dropdown__list">
              <div className="work-dropdown__eyebrow">Selected work</div>
              <ul>
                {FEATURED_WORK.map(p => (
                  <li key={p.id}>
                    <Link
                      to={`/work/${p.id}`}
                      className={`work-dropdown__item${p.id === activeId ? " is-active" : ""}`}
                      onMouseEnter={() => setActiveId(p.id)}
                      onFocus={() => setActiveId(p.id)}
                      onClick={() => {
                        setOpen(false)
                        onNavigate?.()
                        saveHomeScroll()
                      }}
                    >
                      <span className="work-dropdown__item-num">{p.id}</span>
                      <span className="work-dropdown__item-body">
                        <span className="work-dropdown__item-title">{p.title}</span>
                        <span className="work-dropdown__item-meta">{p.cat} · {p.year}</span>
                      </span>
                      <span className="work-dropdown__item-arrow" aria-hidden>→</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button type="button" className="work-dropdown__all" onClick={goWork}>
                View all work →
              </button>
            </div>

            <div className="work-dropdown__preview" aria-hidden={!active}>
              {active?.videoUrl ? (
                coarsePointer ? (
                  <img src={videoPoster(active.videoUrl)} alt="" className="work-dropdown__preview-media" />
                ) : (
                  <video
                    key={active.videoUrl}
                    className="work-dropdown__preview-media"
                    src={active.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )
              ) : null}
              <div className="work-dropdown__preview-overlay">
                <span className="work-dropdown__preview-label">{active?.videoLabel ?? active?.title}</span>
                <span className="work-dropdown__preview-impact" style={{ color: active?.accent }}>{active?.impact}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
