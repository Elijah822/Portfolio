import { useState } from "react"
import { Link } from "react-router-dom"
import SiteNav from "../components/SiteNav.jsx"
import ScrollReveal from "../components/ScrollReveal.jsx"
import SocialLinks from "../components/SocialLinks.jsx"
import { CONTACT, openCalendly } from "../data/contact.js"
import "./ContactPage.css"

const BG = "#07070c"
const TEXT = "#e0dbd2"
const DIM = "#a39e98"
const GOLD = "#c9aa7c"
const BORDER = "rgba(255,255,255,0.07)"

const PROJECT_TYPES = [
  "Product & UX Design",
  "Front-End Development",
  "Design System",
  "0→1 MVP",
  "Motion & Prototyping",
  "Consulting / Audit",
  "Other",
]

const BUDGET_RANGES = [
  "Under $5k",
  "$5k – $15k",
  "$15k – $30k",
  "$30k+",
  "Not sure yet",
]

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT

export default function Contact() {
  const [status, setStatus] = useState("idle")
  const [error, setError] = useState("")

  const handleSubmit = async e => {
    e.preventDefault()
    setError("")

    const form = e.currentTarget
    const data = new FormData(form)

    if (!FORMSPREE_ENDPOINT) {
      const name = data.get("name")
      const email = data.get("email")
      const company = data.get("company")
      const projectType = data.get("projectType")
      const budget = data.get("budget")
      const message = data.get("message")
      const subject = encodeURIComponent(`Project inquiry from ${name}`)
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nCompany: ${company || "—"}\nProject type: ${projectType}\nBudget: ${budget}\n\n${message}`
      )
      window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`
      return
    }

    setStatus("sending")
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
      if (!res.ok) throw new Error("Send failed")
      setStatus("success")
      form.reset()
    } catch {
      setStatus("idle")
      setError("Something went wrong. Try email or WhatsApp below.")
    }
  }

  return (
    <div className="contact-page" style={{ background: BG, minHeight: "100vh", color: TEXT }}>
      <SiteNav sticky />

      <main className="contact-page__main page-main page-shell page-pad-x">
        <ScrollReveal variant="fade-up">
          <div className="contact-page__eyebrow">Contact</div>
          <h1 className="contact-page__title">Let's build something <em>that matters</em></h1>
          <p className="contact-page__lead">
            Tell me about your product, timeline, and team. I'll reply within 48 hours with next steps.
          </p>
        </ScrollReveal>

        <div className="contact-page__grid">
          <ScrollReveal variant="fade-up" delay={60} className="contact-page__form-wrap">
            {status === "success" ? (
              <div className="contact-page__success">
                <h2>Message sent</h2>
                <p>Thanks — I'll get back to you within 48 hours.</p>
                <Link to="/" className="contact-page__back">← Back to home</Link>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form__row">
                  <label className="contact-form__field">
                    <span>Name *</span>
                    <input type="text" name="name" required autoComplete="name" placeholder="Your name" />
                  </label>
                  <label className="contact-form__field">
                    <span>Email *</span>
                    <input type="email" name="email" required autoComplete="email" placeholder="you@company.com" />
                  </label>
                </div>

                <label className="contact-form__field">
                  <span>Company</span>
                  <input type="text" name="company" autoComplete="organization" placeholder="Company or startup name" />
                </label>

                <div className="contact-form__row">
                  <label className="contact-form__field">
                    <span>Project type *</span>
                    <select name="projectType" required defaultValue="">
                      <option value="" disabled>Select one</option>
                      {PROJECT_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                  <label className="contact-form__field">
                    <span>Budget range</span>
                    <select name="budget" defaultValue="">
                      <option value="" disabled>Select range</option>
                      {BUDGET_RANGES.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="contact-form__field">
                  <span>Message *</span>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    placeholder="What are you building? What's the timeline? What does success look like?"
                  />
                </label>

                {error && <p className="contact-form__error" role="alert">{error}</p>}

                <button type="submit" className="contact-form__submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send message →"}
                </button>

                {!FORMSPREE_ENDPOINT && (
                  <p className="contact-form__note">
                    Form opens your email client. For direct delivery, add <code>VITE_FORMSPREE_ENDPOINT</code> in Vercel env vars.
                  </p>
                )}
              </form>
            )}
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={100} className="contact-page__aside">
            <div className="contact-aside__block">
              <div className="contact-aside__label">Email</div>
              <a href={`mailto:${CONTACT.email}`} className="contact-aside__value" data-h>{CONTACT.email}</a>
            </div>

            <div className="contact-aside__block">
              <div className="contact-aside__label">WhatsApp</div>
              <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="contact-aside__value" data-h>
                Message on WhatsApp →
              </a>
            </div>

            <div className="contact-aside__block">
              <div className="contact-aside__label">Based in</div>
              <p className="contact-aside__text">Nigeria · Working globally (UK, US, EU, Sweden)</p>
            </div>

            <div className="contact-aside__block">
              <div className="contact-aside__label">Response time</div>
              <p className="contact-aside__text">Within 48 hours on business days</p>
            </div>

            <SocialLinks style={{ marginTop: 8 }} />

            <div className="contact-aside__cta">
              <p>Prefer a call?</p>
              <a
                href={CONTACT.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-aside__cta-btn"
                data-h
                onClick={openCalendly}
              >
                Book a 30-min call →
              </a>
            </div>
          </ScrollReveal>
        </div>
      </main>

      <footer className="contact-page__footer page-pad-x">
        <span>© 2025 {CONTACT.name}</span>
        <Link to="/" style={{ color: DIM, textDecoration: "none", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>
          Home
        </Link>
      </footer>
    </div>
  )
}
