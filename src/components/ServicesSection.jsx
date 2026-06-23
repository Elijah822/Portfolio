import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import ScrollReveal from "./ScrollReveal.jsx"
import { SERVICES } from "../data/services.js"
import { useCoarsePointer, useIsMobile } from "../hooks/useMediaQuery.js"
import { usePlayWhenVisible } from "../hooks/usePlayWhenVisible.js"
import "./HomeSections.css"

const BORDER = "rgba(255,255,255,0.07)"

function ServiceMedia({ service, className = "" }) {
  const videoRef = useRef(null)
  const coarsePointer = useCoarsePointer()
  usePlayWhenVisible(videoRef, Boolean(service.media?.url))

  if (!service.media?.url) {
    return <div className={`services-panel__media-empty${className ? ` ${className}` : ""}`} aria-hidden />
  }

  if (coarsePointer) {
    return (
      <img
        src={service.media.poster}
        alt=""
        className={`services-panel__media-el${className ? ` ${className}` : ""}`}
        loading="lazy"
        decoding="async"
      />
    )
  }

  return (
    <video
      key={service.id}
      ref={videoRef}
      className={`services-panel__media-el${className ? ` ${className}` : ""}`}
      src={service.media.url}
      poster={service.media.poster}
      muted
      loop
      playsInline
    />
  )
}

function ServiceCopy({ service }) {
  return (
    <>
      <div className="services-panel__head">
        <span className="services-panel__num">{service.num}</span>
        <h3 className="services-panel__title">{service.title}</h3>
      </div>
      <p className="services-panel__desc">{service.desc}</p>
      <ul className="services-panel__list">
        {service.includes.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Link to="/contact" className="services-panel__cta" data-h>
        Discuss this →
      </Link>
    </>
  )
}

export default function ServicesSection() {
  const isMobile = useIsMobile()
  const [active, setActive] = useState(SERVICES[0].id)
  const [openAccordion, setOpenAccordion] = useState(SERVICES[0].id)
  const current = SERVICES.find(s => s.id === active) ?? SERVICES[0]

  const toggleAccordion = id => {
    setOpenAccordion(open => (open === id ? null : id))
  }

  return (
    <section id="services" className="home-section page-pad-x" style={{ paddingTop: 120, paddingBottom: 80, borderTop: `1px solid ${BORDER}` }}>
      <ScrollReveal variant="fade-up">
        <div className="home-section__eyebrow">[ Services ]</div>
        <h2 className="home-section__title">How I can <em>help</em></h2>
        <p className="home-section__lead home-section__lead--wide">
          Fullstack product design and front-end development — one senior person who designs within your stack's limits, ships in React, and works alongside backend engineers when needed.
        </p>
      </ScrollReveal>

      {isMobile ? (
        <div className="services-accordion">
          {SERVICES.map((s, i) => {
            const open = openAccordion === s.id
            return (
              <ScrollReveal key={s.id} variant="fade-up" delay={i * 80}>
                <div
                  className={`services-accordion__item${open ? " is-open" : ""}`}
                  style={{ "--panel-accent": s.accent }}
                >
                  <button
                    type="button"
                    className="services-accordion__trigger"
                    aria-expanded={open}
                    onClick={() => toggleAccordion(s.id)}
                  >
                    <span className="services-accordion__num">{s.num}</span>
                    <span className="services-accordion__label">{s.title}</span>
                    <span className="services-accordion__icon" aria-hidden>{open ? "−" : "+"}</span>
                  </button>
                  {open && (
                    <div className="services-accordion__panel">
                      <div className="services-accordion__media">
                        <ServiceMedia service={s} />
                        <div className="services-panel__media-scrim" aria-hidden />
                      </div>
                      <div className="services-accordion__body">
                        <ServiceCopy service={s} />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      ) : (
        <div className="services-layout">
          <ScrollReveal variant="fade-up" delay={60} className="services-tabs">
            {SERVICES.map(s => (
              <button
                key={s.id}
                type="button"
                className={`services-tab${s.id === active ? " is-active" : ""}`}
                onClick={() => setActive(s.id)}
                style={{ "--tab-accent": s.accent }}
              >
                <span className="services-tab__num">{s.num}</span>
                <span className="services-tab__label">{s.title}</span>
              </button>
            ))}
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={100} className="services-panel" style={{ "--panel-accent": current.accent }}>
            <div className="services-panel__body">
              <ServiceCopy service={current} />
            </div>
            <div className="services-panel__media">
              <ServiceMedia service={current} />
              <div className="services-panel__media-scrim" aria-hidden />
            </div>
          </ScrollReveal>
        </div>
      )}
    </section>
  )
}
