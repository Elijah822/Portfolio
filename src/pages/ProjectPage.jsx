import { useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ALL_PROJECTS } from "../data/projects.js"
import { getCaseStudy } from "../data/caseStudies.js"
import { getProjectMeta } from "../data/projectMeta.js"
import { getProjectMedia, videoPoster } from "../data/projectMedia.js"

const BG = "#07070c"
const TEXT = "#e0dbd2"
const DIM = "#64605b"
const GOLD = "#c9aa7c"
const BORDER = "rgba(255,255,255,0.07)"

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ fontFamily: '"DM Mono",monospace', fontSize: 9, letterSpacing: 4, color: GOLD, marginBottom: 16, textTransform: "uppercase" }}>{label}</div>
      {children}
    </div>
  )
}

function Prose({ children, italic = false }) {
  return (
    <p style={{ fontFamily: '"Cormorant Garamond",serif', fontStyle: italic ? "italic" : "normal", fontSize: italic ? 17 : 20, fontWeight: italic ? 400 : 300, lineHeight: 1.75, color: italic ? DIM : TEXT, margin: 0 }}>{children}</p>
  )
}

function StatusBadge({ status, label }) {
  const cfg = {
    live: { color: "#4ade80", bg: "rgba(74,222,128,0.08)" },
    partial: { color: "#60a5fa", bg: "rgba(96,165,250,0.08)" },
    testing: { color: "#fbbf24", bg: "rgba(251,191,36,0.08)" },
    acquired: { color: "#c9aa7c", bg: "rgba(201,170,124,0.12)" },
    proven: { color: "#9b7ce0", bg: "rgba(155,124,224,0.10)" },
  }
  const c = cfg[status] || cfg.testing
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: '"DM Mono",monospace', fontSize: 9, letterSpacing: 2, color: c.color, background: c.bg, padding: "4px 10px", border: `1px solid ${c.color}22`, textTransform: "uppercase" }}>
      {label}
    </span>
  )
}

export default function ProjectPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = ALL_PROJECTS.find(p => p.id === id)
  const meta = getProjectMeta(id)
  const media = getProjectMedia(id)
  const study = getCaseStudy(id)

  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:wght@300;400&display=swap"
    document.head.appendChild(link)
    return () => { try { document.head.removeChild(link) } catch (_) {} }
  }, [])

  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") navigate("/#work") }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [navigate])

  if (!project) {
    return (
      <div style={{ background: BG, minHeight: "100vh", color: TEXT, padding: 120, textAlign: "center" }}>
        <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 28 }}>Project not found.</p>
        <Link to="/" style={{ color: GOLD }}>← Back home</Link>
      </div>
    )
  }

  const siteUrl = meta?.siteUrl || project.url
  const overview = study?.overview || project.desc

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, padding: "20px 56px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(7,7,12,0.94)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${BORDER}` }}>
        <Link to="/" style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 22, color: TEXT, letterSpacing: 3, fontWeight: 300, textDecoration: "none" }}>AE</Link>
        <button onClick={() => navigate("/#work")} style={{ fontFamily: '"DM Mono",monospace', fontSize: 10, letterSpacing: 3, color: DIM, background: "none", border: `1px solid ${BORDER}`, padding: "10px 18px", cursor: "pointer", textTransform: "uppercase" }}>
          ← All work
        </button>
      </nav>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "80px 56px 120px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
          <span style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 64, fontWeight: 300, color: project.accent, lineHeight: 1 }}>{project.id}</span>
          <StatusBadge status={project.status} label={project.statusLabel} />
          {meta && (
            <span style={{ fontFamily: '"DM Mono",monospace', fontSize: 10, letterSpacing: 2, color: DIM, display: "flex", alignItems: "center", gap: 8 }}>
              {meta.flags.join(" ")} {meta.region}
            </span>
          )}
        </div>

        <h1 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: "clamp(36px,5vw,64px)", fontWeight: 300, lineHeight: 1.1, margin: "0 0 16px" }}>{project.title}</h1>
        <div style={{ fontFamily: '"DM Mono",monospace', fontSize: 10, letterSpacing: 2, color: DIM, marginBottom: 40 }}>
          {(study?.role || project.role)} · {project.year}
          {study?.productType && ` · ${study.productType}`}
        </div>

        {media?.hero && (
          <div style={{ marginBottom: 56, borderRadius: 2, overflow: "hidden", border: `1px solid ${BORDER}`, aspectRatio: "16/9", background: "#0a0a10" }}>
            <video src={media.hero.url} poster={videoPoster(media.hero.url)} controls playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 24, marginBottom: 56, paddingBottom: 40, borderBottom: `1px solid ${BORDER}` }}>
          {project.metrics.map(({ value, label }) => (
            <div key={label}>
              <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 32, fontWeight: 300, color: project.accent, lineHeight: 1 }}>{value}</div>
              <div style={{ fontFamily: '"DM Mono",monospace', fontSize: 8, letterSpacing: 2, color: DIM, textTransform: "uppercase", marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>

        <Section label="Overview"><Prose>{overview}</Prose></Section>

        {study?.problem && <Section label="The Problem"><Prose>{study.problem}</Prose></Section>}
        {study?.challenge && <Section label="Challenge"><Prose>{study.challenge}</Prose></Section>}
        {study?.goal && <Section label="Goal"><Prose>{study.goal}</Prose></Section>}
        {study?.solution && <Section label="The Solution"><Prose>{study.solution}</Prose></Section>}

        {study?.approach && (
          <Section label="Approach">
            {study.approach.map((item, i) => (
              <p key={i} style={{ fontFamily: '"Cormorant Garamond",serif', fontStyle: "italic", fontSize: 17, color: DIM, lineHeight: 1.8, margin: "0 0 14px", paddingLeft: 16, borderLeft: `2px solid ${project.accent}33` }}>{item}</p>
            ))}
          </Section>
        )}

        {study?.features && (
          <Section label="Core Features">
            {study.features.map((f, i) => (
              <div key={i} style={{ marginBottom: 20, paddingLeft: 20, borderLeft: `2px solid ${project.accent}33` }}>
                <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 20, color: TEXT, marginBottom: 6 }}>{f.title}</div>
                <Prose italic>{f.desc}</Prose>
              </div>
            ))}
          </Section>
        )}

        {study?.highlights && (
          <Section label="Redesign Highlights">
            {study.highlights.map((h, i) => (
              <p key={i} style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 18, color: TEXT, lineHeight: 1.7, margin: "0 0 10px" }}>→ {h}</p>
            ))}
          </Section>
        )}

        {study?.deliverables && (
          <Section label="Deliverables">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {study.deliverables.map(d => (
                <span key={d} style={{ fontFamily: '"DM Mono",monospace', fontSize: 9, letterSpacing: 2, color: DIM, padding: "6px 12px", border: `1px solid ${BORDER}`, textTransform: "uppercase" }}>{d}</span>
              ))}
            </div>
          </Section>
        )}

        {study?.impact && (
          <Section label="Impact & Results">
            {study.impact.map((item, i) => (
              <p key={i} style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 18, color: TEXT, lineHeight: 1.7, margin: "0 0 10px" }}>→ {item}</p>
            ))}
          </Section>
        )}

        {study?.outcomes && (
          <Section label="Outcomes">
            {study.outcomes.map((o, i) => (
              <p key={i} style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 18, color: TEXT, lineHeight: 1.7, margin: "0 0 10px" }}>→ {o}</p>
            ))}
          </Section>
        )}

        {study?.problemsSolved && (
          <Section label="Problems Solved">
            {study.problemsSolved.map((p, i) => (
              <p key={i} style={{ fontFamily: '"Cormorant Garamond",serif', fontStyle: "italic", fontSize: 17, color: DIM, lineHeight: 1.8, margin: "0 0 12px" }}>{p}</p>
            ))}
          </Section>
        )}

        {project.streams && (
          <Section label="Workstreams">
            {project.streams.map((s, i) => (
              <div key={i} style={{ marginBottom: 24, paddingLeft: 20, borderLeft: `2px solid ${project.accent}33` }}>
                <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 22, color: TEXT, marginBottom: 8 }}>{s.title}</div>
                <Prose italic>{s.desc}</Prose>
                <div style={{ fontFamily: '"DM Mono",monospace', fontSize: 9, letterSpacing: 2, color: project.accent, marginTop: 8 }}>{s.metric}</div>
              </div>
            ))}
          </Section>
        )}

        {study?.conclusion && (
          <Section label="Conclusion"><Prose italic>{study.conclusion}</Prose></Section>
        )}

        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginTop: 48, paddingTop: 32, borderTop: `1px solid ${BORDER}` }}>
          {siteUrl && (
            <a href={siteUrl} target="_blank" rel="noopener" style={{ fontFamily: '"DM Mono",monospace', fontSize: 10, letterSpacing: 3, color: GOLD, textDecoration: "none", textTransform: "uppercase", borderBottom: `1px solid ${GOLD}44`, paddingBottom: 4 }}>
              Visit live site ↗
            </a>
          )}
          {study?.docUrl && (
            <a href={study.docUrl} target="_blank" rel="noopener" style={{ fontFamily: '"DM Mono",monospace', fontSize: 10, letterSpacing: 3, color: DIM, textDecoration: "none", textTransform: "uppercase", borderBottom: `1px solid ${BORDER}`, paddingBottom: 4 }}>
              Full case study doc ↗
            </a>
          )}
        </div>
      </main>
    </div>
  )
}
