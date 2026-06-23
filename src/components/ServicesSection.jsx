import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import ScrollReveal from "./ScrollReveal.jsx"
import { SERVICES, toolIconUrl } from "../data/services.js"
import { useCoarsePointer, useIsMobile } from "../hooks/useMediaQuery.js"
import { usePlayWhenVisible } from "../hooks/usePlayWhenVisible.js"
import "./HomeSections.css"

const BORDER = "rgba(255,255,255,0.07)"

function ServiceMedia({ service, className = "", isActive = true }) {
  const videoRef = useRef(null)
  const coarsePointer = useCoarsePointer()
  usePlayWhenVisible(videoRef, isActive && Boolean(service.media?.url))

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

function ServiceTools({ tools }) {
  if (!tools?.length) return null

  return (
    <div className="services-panel__tools">
      <span className="services-panel__tools-label">Tools</span>
      <ul className="services-panel__tools-list" aria-label="Tools used">
        {tools.map(t => (
          <li key={t.name}>
            <img
              src={toolIconUrl(t)}
              alt=""
              width={22}
              height={22}
              loading="lazy"
              decoding="async"
              title={t.name}
            />
            <span className="visually-hidden">{t.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ServiceCopy({ service, showTitle = true }) {
  return (
    <>
      {showTitle && (
        <div className="services-panel__head">
          <h3 className="services-panel__title">{service.title}</h3>
        </div>
      )}
      <p className="services-panel__desc">{service.desc}</p>
      <ul className="services-panel__list">
        {service.includes.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <ServiceTools tools={service.tools} />
      <Link to="/contact" className="services-panel__cta" data-h>
        Discuss this
      </Link>
    </>
  )
}

export default function ServicesSection() {
  const isMobile = useIsMobile()
  const [active, setActive] = useState(SERVICES[0].id)
  const [openAccordion, setOpenAccordion] = useState(SERVICES[0].id)

  const toggleAccordion = id => {
    setOpenAccordion(open => (open === id ? null : id))
  }

  return (
    <section id="services" className="home-section services-section page-pad-x" style={{ paddingTop: 120, paddingBottom: 80, borderTop: `1px solid ${BORDER}` }}>
      <ScrollReveal variant="fade-up" className="services-section__header">
        <p className="services-section__eyebrow">Services</p>
        <h2 className="services-section__title">Design and build, end to end</h2>
        <p className="services-section__lead">
          One senior partner for product design and front-end — grounded in what your stack can actually ship.
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
        <ScrollReveal variant="fade-up" delay={60} className="services-layout">
          <div className="services-tabs">
            {SERVICES.map(s => (
              <button
                key={s.id}
                type="button"
                className={`services-tab${s.id === active ? " is-active" : ""}`}
                onClick={() => setActive(s.id)}
              >
                <span className="services-tab__num">{s.num}</span>
                <span className="services-tab__label">{s.title}</span>
              </button>
            ))}
          </div>

          <div className="services-panel">
            <div className="services-panel__content">
              {SERVICES.map(s => (
                <div
                  key={s.id}
                  className={`services-panel__pane${s.id === active ? " is-active" : ""}`}
                  aria-hidden={s.id !== active}
                >
                  <ServiceCopy service={s} showTitle={false} />
                </div>
              ))}
            </div>
            <div className="services-panel__media-stack">
              {SERVICES.map(s => (
                <div
                  key={s.id}
                  className={`services-panel__media-pane${s.id === active ? " is-active" : ""}`}
                  aria-hidden={s.id !== active}
                >
                  <ServiceMedia service={s} isActive={s.id === active} />
                  <div className="services-panel__media-scrim" aria-hidden />
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}
    </section>
  )
}
