import { MUSIC_YOUTUBE_ID } from "../data/projectMeta.js"

let player = null
let apiReadyPromise = null
let playerReadyPromise = null
let wantPlay = false

function siteOrigin() {
  if (typeof window === "undefined") return ""
  return window.location.origin
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

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement("script")
      const origin = siteOrigin()
      tag.src = origin
        ? `https://www.youtube.com/iframe_api?origin=${encodeURIComponent(origin)}`
        : "https://www.youtube.com/iframe_api"
      document.head.appendChild(tag)
    }
  })

  return apiReadyPromise
}

function tryPlaySync() {
  if (!player?.playVideo) return false
  try {
    const YT = window.YT
    const state = player.getPlayerState?.()
    if (state !== YT?.PlayerState?.PLAYING) player.playVideo()
    player.unMute?.()
    player.setVolume?.(22)
    return true
  } catch (_) {
    return false
  }
}

export function queueAmbientPlay() {
  wantPlay = true
  return tryPlaySync()
}

export function isPlayerReady() {
  return Boolean(player?.playVideo)
}

export async function initAmbientPlayer() {
  await ensureApi()
  if (player) return player
  if (playerReadyPromise) return playerReadyPromise

  playerReadyPromise = new Promise(resolve => {
    let mount = document.getElementById("yt-ambient-mount")
    if (!mount) {
      mount = document.createElement("div")
      mount.id = "yt-ambient-mount"
      mount.style.cssText = "position:fixed;left:-9999px;width:200px;height:200px;overflow:hidden;opacity:0;pointer-events:none"
      document.body.appendChild(mount)
    }

    player = new window.YT.Player(mount, {
      height: "200",
      width: "200",
      videoId: MUSIC_YOUTUBE_ID,
      playerVars: {
        autoplay: 1,
        mute: 1,
        loop: 1,
        playlist: MUSIC_YOUTUBE_ID,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        playsinline: 1,
        enablejsapi: 1,
        origin: siteOrigin(),
        widget_referrer: typeof window !== "undefined" ? window.location.href : siteOrigin(),
      },
      events: {
        onReady: e => {
          try {
            e.target.mute()
            e.target.setVolume(22)
            const YT = window.YT
            if (e.target.getPlayerState?.() !== YT?.PlayerState?.PLAYING) e.target.playVideo()
          } catch (_) {}
          if (wantPlay) tryPlaySync()
          resolve(player)
        },
        onStateChange: e => {
          if (!wantPlay) return
          const YT = window.YT
          if (e.data === YT?.PlayerState?.PAUSED) tryPlaySync()
        },
      },
    })
  })

  return playerReadyPromise
}

export async function playAmbientTrack() {
  queueAmbientPlay()
  if (!isPlayerReady()) await initAmbientPlayer()
  else tryPlaySync()
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
