import { useEffect, useState } from "react"
import { useAccessibility } from "../context/AccessibilityContext.jsx"
import { useCoarsePointer } from "../hooks/useMediaQuery.js"
import CustomCursor from "./CustomCursor.jsx"
import AccessibilityMenu from "./AccessibilityMenu.jsx"

export default function AppShell({ children }) {
  const { systemCursor, reduceMotion } = useAccessibility()
  const coarsePointer = useCoarsePointer()
  const [effectsReady, setEffectsReady] = useState(false)

  useEffect(() => {
    if (coarsePointer || systemCursor || reduceMotion) return undefined

    const enable = () => setEffectsReady(true)
    const idleId = window.requestIdleCallback?.(enable, { timeout: 1800 })
    const timerId = window.setTimeout(enable, 1800)

    return () => {
      if (idleId != null) window.cancelIdleCallback?.(idleId)
      window.clearTimeout(timerId)
    }
  }, [coarsePointer, reduceMotion, systemCursor])

  const showCursor = effectsReady && !systemCursor && !coarsePointer && !reduceMotion

  return (
    <>
      {showCursor && <CustomCursor />}
      <AccessibilityMenu />
      {children}
    </>
  )
}
