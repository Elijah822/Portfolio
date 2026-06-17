import { MUSIC_YOUTUBE_ID } from "../data/projectMeta.js"

let player = null
let apiReady = false
let initStarted = false
let apiReadyPromise = null
let playerReadyPromise = null
let wantPlay = false

function ensureApi() {
  if (apiReadyPromise) return apiReadyPromise

  apiReadyPromise = new Promise(resolve => {
    if (window.YT?.Player) {
      apiReady = true
      resolve()
      return
    }

    initStarted = true
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      apiReady = true
      prev?.()
      resolve()
    }

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      document.head.appendChild(tag)
    }
  })

  return apiReadyPromise
}

function tryPlay() {
  if (!player?.playVideo) return false
  try {
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
    let mount = document.getElementById("yt-ambient-mount")
    if (!mount) {
      mount = document.createElement("div")
      mount.id = "yt-ambient-mount"
      mount.style.cssText = "position:fixed;width:0;height:0;overflow:hidden;opacity:0;pointer-events:none"
      document.body.appendChild(mount)
    }

    player = new window.YT.Player(mount, {
      height: "0",
      width: "0",
      videoId: MUSIC_YOUTUBE_ID,
      playerVars: {
        autoplay: 0,
        loop: 1,
        playlist: MUSIC_YOUTUBE_ID,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
      },
      events: {
        onReady: e => {
          e.target.setVolume(22)
          if (wantPlay) tryPlay()
          resolve(player)
        },
        onStateChange: e => {
          if (wantPlay && e.data === window.YT.PlayerState.PAUSED) tryPlay()
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
  } catch (_) {}
}

export function setAmbientTrackVolume(v) {
  try {
    player?.setVolume?.(Math.round(v * 100))
  } catch (_) {}
}
