import { CONTACT } from "../data/contact.js"

const DIM = "#a39e98"
const TEXT = "#e0dbd2"

const LINKS = [
  { label: "LinkedIn ↗", href: CONTACT.linkedin },
  { label: "X ↗", href: CONTACT.twitter },
  { label: "WhatsApp ↗", href: CONTACT.whatsapp },
]

export default function SocialLinks({ style }) {
  return (
    <div style={{ display: "flex", gap: 28, flexWrap: "wrap", ...style }}>
      {LINKS.map(({ label, href }) => (
        <a
          key={label}
          data-h
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            letterSpacing: 3,
            color: DIM,
            textDecoration: "none",
            textTransform: "uppercase",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => { e.target.style.color = TEXT }}
          onMouseLeave={e => { e.target.style.color = DIM }}
        >
          {label}
        </a>
      ))}
    </div>
  )
}
