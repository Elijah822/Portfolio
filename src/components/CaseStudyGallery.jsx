import { useState } from "react"
import ScrollReveal from "./ScrollReveal.jsx"
import { cloudinaryImage, cloudinaryVideoFrame } from "../lib/cloudinary.js"
import "./CaseStudyGallery.css"

function resolveSrc(item) {
  if (item.url) return item.url
  if (item.type === "videoFrame") return cloudinaryVideoFrame(item.src, item.at ?? 0, { width: item.width ?? 1400 })
  return cloudinaryImage(item.src, { width: item.width ?? 1400 })
}

export default function CaseStudyGallery({ items, accent, label = "Product visuals" }) {
  const [active, setActive] = useState(null)

  if (!items?.length) return null

  const layout = items.length === 1 ? "single" : items.length === 2 ? "duo" : "grid"

  return (
    <>
      <ScrollReveal variant="fade-up" className="case-gallery-wrap">
        <div className="case-gallery__eyebrow">{label}</div>
        <div className={`case-gallery case-gallery--${layout}`}>
          {items.map((item, i) => {
            const src = resolveSrc(item)
            const featured = item.featured || (layout === "grid" && i === 0)
            return (
              <button
                key={`${item.alt}-${i}`}
                type="button"
                className={`case-gallery__item${featured ? " case-gallery__item--featured" : ""}`}
                style={{ "--accent": accent }}
                onClick={() => setActive({ ...item, src })}
                aria-label={item.alt}
              >
                <img src={src} alt={item.alt} loading="lazy" decoding="async" />
                {item.caption && <span className="case-gallery__caption">{item.caption}</span>}
              </button>
            )
          })}
        </div>
      </ScrollReveal>

      {active && (
        <div className="case-gallery-lightbox" role="dialog" aria-modal="true" aria-label={active.alt} onClick={() => setActive(null)}>
          <button type="button" className="case-gallery-lightbox__close" onClick={() => setActive(null)} aria-label="Close">
            ×
          </button>
          <figure className="case-gallery-lightbox__figure" onClick={e => e.stopPropagation()}>
            <img src={active.src} alt={active.alt} />
            {active.caption && <figcaption>{active.caption}</figcaption>}
          </figure>
        </div>
      )}
    </>
  )
}
