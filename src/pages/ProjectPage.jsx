import { useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import SoundButton from "../components/SoundButton.jsx"
import ScrollReveal from "../components/ScrollReveal.jsx"
import { ALL_PROJECTS } from "../data/projects.js"
import { getCaseStudy } from "../data/caseStudies.js"
import { getProjectMeta } from "../data/projectMeta.js"
import { getProjectMedia, videoPoster } from "../data/projectMedia.js"

const BG = "#07070c"
const TEXT = "#e0dbd2"
const DIM = "#a39e98"
const GOLD = "#c9aa7c"
const BORDER = "rgba(255,255,255,0.07)"

function Section({ label, children, delay = 0 }) {
  return (
    <ScrollReveal variant="fade-up" delay={delay} style={{ marginBottom: 48 }}>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 4, color: GOLD, marginBottom: 16, textTransform: "uppercase" }}>{label}</div>
      {children}
    </ScrollReveal>
  )
}

function Prose({ children }) {
  return (
    <p style={{ fontFamily: "var(--font-body)", fontSize: 17, fontWeight: 400, lineHeight: 1.8, color: TEXT, margin: 0 }}>{children}</p>
  )
}

function ProjectMetrics({ metrics, accent }) {
  return (
    <div className="project-metrics">
      {metrics.map(({ value, label }, i) => (
        <ScrollReveal key={label} as="div" variant="scale-up" delay={i * 80} className="project-metric">
          <div className="project-metric-value" style={{ color: accent }}>{value}</div>
          <div className="project-metric-label">{label}</div>
        </ScrollReveal>
      ))}
    </div>
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
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 2, color: c.color, background: c.bg, padding: "4px 10px", border: `1px solid ${c.color}22`, textTransform: "uppercase" }}>
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
    const onKey = e => { if (e.key === "Escape") navigate("/#work") }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [navigate])

  if (!project) {
    return (
      <div style={{ background: BG, minHeight: "100vh", color: TEXT, padding: 120, textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 28 }}>Project not found.</p>
        <Link to="/" style={{ color: GOLD }}>← Back home</Link>
      </div>
    )
  }

  const siteUrl = meta?.siteUrl || project.url
  const overview = study?.overview || project.desc

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT }}>
      <style>{`
        .project-metrics {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-bottom: 56px;
        }
        .project-metric {
          padding: 24px 28px;
          border: 1px solid ${BORDER};
          background: rgba(255,255,255,0.015);
        }
        .project-metric-value {
          font-family: var(--font-body);
          font-size: 40px;
          font-weight: 300;
          line-height: 1;
          margin-bottom: 10px;
        }
        .project-metric-label {
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 400;
          line-height: 1.5;
          color: ${DIM};
          max-width: 28ch;
        }
        @media (min-width: 640px) {
          .project-metrics {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, padding: "20px 56px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(7,7,12,0.94)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${BORDER}` }}>
        <Link to="/" style={{ fontFamily: "var(--font-heading)", fontSize: 22, color: TEXT, letterSpacing: 3, fontWeight: 300, textDecoration: "none" }}>AE</Link>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <SoundButton />
          <button data-h onClick={() => navigate("/#work")} style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 3, color: DIM, background: "none", border: `1px solid ${BORDER}`, padding: "10px 18px", cursor: "none", textTransform: "uppercase" }}>
            ← All work
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "80px 56px 120px" }}>
        <ScrollReveal variant="fade-up">
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 64, fontWeight: 300, color: project.accent, lineHeight: 1 }}>{project.id}</span>
            <StatusBadge status={project.status} label={project.statusLabel} />
            {meta && (
              <span style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 2, color: DIM, display: "flex", alignItems: "center", gap: 8 }}>
                {meta.flags.join(" ")} {meta.region}
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(36px,5vw,64px)", fontWeight: 500, lineHeight: 1.15, margin: "0 0 16px" }}>{project.title}</h1>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 2, color: DIM, marginBottom: 40 }}>
            {(study?.role || project.role)} · {project.year}
            {study?.productType && ` · ${study.productType}`}
          </div>
        </ScrollReveal>

        {media?.hero && media.hero.showOnProjectPage !== false && (
          <ScrollReveal variant="scale-up" delay={100} style={{ marginBottom: 56, borderRadius: 2, overflow: "hidden", border: `1px solid ${BORDER}`, aspectRatio: "16/9", background: "#0a0a10" }}>
            <video src={media.hero.url} poster={videoPoster(media.hero.url)} controls playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </ScrollReveal>
        )}

        <ProjectMetrics metrics={project.metrics} accent={project.accent} />

        <Section label="Overview"><Prose>{overview}</Prose></Section>

        {study?.problem && <Section label="The Problem"><Prose>{study.problem}</Prose></Section>}
        {study?.challenge && <Section label="Challenge"><Prose>{study.challenge}</Prose></Section>}
        {study?.goal && <Section label="Goal"><Prose>{study.goal}</Prose></Section>}
        {study?.solution && <Section label="The Solution"><Prose>{study.solution}</Prose></Section>}

        {study?.approach && (
          <Section label="Approach">
            {study.approach.map((item, i) => (
              <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 400, color: DIM, lineHeight: 1.8, margin: "0 0 14px", paddingLeft: 16, borderLeft: `2px solid ${project.accent}33` }}>{item}</p>
            ))}
          </Section>
        )}

        {study?.features && (
          <Section label="Core Features">
            {study.features.map((f, i) => (
              <div key={i} style={{ marginBottom: 20, paddingLeft: 20, borderLeft: `2px solid ${project.accent}33` }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 20, color: TEXT, marginBottom: 6 }}>{f.title}</div>
                <Prose>{f.desc}</Prose>
              </div>
            ))}
          </Section>
        )}

        {study?.highlights && (
          <Section label="Redesign Highlights">
            {study.highlights.map((h, i) => (
              <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: 18, color: TEXT, lineHeight: 1.7, margin: "0 0 10px" }}>→ {h}</p>
            ))}
          </Section>
        )}

        {study?.deliverables && (
          <Section label="Deliverables">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {study.deliverables.map(d => (
                <span key={d} style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 2, color: DIM, padding: "6px 12px", border: `1px solid ${BORDER}`, textTransform: "uppercase" }}>{d}</span>
              ))}
            </div>
          </Section>
        )}

        {study?.impact && (
          <Section label="Impact & Results">
            {study.impact.map((item, i) => (
              <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: 18, color: TEXT, lineHeight: 1.7, margin: "0 0 10px" }}>→ {item}</p>
            ))}
          </Section>
        )}

        {study?.outcomes && (
          <Section label="Outcomes">
            {study.outcomes.map((o, i) => (
              <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: 18, color: TEXT, lineHeight: 1.7, margin: "0 0 10px" }}>→ {o}</p>
            ))}
          </Section>
        )}

        {study?.problemsSolved && (
          <Section label="Problems Solved">
            {study.problemsSolved.map((p, i) => (
              <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 400, color: DIM, lineHeight: 1.8, margin: "0 0 12px" }}>{p}</p>
            ))}
          </Section>
        )}

        {project.streams && (
          <Section label="Workstreams">
            {project.streams.map((s, i) => (
              <div key={i} style={{ marginBottom: 24, paddingLeft: 20, borderLeft: `2px solid ${project.accent}33` }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 22, color: TEXT, marginBottom: 8 }}>{s.title}</div>
                <Prose>{s.desc}</Prose>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 2, color: project.accent, marginTop: 8 }}>{s.metric}</div>
              </div>
            ))}
          </Section>
        )}

        {study?.conclusion && (
          <Section label="Conclusion"><Prose>{study.conclusion}</Prose></Section>
        )}

        <ScrollReveal variant="fade-up" delay={120} style={{ display: "flex", gap: 32, flexWrap: "wrap", marginTop: 48, paddingTop: 32, borderTop: `1px solid ${BORDER}` }}>
          {siteUrl && (
            <a href={siteUrl} target="_blank" rel="noopener" style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 3, color: GOLD, textDecoration: "none", textTransform: "uppercase", borderBottom: `1px solid ${GOLD}44`, paddingBottom: 4 }}>
              Visit live site ↗
            </a>
          )}
          {study?.docUrl && (
            <a href={study.docUrl} target="_blank" rel="noopener" style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 3, color: DIM, textDecoration: "none", textTransform: "uppercase", borderBottom: `1px solid ${BORDER}`, paddingBottom: 4 }}>
              Full case study doc ↗
            </a>
          )}
        </ScrollReveal>
      </main>
    </div>
  )
}
