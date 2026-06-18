import { isAmbientAudible, pauseAmbientSoft, playAmbientTrack } from "./ambientPlayer.js"
import { isAudioPrefOn, isExplicitlyMuted } from "./portfolioAudio.js"

const activeHeroVideos = new Set()
let wasPlayingBeforeDuck = false

function isHeroVideo(el) {
  return el instanceof HTMLVideoElement && el.hasAttribute("data-hero-video")
}

function shouldDuck(video) {
  return !video.paused && !video.muted
}

function enterDuck() {
  wasPlayingBeforeDuck = isAmbientAudible()
  if (wasPlayingBeforeDuck) pauseAmbientSoft()
}

function exitDuck() {
  if (!wasPlayingBeforeDuck) return
  wasPlayingBeforeDuck = false
  if (isExplicitlyMuted() || !isAudioPrefOn()) return
  void playAmbientTrack()
}

function syncVideo(video) {
  if (!isHeroVideo(video)) return

  if (shouldDuck(video)) {
    if (!activeHeroVideos.has(video)) {
      activeHeroVideos.add(video)
      if (activeHeroVideos.size === 1) enterDuck()
    }
    return
  }

  if (activeHeroVideos.has(video)) {
    activeHeroVideos.delete(video)
    if (activeHeroVideos.size === 0) exitDuck()
  }
}

function onVideoEvent(e) {
  const video = e.target
  if (!isHeroVideo(video)) return
  syncVideo(video)
}

export function setupHeroVideoAmbientSync() {
  const opts = { capture: true }
  const events = ["play", "pause", "ended", "volumechange"]

  events.forEach(evt => document.addEventListener(evt, onVideoEvent, opts))

  return () => {
    events.forEach(evt => document.removeEventListener(evt, onVideoEvent, opts))
    activeHeroVideos.clear()
    wasPlayingBeforeDuck = false
  }
}
