let ctx = null
let master = null
let unlocked = false
let ambientNodes = []
let arpTimer = null
let lastLoadTick = -1
let ambientOn = false
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
  for (let p = 0; p <= pendingLoadPct; p += 4) playLoadTick(p)
  if (pendingLoadPct % 4 !== 0) playLoadTick(pendingLoadPct)
}

export function playLoadTick(pct) {
  if (!unlocked || !ctx || !master) return
  const step = Math.floor(pct / 4)
  if (step <= lastLoadTick) return
  lastLoadTick = step

  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = "sine"
  osc.frequency.setValueAtTime(180 + pct * 5.5, t)
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(0.035, t + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1)
  osc.connect(g)
  g.connect(master)
  osc.start(t)
  osc.stop(t + 0.11)

  if (pct >= 100) {
    const o2 = ctx.createOscillator()
    const g2 = ctx.createGain()
    o2.type = "triangle"
    o2.frequency.setValueAtTime(520, t + 0.05)
    o2.frequency.exponentialRampToValueAtTime(880, t + 0.35)
    g2.gain.setValueAtTime(0, t + 0.05)
    g2.gain.linearRampToValueAtTime(0.05, t + 0.1)
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.45)
    o2.connect(g2)
    g2.connect(master)
    o2.start(t + 0.05)
    o2.stop(t + 0.46)
  }
}

export function startAmbientMusic() {
  if (ambientOn || !ctx || !master) return
  ambientOn = true

  const rev = makeReverb(ctx)
  const revG = ctx.createGain()
  revG.gain.value = 0.35
  rev.connect(revG)
  revG.connect(master)

  const PAD = [
    [55, 0.09, "sine"],
    [82.4, 0.07, "sine"],
    [110, 0.05, "triangle"],
    [164.8, 0.04, "sine"],
    [220, 0.025, "triangle"],
  ]
  const oscs = PAD.map(([f, g, type]) => {
    const o = ctx.createOscillator()
    o.type = type
    o.frequency.value = f + (Math.random() - 0.5) * 0.3
    const og = ctx.createGain()
    og.gain.value = g
    o.connect(og)
    og.connect(master)
    og.connect(rev)
    o.start()
    return o
  })

  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.05
  lfo.type = "sine"
  const lfoG = ctx.createGain()
  lfoG.gain.value = 0.008
  lfo.connect(lfoG)
  lfoG.connect(master.gain)
  lfo.start()

  const scale = [261.6, 329.6, 392, 523.3, 392, 329.6]
  let note = 0
  arpTimer = setInterval(() => {
    if (!ctx || !master) return
    const t = ctx.currentTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = "sine"
    o.frequency.value = scale[note % scale.length]
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.018, t + 0.05)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.8)
    o.connect(g)
    g.connect(rev)
    o.start(t)
    o.stop(t + 2.9)
    note++
  }, 2400)

  ambientNodes = [...oscs, lfo]
}

export function stopAmbientMusic() {
  if (arpTimer) clearInterval(arpTimer)
  arpTimer = null
  ambientNodes.forEach(n => { try { n.stop?.() } catch (_) {} })
  ambientNodes = []
  ambientOn = false
}

export function setAmbientVolume(v) {
  if (master) master.gain.linearRampToValueAtTime(v, ctx.currentTime + 0.4)
}

export function unlockAudio() {
  if (unlocked) return false
  const audioCtx = getCtx()
  if (!audioCtx) return false
  if (audioCtx.state === "suspended") audioCtx.resume()
  master = audioCtx.createGain()
  master.gain.value = 0.09
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
    window.removeEventListener("mousemove", handler)
    window.removeEventListener("touchstart", handler)
  }
  window.addEventListener("mousemove", handler, { passive: true })
  window.addEventListener("touchstart", handler, { passive: true })
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
