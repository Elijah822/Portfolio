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
  ensureAudio().load()
}

export function isAmbientPlaying() {
  return Boolean(audio && !audio.paused)
}

export function playAmbientTrack() {
  const el = ensureAudio()
  if (!el.paused) return Promise.resolve(true)

  return el.play()
    .then(() => true)
    .catch(() => false)
}

export function pauseAmbientTrack() {
  if (!audio) return
  audio.pause()
  try { audio.currentTime = 0 } catch (_) {}
}

export function setAmbientTrackVolume(v) {
  ensureAudio().volume = Math.max(0, Math.min(1, v))
}
