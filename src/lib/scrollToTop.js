export function scrollPageToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

export function scrollPageToHash(hash) {
  const id = hash.replace(/^#/, "")
  if (!id) return
  document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" })
}

export function enforceScrollPosition({ hash } = {}) {
  if (hash) {
    scrollPageToHash(hash)
    const raf = requestAnimationFrame(() => scrollPageToHash(hash))
    const timer = setTimeout(() => scrollPageToHash(hash), 100)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }

  scrollPageToTop()
  const raf = requestAnimationFrame(scrollPageToTop)
  const timers = [0, 50, 150, 400, 800].map(ms => setTimeout(scrollPageToTop, ms))
  return () => {
    cancelAnimationFrame(raf)
    timers.forEach(clearTimeout)
  }
}

export function initScrollRestoration() {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual"
  scrollPageToTop()
}
