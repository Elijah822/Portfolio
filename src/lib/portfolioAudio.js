let ctx = null
let master = null
let unlocked = false
let ambientOn = false
let arpTimer = null
let lastLoadTick = -1
let pendingLoadPct = 0

function getCtx() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return null
  if (!ctx || ctx.state === "closed") ctx = new AudioCtx()
  return ctx
}

function makeReverb(audioCtx) {
  const len = audioCtx.sampleRate * 2.5
  const buf = audioCtx.createBuffer(2, len, audioCtx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4)
  }
  const conv = audioCtx.createConvolver()
  conv.buffer = buf
  return conv
}

export function isAudioUnlocked() {
  return unlocked
}

export function setPendingLoadPct(pct) {
  pendingLoadPct = pct
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
  import("./youtubePlayer.js").then(({ playAmbientTrack }) => playAmbientTrack())
}

export function stopAmbientMusic() {
  import("./youtubePlayer.js").then(({ pauseAmbientTrack }) => pauseAmbientTrack())
  if (arpTimer) clearInterval(arpTimer)
  arpTimer = null
  ambientOn = false
}

export function setAmbientVolume(v) {
  import("./youtubePlayer.js").then(({ setAmbientTrackVolume }) => setAmbientTrackVolume(v))
  if (master) master.gain.linearRampToValueAtTime(v * 0.3, ctx.currentTime + 0.4)
}

export function unlockAudio() {
  if (unlocked) return false
  const audioCtx = getCtx()
  if (!audioCtx) return false
  if (audioCtx.state === "suspended") audioCtx.resume()
  master = audioCtx.createGain()
  master.gain.value = 0.15
  master.connect(audioCtx.destination)
  unlocked = true
  replayPendingLoadTicks()
  startAmbientMusic()
  return true
}

export function setupAudioOnMouseMove(onUnlock) {
  const handler = () => {
    const fresh = unlockAudio()
    if (fresh) onUnlock?.()
  }
  window.addEventListener("mousemove", handler, { passive: true, once: true })
  window.addEventListener("touchstart", handler, { passive: true, once: true })
  return () => {
    window.removeEventListener("mousemove", handler)
    window.removeEventListener("touchstart", handler)
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
