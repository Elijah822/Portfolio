import {
  initAmbientPlayer,
  pauseAmbientTrack,
  queueAmbientPlay,
  setAmbientTrackVolume,
} from "./youtubePlayer.js"

let ctx = null
let master = null
let unlocked = false
let ambientOn = false
let lastLoadTick = -1
let pendingLoadPct = 0
const unlockListeners = new Set()
const AUDIO_PREF_KEY = "portfolio-audio-on"

export function isExplicitlyMuted() {
  try {
    return sessionStorage.getItem(AUDIO_PREF_KEY) === "0"
  } catch (_) {
    return false
  }
}

export function isAudioPrefOn() {
  try {
    return sessionStorage.getItem(AUDIO_PREF_KEY) !== "0"
  } catch (_) {
    return true
  }
}

export function shouldAutoEnableOnGesture() {
  return !isExplicitlyMuted()
}

function setAudioPref(on) {
  try {
    sessionStorage.setItem(AUDIO_PREF_KEY, on ? "1" : "0")
  } catch (_) {}
}

function getCtx() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return null
  if (!ctx || ctx.state === "closed") ctx = new AudioCtx()
  return ctx
}

export function isAudioUnlocked() {
  return unlocked
}

export function onAudioUnlock(cb) {
  unlockListeners.add(cb)
  return () => unlockListeners.delete(cb)
}

function notifyUnlock() {
  unlockListeners.forEach(cb => {
    try { cb() } catch (_) {}
  })
}

export function setPendingLoadPct(pct) {
  pendingLoadPct = pct
}

export function resetLoadTicks() {
  pendingLoadPct = 0
  lastLoadTick = -1
}

function replayPendingLoadTicks() {
  lastLoadTick = -1
  for (let p = 0; p <= pendingLoadPct; p += 4) playLoadTick(p, true)
  if (pendingLoadPct % 4 !== 0) playLoadTick(pendingLoadPct, true)
}

function kickYouTubePlayback() {
  queueAmbientPlay()
  tryPlayAmbient()
  void initAmbientPlayer().then(() => tryPlayAmbient()).catch(() => {})
}

export function playLoadTick(pct, force = false) {
  if (!unlocked || !ctx || !master) return
  const step = Math.floor(pct / 4)
  if (!force && step <= lastLoadTick) return
  lastLoadTick = step

  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = "sine"
  osc.frequency.setValueAtTime(200 + pct * 6, t)
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(0.09, t + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12)
  osc.connect(g)
  g.connect(master)
  osc.start(t)
  osc.stop(t + 0.13)

  if (pct >= 100) {
    const o2 = ctx.createOscillator()
    const g2 = ctx.createGain()
    o2.type = "triangle"
    o2.frequency.setValueAtTime(480, t + 0.06)
    o2.frequency.exponentialRampToValueAtTime(920, t + 0.4)
    g2.gain.setValueAtTime(0, t + 0.06)
    g2.gain.linearRampToValueAtTime(0.12, t + 0.12)
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.5)
    o2.connect(g2)
    g2.connect(master)
    o2.start(t + 0.06)
    o2.stop(t + 0.51)
  }
}

export function startAmbientMusic() {
  if (isExplicitlyMuted()) return
  setAudioPref(true)
  ambientOn = true
  kickYouTubePlayback()
}

function tryPlayAmbient() {
  if (isExplicitlyMuted()) return
  queueAmbientPlay()
}

export function requestAmbientPlay() {
  tryPlayAmbient()
}

export function stopAmbientMusic() {
  setAudioPref(false)
  pauseAmbientTrack()
  ambientOn = false
}

export function setAmbientVolume(v) {
  setAmbientTrackVolume(v)
  if (master && ctx) master.gain.linearRampToValueAtTime(v * 0.3, ctx.currentTime + 0.4)
}

export function unlockAudio() {
  if (isExplicitlyMuted()) return false

  const wasUnlocked = unlocked
  const audioCtx = getCtx()
  if (!audioCtx) return false
  if (audioCtx.state === "suspended") void audioCtx.resume()
  if (!master) {
    master = audioCtx.createGain()
    master.gain.value = 0.15
    master.connect(audioCtx.destination)
  }

  if (!wasUnlocked) {
    unlocked = true
    setAudioPref(true)
    if (pendingLoadPct > 0) replayPendingLoadTicks()
    kickYouTubePlayback()
    notifyUnlock()
    return true
  }

  if (isAudioPrefOn()) kickYouTubePlayback()
  return false
}

export function setupAudioOnMouseMove(onUnlock) {
  const handler = () => {
    if (unlocked || isExplicitlyMuted()) return
    const fresh = unlockAudio()
    if (fresh) onUnlock?.()
  }

  const opts = { passive: true, capture: true }
  const events = ["pointermove", "mousemove", "touchstart", "touchmove", "scroll", "wheel", "keydown"]

  events.forEach(evt => window.addEventListener(evt, handler, opts))

  return () => {
    events.forEach(evt => window.removeEventListener(evt, handler, opts))
  }
}

export function teardownAudio() {
  stopAmbientMusic()
  try { ctx?.close() } catch (_) {}
  ctx = null
  master = null
  unlocked = false
  lastLoadTick = -1
}
