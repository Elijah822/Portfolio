import { useState } from "react"
import { Link } from "react-router-dom"
import ScrollReveal from "./ScrollReveal.jsx"
import { SERVICES } from "../data/services.js"
import "./HomeSections.css"

const BORDER = "rgba(255,255,255,0.07)"

export default function ServicesSection() {
  const [active, setActive] = useState(SERVICES[0].id)
  const current = SERVICES.find(s => s.id === active) ?? SERVICES[0]

  return (
    <section id="services" className="home-section page-pad-x" style={{ paddingTop: 120, paddingBottom: 80, borderTop: `1px solid ${BORDER}` }}>
      <ScrollReveal variant="fade-up">
        <div className="home-section__eyebrow">[ Services ]</div>
        <h2 className="home-section__title">How I can <em>help</em></h2>
        <p className="home-section__lead">
          Fullstack product design for teams that need one senior person who can think, design, and ship — not an agency handoff chain.
        </p>
      </ScrollReveal>

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
          <div className="services-panel__head">
            <span className="services-panel__num">{current.num}</span>
            <h3 className="services-panel__title">{current.title}</h3>
          </div>
          <p className="services-panel__desc">{current.desc}</p>
          <ul className="services-panel__list">
            {current.includes.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link to="/contact" className="services-panel__cta" data-h>
            Discuss this →
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
