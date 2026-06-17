import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
  DEFAULT_A11Y,
  applyA11yPrefs,
  getTextScale,
  loadA11yPrefs,
  saveA11yPrefs,
} from "../lib/accessibilityState.js"

const AccessibilityContext = createContext(null)

export function AccessibilityProvider({ children }) {
  const [prefs, setPrefs] = useState(() => loadA11yPrefs())

  useEffect(() => {
    applyA11yPrefs(prefs)
    saveA11yPrefs(prefs)
  }, [prefs])

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mq.matches && !localStorage.getItem("portfolio-a11y")) {
      setPrefs(p => ({ ...p, reduceMotion: true }))
    }
  }, [])

  const setTextSize = useCallback(id => {
    setPrefs(p => ({ ...p, textSize: id }))
  }, [])

  const toggleReduceMotion = useCallback(() => {
    setPrefs(p => ({ ...p, reduceMotion: !p.reduceMotion }))
  }, [])

  const toggleHighContrast = useCallback(() => {
    setPrefs(p => ({ ...p, highContrast: !p.highContrast }))
  }, [])

  const toggleSystemCursor = useCallback(() => {
    setPrefs(p => ({ ...p, systemCursor: !p.systemCursor }))
  }, [])

  const resetPrefs = useCallback(() => {
    setPrefs({ ...DEFAULT_A11Y })
  }, [])

  const value = useMemo(() => ({
    ...prefs,
    textScale: getTextScale(prefs.textSize),
    setTextSize,
    toggleReduceMotion,
    toggleHighContrast,
    toggleSystemCursor,
    resetPrefs,
  }), [prefs, setTextSize, toggleReduceMotion, toggleHighContrast, toggleSystemCursor, resetPrefs])

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext)
  if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider")
  return ctx
}
