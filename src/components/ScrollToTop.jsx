import { useLayoutEffect } from "react"
import { useLocation, useNavigationType } from "react-router-dom"
import { enforceScrollPosition } from "../lib/scrollToTop.js"
import { consumeHomeScroll, restoreScrollPosition } from "../lib/scrollRestore.js"

export default function ScrollToTop() {
  const { pathname, hash, state } = useLocation()
  const navigationType = useNavigationType()

  useLayoutEffect(() => {
    if (pathname === "/") {
      const shouldRestore = navigationType === "POP" || state?.restoreScroll === true
      if (shouldRestore) {
        const y = consumeHomeScroll()
        if (y != null) return restoreScrollPosition(y)
      }

      if (hash) return enforceScrollPosition({ hash })

      if (navigationType === "PUSH" && state?.restoreScroll !== true) {
        return enforceScrollPosition()
      }

      return
    }

    return enforceScrollPosition({ hash })
  }, [pathname, hash, navigationType, state])

  useLayoutEffect(() => {
    const onPageShow = event => {
      if (!event.persisted || window.location.pathname !== "/") return
      const y = consumeHomeScroll()
      if (y != null) restoreScrollPosition(y)
      else enforceScrollPosition({ hash: window.location.hash })
    }

    const onLoad = () => {
      if (window.location.pathname !== "/") enforceScrollPosition({ hash: window.location.hash })
    }

    window.addEventListener("pageshow", onPageShow)
    window.addEventListener("load", onLoad)
    return () => {
      window.removeEventListener("pageshow", onPageShow)
      window.removeEventListener("load", onLoad)
    }
  }, [])

  return null
}
