import SiteNav from "../components/SiteNav.jsx"
import ScrollReveal from "../components/ScrollReveal.jsx"
import { EXPLORATIONS } from "../data/explorations.js"

const BG = "#07070c"
const TEXT = "#e0dbd2"
const DIM = "#a39e98"
const GOLD = "#c9aa7c"
const BORDER = "rgba(255,255,255,0.07)"

const STATUS_CFG = {
  building: { dot: "#fbbf24", color: "#fbbf24", bg: "rgba(251,191,36,0.08)" },
  proven: { dot: "#9b7ce0", color: "#9b7ce0", bg: "rgba(155,124,224,0.10)" },
}

function StatusBadge({ status, label }) {
  const c = STATUS_CFG[status] || STATUS_CFG.building
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 2,
      color: c.color, background: c.bg,
      padding: "4px 10px", border: `1px solid ${c.color}22`,
      textTransform: "uppercase",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
      {label}
    </span>
  )
}

export default function Exploration() {
  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT }}>
      <style>{`
        .explore-card { transition: border-color 0.25s ease, transform 0.25s ease; }
        @media (hover: hover) and (pointer: fine) {
          .explore-card:hover { transform: translateY(-2px); }
        }
        @media (max-width: 900px) { .explore-metrics { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 768px) {
          .explore-main { padding-top: 80px !important; padding-bottom: 80px !important; }
          .explore-card { padding: 28px 16px !important; }
        }
      `}</style>

      <SiteNav sticky />

      <main className="explore-main page-main page-shell" style={{ paddingTop: 100, paddingBottom: 120 }}>
        <ScrollReveal variant="fade-up">
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 5, color: DIM, marginBottom: 24, textTransform: "uppercase" }}>Exploration</div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontVariationSettings: '"wght" 300', fontSize: "clamp(42px,6vw,72px)", fontWeight: 300, lineHeight: 1.05, margin: "0 0 20px" }}>
            Ideas I'm building<br /><em style={{ color: GOLD }}>and proving.</em>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 18, fontWeight: 400, color: DIM, lineHeight: 1.8, maxWidth: 620, margin: "0 0 72px" }}>
            Personal products, design foresight, and experiments at the edge of AI, where riding the wave means shipping faster and thinking deeper.
          </p>
        </ScrollReveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 1, background: BORDER, border: `1px solid ${BORDER}` }}>
          {EXPLORATIONS.map((item, idx) => (
            <ScrollReveal key={item.id} as="article" variant="scale-up" delay={idx * 100} className="explore-card" style={{ background: BG, padding: "48px 40px", borderLeft: `3px solid ${item.accent}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 4, color: item.accent, textTransform: "uppercase" }}>
                  {String(idx + 1).padStart(2, "0")} · {item.tag}
                </div>
                <StatusBadge status={item.status} label={item.statusLabel} />
              </div>

              <h2 style={{ fontFamily: "var(--font-heading)", fontVariationSettings: '"wght" 400', fontSize: "clamp(28px,4vw,44px)", fontWeight: 400, color: TEXT, margin: "0 0 12px", lineHeight: 1.15 }}>
                {item.title}
              </h2>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 2, color: DIM, marginBottom: 24, textTransform: "uppercase" }}>{item.year}</div>

              <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(16px,1.8vw,20px)", fontWeight: 400, color: TEXT, lineHeight: 1.7, margin: "0 0 16px", maxWidth: 720 }}>
                {item.desc}
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 400, color: DIM, lineHeight: 1.85, margin: "0 0 32px", maxWidth: 720 }}>
                {item.about}
              </p>

              <div className="explore-metrics" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: BORDER, border: `1px solid ${BORDER}`, marginBottom: 32 }}>
                {item.highlights.map((h, hi) => (
                  <ScrollReveal key={h.label} variant="fade-up" delay={hi * 70} style={{ background: BG, padding: "20px 24px" }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 24, fontWeight: 300, color: item.accent, lineHeight: 1 }}>{h.value}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: 2, color: DIM, marginTop: 6, textTransform: "uppercase" }}>{h.label}</div>
                  </ScrollReveal>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
                {item.streams.map((s, si) => (
                  <ScrollReveal key={s.title} variant="slide-left" delay={si * 80} style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 3, color: GOLD, marginBottom: 10, textTransform: "uppercase" }}>{s.title}</div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 400, color: DIM, lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </main>
    </div>
  )
}
