import { MUSIC_AUDIO_URL } from "../data/projectMeta.js"

let audio = null
let warmed = false

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
  const el = ensureAudio()
  el.muted = true
  el.load()
  if (!warmed) {
    warmed = true
    void el.play().catch(() => {})
  }
}

export function isAmbientPlaying() {
  return Boolean(audio && !audio.paused)
}

export function isAmbientAudible() {
  return Boolean(audio && !audio.paused && !audio.muted)
}

export function playAmbientTrack() {
  const el = ensureAudio()
  el.muted = false
  el.volume = 0.22

  if (!el.paused) return Promise.resolve(true)

  try {
    return el.play()
      .then(() => true)
      .catch(() => false)
  } catch (_) {
    return Promise.resolve(false)
  }
}

export function pauseAmbientTrack() {
  if (!audio) return
  audio.pause()
  try { audio.currentTime = 0 } catch (_) {}
  audio.muted = true
}

export function pauseAmbientSoft() {
  if (!audio || audio.paused) return
  audio.pause()
}

export function setAmbientTrackVolume(v) {
  ensureAudio().volume = Math.max(0, Math.min(1, v))
}
