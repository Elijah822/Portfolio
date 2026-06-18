import { MUSIC_AUDIO_URL } from "../data/projectMeta.js"

let audio = null

function ensureAudio() {
  if (!audio) {
    audio = new Audio(MUSIC_AUDIO_URL)
    audio.loop = true
    audio.preload = "auto"
    audio.volume = 0.22
  }
  return audio
}

export function initAmbientPlayer() {
  ensureAudio()
}

export function playAmbientTrack() {
  const el = ensureAudio()
  if (!el.paused) return true
  void el.play().catch(() => {})
  return true
}

export function pauseAmbientTrack() {
  if (!audio) return
  audio.pause()
  try { audio.currentTime = 0 } catch (_) {}
}

export function setAmbientTrackVolume(v) {
  ensureAudio().volume = Math.max(0, Math.min(1, v))
}
