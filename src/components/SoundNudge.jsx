import { useCallback, useEffect, useRef, useState } from "react"

const AUDIO_PREF_KEY = "portfolio-audio-on"
const SHOW_EVENTS = ["mousemove", "pointermove", "scroll", "touchstart"]

export default function SoundNudge() {
  const nudgeRef = useRef(null)
  const shown = useRef(false)
  const dismissed = useRef(false)
  const listeners = useRef({ show: null, dismiss: null })
  const [hint, setHint] = useState("Click anywhere to enable ambient sound")

  const dismissNudge = useCallback((explicitMute = false) => {
    if (dismissed.current) return
    dismissed.current = true
    nudgeRef.current?.classList.remove("sound-nudge--visible")
    nudgeRef.current?.classList.add("sound-nudge--dismissed")

    if (explicitMute) {
      try {
        sessionStorage.setItem(AUDIO_PREF_KEY, "0")
      } catch (_) {}
    }

    const { show, dismiss } = listeners.current
    if (show) {
      SHOW_EVENTS.forEach(evt => document.removeEventListener(evt, show))
    }
    if (dismiss) document.removeEventListener("pointerdown", dismiss)
  }, [])

  const closeNudge = useCallback(e => {
    e.preventDefault()
    e.stopPropagation()
    dismissNudge(true)
  }, [dismissNudge])

  useEffect(() => {
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
      setHint("Tap anywhere to enable ambient sound")
    }
  }, [])

  useEffect(() => {
    const stored = sessionStorage.getItem(AUDIO_PREF_KEY)
    if (stored !== null) return

    const showNudge = () => {
      if (shown.current || dismissed.current) return
      shown.current = true
      nudgeRef.current?.classList.add("sound-nudge--visible")
      SHOW_EVENTS.forEach(evt => document.removeEventListener(evt, showNudge))
    }

    const dismissOnInteract = () => dismissNudge(false)

    listeners.current = { show: showNudge, dismiss: dismissOnInteract }

    const opts = { passive: true }
    SHOW_EVENTS.forEach(evt => document.addEventListener(evt, showNudge, opts))
    document.addEventListener("pointerdown", dismissOnInteract, { once: true })

    return () => {
      SHOW_EVENTS.forEach(evt => document.removeEventListener(evt, showNudge))
      document.removeEventListener("pointerdown", dismissOnInteract)
    }
  }, [dismissNudge])

  return (
    <div ref={nudgeRef} className="sound-nudge" data-sound-nudge role="status" aria-live="polite">
      <span className="sound-nudge__icon" aria-hidden="true">♪</span>
      <span className="sound-nudge__text">{hint}</span>
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
