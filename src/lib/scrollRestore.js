const HOME_SCROLL_KEY = "portfolio-home-scroll"

export function saveHomeScroll(y = window.scrollY) {
  sessionStorage.setItem(HOME_SCROLL_KEY, String(Math.max(0, Math.round(y))))
}

export function peekHomeScroll() {
  const raw = sessionStorage.getItem(HOME_SCROLL_KEY)
  if (raw == null) return null
  const y = Number(raw)
  return Number.isFinite(y) ? y : null
}

export function consumeHomeScroll() {
  const y = peekHomeScroll()
  if (y == null) return null
  sessionStorage.removeItem(HOME_SCROLL_KEY)
  return y
}

export function restoreScrollPosition(y) {
  const apply = () => {
    window.scrollTo({ top: y, left: 0, behavior: "instant" })
    document.documentElement.scrollTop = y
    document.body.scrollTop = y
  }

  apply()
  const raf = requestAnimationFrame(apply)
  const timers = [0, 50, 150, 400, 800].map(ms => setTimeout(apply, ms))
  return () => {
    cancelAnimationFrame(raf)
    timers.forEach(clearTimeout)
  }
}

export function navigateBackToWork(navigate) {
  if (peekHomeScroll() != null) {
    navigate("/", { state: { restoreScroll: true } })
    return
  }
  navigate("/#work")
}
