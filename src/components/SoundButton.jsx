import { useAmbientAudio } from "../context/AmbientAudioContext.jsx"

const GOLD = "#c9aa7c"
const DIM = "#a39e98"
const BORDER = "rgba(255,255,255,0.07)"

export default function SoundButton({ compact = false }) {
  const { soundOn, toggleSound } = useAmbientAudio()

  return (
    <>
      <style>{`@keyframes musicPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }`}</style>
      <button
      data-h
      type="button"
      onClick={toggleSound}
      title={soundOn ? "Mute ambience" : "Tap anywhere to enable sound"}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: compact ? 9 : 10,
        letterSpacing: 2,
        color: soundOn ? GOLD : DIM,
        background: "none",
        border: `1px solid ${soundOn ? `${GOLD}44` : BORDER}`,
        padding: compact ? "7px 14px" : "6px 12px",
        cursor: "none",
        transition: "all 0.2s",
        textTransform: compact ? "uppercase" : "none",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span style={{ animation: soundOn ? "musicPulse 1.4s ease-in-out infinite" : "none" }}>
        {compact ? (soundOn ? "♪ On" : "♪ Off") : (soundOn ? "♪ ON" : "♪")}
      </span>
    </button>
    </>
  )
}
