import { useLayoutEffect } from "react"
import { useLocation } from "react-router-dom"
import { enforceScrollPosition } from "../lib/scrollToTop.js"

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    return enforceScrollPosition({ hash })
  }, [pathname, hash])

  useLayoutEffect(() => {
    const onPageShow = event => {
      if (!event.persisted) return
      enforceScrollPosition({ hash: window.location.hash })
    }

    const onLoad = () => enforceScrollPosition({ hash: window.location.hash })

    window.addEventListener("pageshow", onPageShow)
    window.addEventListener("load", onLoad)
    return () => {
      window.removeEventListener("pageshow", onPageShow)
      window.removeEventListener("load", onLoad)
    }
  }, [])

  return null
}
