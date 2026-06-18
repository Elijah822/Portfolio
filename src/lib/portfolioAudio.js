import {
  initAmbientPlayer,
  isAmbientAudible,
  isAmbientPlaying,
  pauseAmbientTrack,
  playAmbientTrack,
  setAmbientTrackVolume,
} from "./ambientPlayer.js"

let ctx = null
let master = null
let unlocked = false
let lastLoadTick = -1
let pendingLoadPct = 0
const unlockListeners = new Set()
const AUDIO_PREF_KEY = "portfolio-audio-on"
const SOUND_TOGGLE = "[data-sound-toggle]"
const SOUND_NUDGE = "[data-sound-nudge]"
const SOUND_NUDGE_CLOSE = "[data-sound-nudge-close]"

const ACTIVATION_EVENTS = ["pointerdown", "touchstart", "click"]
const SOFT_EVENTS = ["pointermove", "mousemove", "scroll", "wheel", "touchmove"]

export function isAudioPrefOn() {
  try {
    return sessionStorage.getItem(AUDIO_PREF_KEY) === "1"
  } catch (_) {
    return false
  }
}

export function isExplicitlyMuted() {
  try {
    return sessionStorage.getItem(AUDIO_PREF_KEY) === "0"
  } catch (_) {
    return false
  }
}

function setAudioPref(on) {
  try {
    sessionStorage.setItem(AUDIO_PREF_KEY, on ? "1" : "0")
  } catch (_) {}
}

function clearAudioPref() {
  try {
    sessionStorage.removeItem(AUDIO_PREF_KEY)
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
  if (isAmbientAudible()) {
    setAudioPref(true)
    return Promise.resolve(true)
  }

  return playAmbientTrack().then(ok => {
    if (ok) setAudioPref(true)
    return ok
  })
}

export function stopAmbientMusic() {
  setAudioPref(false)
  pauseAmbientTrack()
}

export function setAmbientVolume(v) {
  setAmbientTrackVolume(v)
  if (master && ctx) master.gain.linearRampToValueAtTime(v * 0.3, ctx.currentTime + 0.4)
}

export function unlockAudio() {
  if (unlocked) return false
  const audioCtx = getCtx()
  if (!audioCtx) return false
  if (audioCtx.state === "suspended") void audioCtx.resume()
  master = audioCtx.createGain()
  master.gain.value = 0.22
  master.connect(audioCtx.destination)
  unlocked = true
  if (pendingLoadPct > 0) replayPendingLoadTicks()
  notifyUnlock()
  return true
}

function isIgnoredActivationTarget(target) {
  return Boolean(target?.closest?.(`${SOUND_TOGGLE}, ${SOUND_NUDGE_CLOSE}`))
}

export function setupAudioOnMouseMove(onEnable) {
  let autoEnabled = false

  const markEnabled = () => {
    if (autoEnabled) return
    autoEnabled = true
    onEnable?.()
  }

  const tryPlay = () => {
    if (isExplicitlyMuted()) return Promise.resolve(false)
    unlockAudio()
    if (isAmbientAudible()) {
      markEnabled()
      return Promise.resolve(true)
    }
    return startAmbientMusic().then(ok => {
      if (ok) markEnabled()
      return ok
    })
  }

  const softHandler = () => {
    if (isExplicitlyMuted() || autoEnabled) return
    void tryPlay()
  }

  const activateHandler = e => {
    if (isExplicitlyMuted() || isIgnoredActivationTarget(e.target)) return
    void tryPlay()
  }

  const opts = { passive: true, capture: true }
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches
  if (finePointer) {
    SOFT_EVENTS.forEach(evt => window.addEventListener(evt, softHandler, opts))
  }
  ACTIVATION_EVENTS.forEach(evt => window.addEventListener(evt, activateHandler, opts))

  return () => {
    if (finePointer) {
      SOFT_EVENTS.forEach(evt => window.removeEventListener(evt, softHandler, opts))
    }
    ACTIVATION_EVENTS.forEach(evt => window.removeEventListener(evt, activateHandler, opts))
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

export { initAmbientPlayer, clearAudioPref }
