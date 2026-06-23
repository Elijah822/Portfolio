import { useState } from "react"
import { Link } from "react-router-dom"
import ScrollReveal from "./ScrollReveal.jsx"
import { FAQ_ITEMS } from "../data/faq.js"
import "./HomeSections.css"

const BORDER = "rgba(255,255,255,0.07)"

export default function FaqSection() {
  const [openId, setOpenId] = useState(FAQ_ITEMS[0]?.id ?? null)

  return (
    <section id="faq" className="home-section page-pad-x" style={{ paddingTop: 120, paddingBottom: 80, borderTop: `1px solid ${BORDER}` }}>
      <ScrollReveal variant="fade-up">
        <div className="home-section__eyebrow">[ FAQ ]</div>
        <h2 className="home-section__title">Still got <em>questions?</em></h2>
        <p className="home-section__lead">
          Common questions from founders and teams before we work together.
        </p>
      </ScrollReveal>

      <div className="faq-list">
        {FAQ_ITEMS.map((item, i) => {
          const open = openId === item.id
          return (
            <ScrollReveal key={item.id} variant="fade-up" delay={i * 40}>
              <div className={`faq-item${open ? " is-open" : ""}`}>
                <button
                  type="button"
                  className="faq-item__trigger"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : item.id)}
                >
                  <span>{item.q}</span>
                  <span className="faq-item__icon" aria-hidden>{open ? "−" : "+"}</span>
                </button>
                <div className="faq-item__panel" hidden={!open}>
                  <p>{item.a}</p>
                </div>
              </div>
            </ScrollReveal>
          )
        })}
      </div>

      <ScrollReveal variant="fade-up" delay={80} className="faq-footer">
        <p>Can't find your answer?</p>
        <Link to="/contact" className="faq-footer__link" data-h>
          Get in touch →
        </Link>
      </ScrollReveal>
    </section>
  )
}
