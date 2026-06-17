import { useEffect, useRef, useState } from "react"

function prefersReducedMotion() {
  if (typeof document === "undefined") return false
  return document.documentElement.dataset.reduceMotion === "true"
}

export function useReveal(threshold = 0.12, rootMargin = "0px 0px -6% 0px") {
  const ref = useRef(null)
  const [visible, setVisible] = useState(() => prefersReducedMotion())

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisible(true)
      return undefined
    }

    const el = ref.current
    if (!el) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return [ref, visible]
}
