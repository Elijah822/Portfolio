import { MUSIC_YOUTUBE_ID } from "../data/projectMeta.js"

let player = null
let apiReady = false
let initStarted = false

function ensureApi() {
  return new Promise(resolve => {
    if (window.YT?.Player) {
      apiReady = true
      resolve()
      return
    }
    if (initStarted) {
      const wait = setInterval(() => {
        if (window.YT?.Player) {
          clearInterval(wait)
          apiReady = true
          resolve()
        }
      }, 50)
      return
    }
    initStarted = true
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      apiReady = true
      prev?.()
      resolve()
    }
    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    document.head.appendChild(tag)
  })
}

export async function initAmbientPlayer() {
  await ensureApi()
  if (player) return player
  let mount = document.getElementById("yt-ambient-mount")
  if (!mount) {
    mount = document.createElement("div")
    mount.id = "yt-ambient-mount"
    mount.style.cssText = "position:fixed;width:0;height:0;overflow:hidden;opacity:0;pointer-events:none"
    document.body.appendChild(mount)
  }
  return new Promise(resolve => {
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
          resolve(player)
        },
      },
    })
  })
}

export async function playAmbientTrack() {
  try {
    const p = player || (await initAmbientPlayer())
    p.playVideo?.()
  } catch (_) {}
}

export function pauseAmbientTrack() {
  try {
    player?.pauseVideo?.()
  } catch (_) {}
}

export function setAmbientTrackVolume(v) {
  try {
    player?.setVolume?.(Math.round(v * 100))
  } catch (_) {}
}
