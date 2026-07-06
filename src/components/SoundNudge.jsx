import { useCallback, useEffect, useRef, useState } from "react"

function isDesktopPointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches
}

export default function SoundNudge() {
  const nudgeRef = useRef(null)
  const shown = useRef(false)
  const dismissed = useRef(false)
  const [enabled, setEnabled] = useState(false)

  const dismissNudge = useCallback((explicitMute = false) => {
    if (dismissed.current) return
    dismissed.current = true
    nudgeRef.current?.classList.remove("sound-nudge--visible")
    nudgeRef.current?.classList.add("sound-nudge--dismissed")

    if (explicitMute) {
      try {
        sessionStorage.setItem("portfolio-audio-on", "0")
      } catch (_) {}
    }
  }, [])

  const closeNudge = useCallback(e => {
    e.preventDefault()
    e.stopPropagation()
    dismissNudge(true)
  }, [dismissNudge])

  useEffect(() => {
    setEnabled(isDesktopPointer())
  }, [])

  useEffect(() => {
    if (!enabled) return undefined

    const stored = sessionStorage.getItem("portfolio-audio-on")
    if (stored !== null) return undefined

    const showNudge = () => {
      if (shown.current || dismissed.current) return
      shown.current = true
      nudgeRef.current?.classList.add("sound-nudge--visible")
    }

    const timer = window.setTimeout(showNudge, 2800)
    return () => window.clearTimeout(timer)
  }, [enabled])

  if (!enabled) return null

  return (
    <div ref={nudgeRef} className="sound-nudge" data-sound-nudge role="status" aria-live="polite">
      <span className="sound-nudge__icon" aria-hidden="true">♪</span>
      <span className="sound-nudge__text">Use the sound toggle in the nav for ambient music</span>
      <button
        type="button"
        className="sound-nudge__close"
        data-h
        data-sound-nudge-close
        aria-label="Dismiss sound prompt"
        onPointerDown={closeNudge}
        onClick={closeNudge}
      >
        ×
      </button>
    </div>
  )
}
