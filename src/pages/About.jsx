import { Link } from "react-router-dom"
import SoundButton from "../components/SoundButton.jsx"
import { RESUME_URL } from "../data/projectMeta.js"

const IMPACT_STATS = [
  { value: "€40M+", label: "Impact delivered" },
  { value: "10+", label: "Products shipped" },
  { value: "6+", label: "Years of craft" },
  { value: "3", label: "Enterprise clients" },
]

const BG = "#07070c"
const TEXT = "#e0dbd2"
const DIM = "#a39e98"
const GOLD = "#c9aa7c"
const BORDER = "rgba(255,255,255,0.07)"

const EXPERIENCE = [
  { role: "Senior Product Designer", company: "Toke", period: "Sep 2024 — Present", place: "United Kingdom" },
  { role: "Product Designer", company: "Boglex Software", period: "Aug 2023 — Present", place: "Romania" },
  { role: "CEO & Co-Founder", company: "QueuePay Africa", period: "Aug 2024 — Present", place: "Nigeria" },
  { role: "Senior Product Designer", company: "The Autism Helper", period: "Sep 2024 — Feb 2025", place: "United States" },
  { role: "Senior Product Designer", company: "StrengthMaker", period: "Nov 2023 — Jun 2024", place: "Germany" },
  { role: "Product Designer", company: "SwipeAbove", period: "Sep 2023 — Feb 2024", place: "United Kingdom" },
  { role: "Senior Product Designer", company: "Expaat", period: "Apr 2022 — Aug 2023", place: "Nigeria" },
]

const RESUME_HIGHLIGHTS = [
  {
    title: "Product Design & AI",
    items: ["Design systems · Regulatory UX · AI-native workflows", "Figma · Prototyping · Claude MCP integrations"],
  },
  {
    title: "Domains",
    items: ["FinTech · HealthTech · EdTech · SaaS · Enterprise", "Compliance · Payments · Clinical training · Marketplaces"],
  },
  {
    title: "Impact",
    items: ["€40M+ regulatory exposure avoided", "10+ products shipped · 6+ years of craft", "3 enterprise clients simultaneously"],
  },
]

export default function About() {
  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT }}>
      <style>{`
        .about-grid { display: grid; grid-template-columns: 1fr 320px; gap: 80px; }
        @media (max-width: 900px) { .about-grid { grid-template-columns: 1fr; gap: 48px; } }
      `}</style>

      <nav style={{ padding: "24px 56px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${BORDER}` }}>
        <Link to="/" style={{ fontFamily: "var(--font-heading)", fontSize: 22, color: TEXT, letterSpacing: 3, fontWeight: 300, textDecoration: "none" }}>AE</Link>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <Link to="/" style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 3, color: DIM, textDecoration: "none", textTransform: "uppercase" }}>Work</Link>
          <Link to="/exploration" style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 3, color: DIM, textDecoration: "none", textTransform: "uppercase" }}>Explore</Link>
          <Link to="/games" style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 3, color: DIM, textDecoration: "none", textTransform: "uppercase" }}>Game</Link>
          <SoundButton />
        </div>
      </nav>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 56px 120px" }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 5, color: DIM, marginBottom: 24, textTransform: "uppercase" }}>About</div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(42px,6vw,72px)", fontWeight: 500, lineHeight: 1.05, margin: "0 0 48px" }}>
          Akinlolu Elijah
        </h1>

        <div className="about-grid">
          <div>
            <section style={{ marginBottom: 64 }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 4, color: GOLD, marginBottom: 20, textTransform: "uppercase" }}>Origin</div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(20px,2.4vw,28px)", fontWeight: 400, lineHeight: 1.65, margin: "0 0 20px" }}>
                Product designer from Lagos, Nigeria — designing products people understand and businesses can grow with.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 18, fontWeight: 400, color: DIM, lineHeight: 1.9, margin: 0 }}>
                Nigeria gave me resourcefulness. Experience across the UK, US, and Europe gave me rigour and access. I work where user needs, business goals, and regulatory reality collide — currently as Senior Product Designer at Toke, building e-commerce and retail experiences alongside AI-powered design infrastructure for enterprise clients.
              </p>
            </section>

            <section style={{ marginBottom: 64 }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 4, color: GOLD, marginBottom: 28, textTransform: "uppercase" }}>Experience</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {EXPERIENCE.map((job, i) => (
                  <div key={i} style={{ padding: "24px 0", borderTop: i === 0 ? `1px solid ${BORDER}` : "none", borderBottom: `1px solid ${BORDER}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 8 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 22, color: TEXT }}>{job.role}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 2, color: DIM }}>{job.period}</div>
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 2, color: GOLD }}>{job.company} · {job.place}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 4, color: GOLD, marginBottom: 20, textTransform: "uppercase" }}>Get in touch</div>
              <a href="mailto:akinloluelijah822@gmail.com" style={{ fontFamily: "var(--font-body)", fontSize: 28, color: TEXT, textDecoration: "none", borderBottom: `1px solid ${BORDER}`, paddingBottom: 6 }}>akinloluelijah822@gmail.com</a>
              <div style={{ marginTop: 24, display: "flex", gap: 28 }}>
                <a href="https://www.linkedin.com/in/akinlolu-elijah/" target="_blank" rel="noopener" style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 3, color: DIM, textDecoration: "none", textTransform: "uppercase" }}>LinkedIn ↗</a>
              </div>
            </section>
          </div>

          <aside>
            <div style={{ position: "sticky", top: 40 }}>
              <div style={{ padding: "32px 28px", border: `1px solid ${BORDER}`, background: "rgba(255,255,255,0.02)", marginBottom: 24 }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 4, color: GOLD, marginBottom: 20, textTransform: "uppercase" }}>Resume</div>
                {RESUME_HIGHLIGHTS.map(block => (
                  <div key={block.title} style={{ marginBottom: 24 }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 18, color: TEXT, marginBottom: 10 }}>{block.title}</div>
                    {block.items.map(item => (
                      <div key={item} style={{ fontFamily: "var(--font-body)", fontSize: 14, color: DIM, lineHeight: 1.8 }}>{item}</div>
                    ))}
                  </div>
                ))}
                <a href={RESUME_URL} download style={{ display: "inline-block", marginTop: 8, fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 3, color: GOLD, textDecoration: "none", textTransform: "uppercase", borderBottom: `1px solid ${GOLD}55`, paddingBottom: 4 }}>
                  Download full resume ↗
                </a>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {IMPACT_STATS.map(({ value, label }) => (
                  <div key={label}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 36, fontWeight: 300, color: GOLD, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 8, letterSpacing: 2, color: DIM, marginTop: 6, textTransform: "uppercase" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
