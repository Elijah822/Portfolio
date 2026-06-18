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
const ARP_FREQS = [196, 247, 294, 349, 392]
let arpStep = 0

const MEDIA_EVENTS = new Set(["pointerdown", "touchstart", "touchend", "keydown", "click"])
const SOFT_EVENTS = new Set(["pointermove", "mousemove", "scroll", "wheel", "touchmove"])

export function isAudioPrefOn() {
  try {
    return sessionStorage.getItem(AUDIO_PREF_KEY) === "1"
  } catch (_) {
    return false
  }
}

export function shouldAutoEnableOnGesture() {
  try {
    return sessionStorage.getItem(AUDIO_PREF_KEY) === null
  } catch (_) {
    return false
  }
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

function playArpNote() {
  if (!ambientOn || !unlocked || !ctx || !master) return
  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = "sine"
  osc.frequency.value = ARP_FREQS[arpStep % ARP_FREQS.length]
  arpStep += 1
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(0.05, t + 0.1)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6)
  osc.connect(g)
  g.connect(master)
  osc.start(t)
  osc.stop(t + 2.7)
}

function startWebAmbientArp() {
  if (arpTimer) return
  playArpNote()
  arpTimer = setInterval(playArpNote, 2600)
}

function stopWebAmbientArp() {
  if (arpTimer) clearInterval(arpTimer)
  arpTimer = null
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
  setAudioPref(true)
  ambientOn = true
  startWebAmbientArp()
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
  stopWebAmbientArp()
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

  const handle = event => {
    unlockAudio()
    const type = event?.type ?? ""
    const isMedia = MEDIA_EVENTS.has(type)
    const isSoft = SOFT_EVENTS.has(type)

    if (isAudioPrefOn() || autoEnabled) {
      if (!ambientOn) {
        ambientOn = true
        startWebAmbientArp()
      }
      if (isMedia) kickYouTubePlayback()
      else tryPlayAmbient()
      return
    }

    if (!shouldAutoEnableOnGesture() || (!isMedia && !isSoft)) return

    autoEnabled = true
    onEnable?.()
    if (isMedia) kickYouTubePlayback()
  }

  const opts = { passive: true, capture: true }
  const events = [...MEDIA_EVENTS, ...SOFT_EVENTS]
  events.forEach(evt => window.addEventListener(evt, handle, opts))

  return () => {
    events.forEach(evt => window.removeEventListener(evt, handle, opts))
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
