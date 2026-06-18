import { useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import ScrollReveal from "../components/ScrollReveal.jsx"
import SiteNav from "../components/SiteNav.jsx"
import { ALL_PROJECTS } from "../data/projects.js"
import { getCaseStudy } from "../data/caseStudies.js"
import { getProjectMeta } from "../data/projectMeta.js"
import { getProjectMedia, videoPoster } from "../data/projectMedia.js"
import { navigateBackToWork } from "../lib/scrollRestore.js"

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

function CaseStudyListItem({ title, children, accent }) {
  return (
    <div className="case-study-item" style={{ borderLeftColor: `${accent}44` }}>
      <h3 className="case-study-item-title" style={{ color: accent }}>{title}</h3>
      <div className="case-study-item-body">{children}</div>
    </div>
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

function getProjectMetaTags(project, study) {
  const tags = []
  const role = study?.role || project.role
  if (role) tags.push(role)
  if (project.year) tags.push(project.year)
  if (study?.productType) {
    study.productType.split("·").map(s => s.trim()).filter(Boolean).forEach(t => tags.push(t))
  } else if (project.cat) {
    project.cat.split(" · ").map(s => s.trim()).filter(Boolean).forEach(t => tags.push(t))
  }
  return tags
}

export default function ProjectPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = ALL_PROJECTS.find(p => p.id === id)
  const meta = getProjectMeta(id)
  const media = getProjectMedia(id)
  const study = getCaseStudy(id)

  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") navigateBackToWork(navigate) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [navigate])

  if (!project) {
    return (
      <div className="page-pad-x" style={{ background: BG, minHeight: "100vh", color: TEXT, paddingTop: 120, paddingBottom: 120, textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 28 }}>Project not found.</p>
        <Link to="/" style={{ color: GOLD }}>← Back home</Link>
      </div>
    )
  }

  const siteUrl = meta?.siteUrl || project.url
  const overview = study?.overview || project.desc
  const metaTags = getProjectMetaTags(project, study)

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
        .case-study-list {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        .case-study-item {
          padding: 4px 0 4px 28px;
          border-left: 2px solid;
        }
        .case-study-item-title {
          font-family: var(--font-heading);
          font-size: clamp(19px, 2.4vw, 24px);
          font-weight: 500;
          line-height: 1.25;
          margin: 0 0 14px;
          letter-spacing: -0.01em;
        }
        .case-study-item-body {
          font-family: var(--font-body);
          font-size: 16px;
          font-weight: 400;
          line-height: 1.8;
          color: ${DIM};
          max-width: 62ch;
        }
        .case-study-bullets {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .case-study-bullet {
          font-family: var(--font-body);
          font-size: 17px;
          font-weight: 400;
          line-height: 1.75;
          color: ${TEXT};
          margin: 0;
          padding-left: 4px;
        }
        @media (max-width: 768px) {
          .project-main { padding-top: 72px !important; padding-bottom: 80px !important; }
          .project-hero-media {
            width: 100%;
            max-width: 100%;
            height: 50svh;
            aspect-ratio: auto;
          }
          .project-hero-media video {
            width: 100%;
            height: 100%;
            max-width: 100%;
            object-fit: cover;
          }
        }
        .project-meta-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 6px;
          row-gap: 10px;
          margin-bottom: 14px;
        }
        .project-meta-badge {
          font-family: var(--font-body);
          font-size: 11px;
          letter-spacing: 2px;
          line-height: 1.55;
          color: ${DIM};
          padding: 6px 10px;
          border: 1px solid ${BORDER};
          text-transform: uppercase;
        }
        .project-meta-region {
          font-family: var(--font-body);
          font-size: 12px;
          letter-spacing: 2px;
          color: ${DIM};
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 40px;
        }
        .project-hero-media {
          margin-bottom: 56px;
          border-radius: 2px;
          overflow: hidden;
          border: 1px solid ${BORDER};
          aspect-ratio: 16/9;
          background: #0a0a10;
        }
        .project-hero-media video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      `}</style>
      <SiteNav sticky />
      <div className="page-pad-x page-shell" style={{ maxWidth: 900, paddingTop: 12, display: "flex", justifyContent: "flex-end" }}>
        <button data-h type="button" onClick={() => navigateBackToWork(navigate)} style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 3, color: DIM, background: "none", border: `1px solid ${BORDER}`, padding: "10px 18px", textTransform: "uppercase" }}>
          ← All work
        </button>
      </div>

      <main className="project-main page-main page-shell" style={{ maxWidth: 900, paddingTop: 24, paddingBottom: 120 }}>
        <ScrollReveal variant="fade-up">
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 64, fontWeight: 300, color: project.accent, lineHeight: 1 }}>{project.id}</span>
            <StatusBadge status={project.status} label={project.statusLabel} />
          </div>

          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(36px,5vw,64px)", fontWeight: 500, lineHeight: 1.15, margin: "0 0 16px" }}>{project.title}</h1>

          <div className="project-meta-badges">
            {metaTags.map(tag => (
              <span key={tag} className="project-meta-badge" style={{ borderColor: `${project.accent}33` }}>{tag}</span>
            ))}
          </div>

          {meta && (
            <div className="project-meta-region">
              <span>{meta.flags.join(" ")}</span>
              <span>{meta.region}</span>
            </div>
          )}
          {!meta && <div style={{ marginBottom: 40 }} />}
        </ScrollReveal>

        {media?.hero && media.hero.showOnProjectPage !== false && (
          <ScrollReveal variant="scale-up" delay={100} className="project-hero-media">
            <video src={media.hero.url} poster={videoPoster(media.hero.url)} controls playsInline data-hero-video />
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
            <div className="case-study-list">
              {study.approach.map((item, i) => (
                <p key={i} className="case-study-item-body" style={{ paddingLeft: 28, borderLeft: `2px solid ${project.accent}44`, margin: 0 }}>{item}</p>
              ))}
            </div>
          </Section>
        )}

        {study?.features && (
          <Section label="Core Features">
            <div className="case-study-list">
              {study.features.map((f, i) => (
                <CaseStudyListItem key={i} title={f.title} accent={project.accent}>
                  {f.desc}
                </CaseStudyListItem>
              ))}
            </div>
          </Section>
        )}

        {study?.highlights && (
          <Section label="Redesign Highlights">
            <div className="case-study-bullets">
              {study.highlights.map((h, i) => (
                <p key={i} className="case-study-bullet">→ {h}</p>
              ))}
            </div>
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
            <div className="case-study-bullets">
              {study.impact.map((item, i) => (
                <p key={i} className="case-study-bullet">→ {item}</p>
              ))}
            </div>
          </Section>
        )}

        {study?.outcomes && (
          <Section label="Outcomes">
            <div className="case-study-bullets">
              {study.outcomes.map((o, i) => (
                <p key={i} className="case-study-bullet">→ {o}</p>
              ))}
            </div>
          </Section>
        )}

        {study?.problemsSolved && (
          <Section label="Problems Solved">
            <div className="case-study-list">
              {study.problemsSolved.map((p, i) => (
                <p key={i} className="case-study-item-body" style={{ paddingLeft: 28, borderLeft: `2px solid ${project.accent}44`, margin: 0 }}>{p}</p>
              ))}
            </div>
          </Section>
        )}

        {project.streams && (
          <Section label="Workstreams">
            <div className="case-study-list">
              {project.streams.map((s, i) => (
                <CaseStudyListItem key={i} title={s.title} accent={project.accent}>
                  <>
                    {s.desc}
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 2, color: project.accent, marginTop: 14, textTransform: "uppercase" }}>{s.metric}</div>
                  </>
                </CaseStudyListItem>
              ))}
            </div>
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
