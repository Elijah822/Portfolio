import { useEffect, useRef } from "react"

const AUDIO_PREF_KEY = "portfolio-audio-on"

export default function SoundNudge() {
  const nudgeRef = useRef(null)
  const shown = useRef(false)
  const dismissed = useRef(false)

  useEffect(() => {
    const stored = sessionStorage.getItem(AUDIO_PREF_KEY)
    if (stored !== null) return

    const showNudge = () => {
      if (shown.current || dismissed.current) return
      shown.current = true
      nudgeRef.current?.classList.add("sound-nudge--visible")
    }

    const dismissNudge = () => {
      if (dismissed.current) return
      dismissed.current = true
      nudgeRef.current?.classList.remove("sound-nudge--visible")
      nudgeRef.current?.classList.add("sound-nudge--dismissed")
      document.removeEventListener("mousemove", showNudge)
      document.removeEventListener("pointerdown", dismissNudge)
    }

    document.addEventListener("mousemove", showNudge, { once: true })
    document.addEventListener("pointerdown", dismissNudge, { once: true })

    return () => {
      document.removeEventListener("mousemove", showNudge)
      document.removeEventListener("pointerdown", dismissNudge)
    }
  }, [])

  return (
    <div ref={nudgeRef} className="sound-nudge" aria-hidden="true">
      <span className="sound-nudge__icon">♪</span>
      <span className="sound-nudge__text">Click anywhere to enable ambient sound</span>
    </div>
  )
}
