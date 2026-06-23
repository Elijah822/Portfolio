import { useCallback, useEffect, useRef, useState } from "react"

const EASE_MS = 900

export function useServicesScrollSpy(services, enabled) {
  const [active, setActiveId] = useState(services[0]?.id ?? "")
  const sectionRef = useRef(null)
  const stepRefs = useRef([])
  const locking = useRef(false)
  const lockTimer = useRef(null)

  const setStepRef = useCallback((index, el) => {
    stepRefs.current[index] = el
  }, [])

  const releaseLock = useCallback(() => {
    locking.current = false
    lockTimer.current = null
  }, [])

  const lock = useCallback(() => {
    locking.current = true
    if (lockTimer.current) clearTimeout(lockTimer.current)
    lockTimer.current = setTimeout(releaseLock, EASE_MS)
  }, [releaseLock])

  const pickActive = useCallback(() => {
    const section = sectionRef.current
    if (!section || !stepRefs.current.length) return

    const sectionRect = section.getBoundingClientRect()
    const inSection =
      sectionRect.top < window.innerHeight * 0.85 &&
      sectionRect.bottom > window.innerHeight * 0.15
    if (!inSection) return

    const anchor = window.innerHeight * 0.42
    const steps = stepRefs.current.filter(Boolean)
    if (!steps.length) return

    const firstRect = steps[0].getBoundingClientRect()
    if (firstRect.top > anchor) {
      setActiveId(services[0].id)
      return
    }

    const lastRect = steps[steps.length - 1].getBoundingClientRect()
    if (lastRect.bottom < anchor) {
      setActiveId(services[services.length - 1].id)
      return
    }

    let best = 0
    let bestDist = Infinity

    steps.forEach((el, i) => {
      const rect = el.getBoundingClientRect()
      const mid = rect.top + rect.height * 0.5
      const dist = Math.abs(mid - anchor)
      if (dist < bestDist) {
        bestDist = dist
        best = i
      }
    })

    const next = services[best]?.id
    if (next) setActiveId(next)
  }, [services])

  useEffect(() => {
    if (!enabled) return undefined

    let frame = 0
    const onScroll = () => {
      if (locking.current) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(pickActive)
    }

    pickActive()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [enabled, pickActive])

  useEffect(() => () => {
    if (lockTimer.current) clearTimeout(lockTimer.current)
  }, [])

  const goToService = useCallback(id => {
    const index = services.findIndex(s => s.id === id)
    const el = stepRefs.current[index]
    if (!el) {
      setActiveId(id)
      return
    }

    lock()
    setActiveId(id)
    el.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [lock, services])

  return {
    active,
    sectionRef,
    setStepRef,
    goToService,
  }
}
