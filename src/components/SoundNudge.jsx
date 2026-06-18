import { useCallback, useEffect, useRef } from "react"

const AUDIO_PREF_KEY = "portfolio-audio-on"

export default function SoundNudge() {
  const nudgeRef = useRef(null)
  const shown = useRef(false)
  const dismissed = useRef(false)
  const listeners = useRef({ show: null, dismiss: null })

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
    if (show) document.removeEventListener("mousemove", show)
    if (dismiss) document.removeEventListener("pointerdown", dismiss)
  }, [])

  const closeNudge = useCallback(e => {
    e.preventDefault()
    e.stopPropagation()
    dismissNudge(true)
  }, [dismissNudge])

  useEffect(() => {
    const stored = sessionStorage.getItem(AUDIO_PREF_KEY)
    if (stored !== null) return

    const showNudge = () => {
      if (shown.current || dismissed.current) return
      shown.current = true
      nudgeRef.current?.classList.add("sound-nudge--visible")
    }

    const dismissOnInteract = () => dismissNudge(false)

    listeners.current = { show: showNudge, dismiss: dismissOnInteract }

    document.addEventListener("mousemove", showNudge, { once: true })
    document.addEventListener("pointerdown", dismissOnInteract, { once: true })

    return () => {
      document.removeEventListener("mousemove", showNudge)
      document.removeEventListener("pointerdown", dismissOnInteract)
    }
  }, [dismissNudge])

  return (
    <div ref={nudgeRef} className="sound-nudge" data-sound-nudge role="status" aria-live="polite">
      <span className="sound-nudge__icon" aria-hidden="true">♪</span>
      <span className="sound-nudge__text">Click anywhere to enable ambient sound</span>
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
