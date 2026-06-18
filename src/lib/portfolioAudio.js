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
let arpTimer = null
let lastLoadTick = -1
let pendingLoadPct = 0
const unlockListeners = new Set()
const AUDIO_PREF_KEY = "portfolio-audio-on"

const ACTIVATION_EVENTS = ["pointerdown", "touchstart", "touchend", "keydown", "click"]
const SOFT_EVENTS = ["pointermove", "mousemove", "scroll", "wheel", "touchmove"]
const CTA_SELECTOR = 'a, button, input, select, textarea, label, [data-h], [role="button"], [role="link"]'

let syntheticClickUsed = false

function isCtaElement(el) {
  if (!el || el === document.documentElement) return false
  return Boolean(el.closest(CTA_SELECTOR))
}

function trySyntheticEmptyAreaClick(e) {
  if (syntheticClickUsed) return false

  const x = typeof e?.clientX === "number" ? e.clientX : window.innerWidth / 2
  const y = typeof e?.clientY === "number" ? e.clientY : window.innerHeight / 2
  const target = document.elementFromPoint(x, y)
  if (!target || isCtaElement(target)) return false

  syntheticClickUsed = true
  const opts = {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
    view: window,
    button: 0,
  }
  target.dispatchEvent(new MouseEvent("mousedown", { ...opts, buttons: 1 }))
  target.dispatchEvent(new MouseEvent("mouseup", { ...opts, buttons: 0 }))
  target.dispatchEvent(new MouseEvent("click", opts))
  return true
}

function activateAmbient(onEnable) {
  unlockAudio()
  onEnable?.()
  startAmbientMusic()
}

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

export function shouldAutoEnableOnGesture() {
  return !isExplicitlyMuted() && sessionStorage.getItem(AUDIO_PREF_KEY) === null
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

function kickYouTubePlayback() {
  if (!queueAmbientPlay()) {
    void initAmbientPlayer().then(() => queueAmbientPlay()).catch(() => {})
  }
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
  setAudioPref(true)
  ambientOn = true
  kickYouTubePlayback()
}

function tryPlayAmbient() {
  if (!isAudioPrefOn()) return
  queueAmbientPlay()
}

export function requestAmbientPlay() {
  tryPlayAmbient()
}

export function stopAmbientMusic() {
  setAudioPref(false)
  pauseAmbientTrack()
  if (arpTimer) clearInterval(arpTimer)
  arpTimer = null
  ambientOn = false
}

export function setAmbientVolume(v) {
  setAmbientTrackVolume(v)
  if (master && ctx) master.gain.linearRampToValueAtTime(v * 0.3, ctx.currentTime + 0.4)
}

export function unlockAudio() {
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
    if (pendingLoadPct > 0) replayPendingLoadTicks()
    notifyUnlock()
  }

  if (isAudioPrefOn()) kickYouTubePlayback()
  return !wasUnlocked
}

export function setupAudioOnMouseMove(onEnable) {
  let autoEnabled = false

  const enableAmbient = e => {
    if (isExplicitlyMuted()) return

    if (isAudioPrefOn()) {
      kickYouTubePlayback()
      return
    }

    if (!autoEnabled && shouldAutoEnableOnGesture()) {
      const clicked = trySyntheticEmptyAreaClick(e)
      if (!clicked && isCtaElement(document.elementFromPoint(
        typeof e?.clientX === "number" ? e.clientX : window.innerWidth / 2,
        typeof e?.clientY === "number" ? e.clientY : window.innerHeight / 2,
      ))) return

      autoEnabled = true
      activateAmbient(onEnable)
    }
  }

  const activate = () => {
    if (isExplicitlyMuted()) return
    if (isAudioPrefOn()) {
      unlockAudio()
      kickYouTubePlayback()
      return
    }
    if (!autoEnabled && shouldAutoEnableOnGesture()) {
      autoEnabled = true
      activateAmbient(onEnable)
    }
  }

  const opts = { passive: true, capture: true }
  SOFT_EVENTS.forEach(evt => window.addEventListener(evt, enableAmbient, opts))
  ACTIVATION_EVENTS.forEach(evt => window.addEventListener(evt, activate, opts))

  return () => {
    SOFT_EVENTS.forEach(evt => window.removeEventListener(evt, enableAmbient, opts))
    ACTIVATION_EVENTS.forEach(evt => window.removeEventListener(evt, activate, opts))
  }
}

export function teardownAudio() {
  stopAmbientMusic()
  try { ctx?.close() } catch (_) {}
  ctx = null
  master = null
  unlocked = false
  lastLoadTick = -1
  syntheticClickUsed = false
}
