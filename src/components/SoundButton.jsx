import { useAmbientAudio } from "../context/AmbientAudioContext.jsx"
import "./SoundButton.css"

export default function SoundButton({ compact = false }) {
  const { soundOn, toggleSound } = useAmbientAudio()

  return (
    <button
      data-h
      data-sound-toggle
      type="button"
      className={`sound-btn${soundOn ? " is-on" : ""}${compact ? " sound-btn--compact" : ""}`}
      onClick={toggleSound}
      aria-label={soundOn ? "Mute ambience" : "Enable ambience"}
      aria-pressed={soundOn}
      title={soundOn ? "Mute ambience" : "Move mouse or scroll to enable sound"}
    >
      <span className="sound-btn__icon" aria-hidden>♪</span>
    </button>
  )
}
