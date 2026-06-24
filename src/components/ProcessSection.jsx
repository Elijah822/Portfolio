import ScrollReveal from "./ScrollReveal.jsx"
import { CONTACT, openCalendly } from "../data/contact.js"
import { PROCESS_STEPS } from "../data/process.js"
import "./HomeSections.css"

const BORDER = "rgba(255,255,255,0.07)"

export default function ProcessSection() {
  return (
    <section id="process" className="home-section page-pad-x" style={{ paddingTop: 120, paddingBottom: 80, borderTop: `1px solid ${BORDER}` }}>
      <ScrollReveal variant="fade-up">
        <div className="home-section__eyebrow">[ Process ]</div>
        <h2 className="home-section__title">From first call to <em>launch</em></h2>
        <p className="home-section__lead">
          A clear five-step process — no surprises, no scope creep, no disappearing after handoff.
        </p>
      </ScrollReveal>

      <div className="process-grid-wrap">
        <div className="process-grid" aria-label="Process steps">
          {PROCESS_STEPS.map((step, i) => (
            <ScrollReveal key={step.num} variant="fade-up" delay={i * 160} duration={720} className="process-step">
              <div className="process-step__num">{step.num}</div>
              <h3 className="process-step__title">{step.title}</h3>
              <p className="process-step__desc">{step.desc}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <ScrollReveal variant="fade-up" delay={PROCESS_STEPS.length * 160 + 80} className="process-cta">
        <p>Ready to start? Book a free discovery call.</p>
        <a href={CONTACT.calendly} target="_blank" rel="noopener noreferrer" className="process-cta__btn" data-h onClick={openCalendly}>
          Book a call →
        </a>
      </ScrollReveal>
    </section>
  )
}
