import { useCallback, useEffect, useRef, useState } from "react"

const STICKY_TOP = 88
const SCROLL_LOCK_MS = 900

export function useServicesScrollSpy(services, enabled) {
  const [active, setActiveId] = useState(services[0]?.id ?? "")
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const locking = useRef(false)
  const lockTimer = useRef(null)

  const releaseLock = useCallback(() => {
    locking.current = false
    lockTimer.current = null
  }, [])

  const lock = useCallback(() => {
    locking.current = true
    if (lockTimer.current) clearTimeout(lockTimer.current)
    lockTimer.current = setTimeout(releaseLock, SCROLL_LOCK_MS)
  }, [releaseLock])

  const getPinMetrics = useCallback(() => {
    const pin = pinRef.current
    if (!pin) return null

    const vh = window.innerHeight
    const pinStart = pin.offsetTop - STICKY_TOP
    const scrollRange = Math.max(pin.offsetHeight - vh, 1)

    return { pin, pinStart, scrollRange, vh }
  }, [])

  const pickActive = useCallback(() => {
    if (locking.current) return

    const metrics = getPinMetrics()
    if (!metrics) return

    const { pinStart, scrollRange } = metrics
    const scrollY = window.scrollY

    if (scrollY <= pinStart) {
      setActiveId(services[0].id)
      return
    }

    if (scrollY >= pinStart + scrollRange) {
      setActiveId(services[services.length - 1].id)
      return
    }

    const progress = (scrollY - pinStart) / scrollRange
    const index = Math.min(
      services.length - 1,
      Math.max(0, Math.floor(progress * services.length))
    )

    setActiveId(services[index].id)
  }, [getPinMetrics, services])

  useEffect(() => {
    if (!enabled) return undefined

    let frame = 0
    const onScroll = () => {
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
    if (index < 0) return

    setActiveId(id)

    const metrics = getPinMetrics()
    if (!metrics || services.length < 2) return

    const { pinStart, scrollRange } = metrics
    const segment = scrollRange / (services.length - 1)
    const targetScroll = pinStart + index * segment

    lock()
    window.scrollTo({ top: targetScroll, behavior: "smooth" })
  }, [getPinMetrics, lock, services])

  return {
    active,
    sectionRef,
    pinRef,
    goToService,
  }
}
