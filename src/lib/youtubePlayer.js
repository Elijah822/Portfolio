import { MUSIC_YOUTUBE_ID } from "../data/projectMeta.js"

let player = null
let apiReadyPromise = null
let playerReadyPromise = null
let wantPlay = false

const IFRAME_ID = "yt-ambient-player"

function siteOrigin() {
  if (typeof window === "undefined") return ""
  return window.location.origin
}

function embedSrc(videoId) {
  const params = new URLSearchParams({
    autoplay: "0",
    loop: "1",
    playlist: videoId,
    controls: "0",
    disablekb: "1",
    fs: "0",
    modestbranding: "1",
    playsinline: "1",
    enablejsapi: "1",
    origin: siteOrigin(),
    widget_referrer: typeof window !== "undefined" ? window.location.href : siteOrigin(),
  })
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}

function ensureApi() {
  if (apiReadyPromise) return apiReadyPromise

  apiReadyPromise = new Promise(resolve => {
    if (window.YT?.Player) {
      resolve()
      return
    }

    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }

    const existing = document.querySelector('script[src*="youtube.com/iframe_api"]')
    if (!existing) {
      const tag = document.createElement("script")
      const origin = siteOrigin()
      tag.src = origin
        ? `https://www.youtube.com/iframe_api?origin=${encodeURIComponent(origin)}`
        : "https://www.youtube.com/iframe_api"
      document.head.appendChild(tag)
    } else if (!existing.src.includes("origin=") && siteOrigin()) {
      existing.src = `https://www.youtube.com/iframe_api?origin=${encodeURIComponent(siteOrigin())}`
    }
  })

  return apiReadyPromise
}

function ensureIframe() {
  let mount = document.getElementById("yt-ambient-mount")
  if (!mount) {
    mount = document.createElement("div")
    mount.id = "yt-ambient-mount"
    mount.style.cssText = "position:fixed;width:0;height:0;overflow:hidden;opacity:0;pointer-events:none"
    document.body.appendChild(mount)
  }

  let iframe = document.getElementById(IFRAME_ID)
  if (!iframe) {
    iframe = document.createElement("iframe")
    iframe.id = IFRAME_ID
    iframe.title = "Ambient audio"
    iframe.allow = "autoplay; encrypted-media"
    iframe.style.cssText = "width:0;height:0;border:0"
    iframe.src = embedSrc(MUSIC_YOUTUBE_ID)
    mount.appendChild(iframe)
  }

  return iframe
}

function tryPlay() {
  if (!player?.playVideo) return false
  try {
    player.unMute?.()
    player.playVideo()
    return true
  } catch (_) {
    return false
  }
}

export function queueAmbientPlay() {
  wantPlay = true
  return tryPlay()
}

export function isPlayerReady() {
  return Boolean(player?.playVideo)
}

export async function initAmbientPlayer() {
  await ensureApi()
  if (player) return player
  if (playerReadyPromise) return playerReadyPromise

  playerReadyPromise = new Promise(resolve => {
    ensureIframe()

    player = new window.YT.Player(IFRAME_ID, {
      events: {
        onReady: e => {
          try { e.target.unMute() } catch (_) {}
          e.target.setVolume(22)
          if (wantPlay) tryPlay()
          resolve(player)
        },
        onStateChange: e => {
          if (wantPlay && e.data === window.YT.PlayerState.PAUSED) tryPlay()
        },
        onError: () => {
          resolve(player)
        },
      },
    })
  })

  return playerReadyPromise
}

export async function playAmbientTrack() {
  queueAmbientPlay()
  if (!player) await initAmbientPlayer()
  else tryPlay()
}

export function pauseAmbientTrack() {
  wantPlay = false
  try {
    player?.pauseVideo?.()
    player?.mute?.()
  } catch (_) {}
}

export function setAmbientTrackVolume(v) {
  try {
    player?.setVolume?.(Math.round(v * 100))
  } catch (_) {}
}
