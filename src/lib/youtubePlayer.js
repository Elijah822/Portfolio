import { MUSIC_YOUTUBE_ID } from "../data/projectMeta.js"

let wantPlay = false
const IFRAME_ID = "yt-ambient-player"
const PLAYING_MARKER = "autoplay=1"

function embedUrl({ autoplay = false, mute = false } = {}) {
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: mute ? "1" : "0",
    loop: "1",
    playlist: MUSIC_YOUTUBE_ID,
    controls: "0",
    disablekb: "1",
    fs: "0",
    modestbranding: "1",
    playsinline: "1",
    rel: "0",
  })
  return `https://www.youtube.com/embed/${MUSIC_YOUTUBE_ID}?${params.toString()}`
}

function ensureIframe() {
  let mount = document.getElementById("yt-ambient-mount")
  if (!mount) {
    mount = document.createElement("div")
    mount.id = "yt-ambient-mount"
    mount.setAttribute("aria-hidden", "true")
    mount.style.cssText = "position:fixed;left:-9999px;top:0;width:200px;height:200px;overflow:hidden;opacity:0;pointer-events:none"
    document.body.appendChild(mount)
  }

  let iframe = document.getElementById(IFRAME_ID)
  if (!iframe) {
    iframe = document.createElement("iframe")
    iframe.id = IFRAME_ID
    iframe.title = "Ambient audio"
    iframe.allow = "autoplay; encrypted-media"
    iframe.style.cssText = "width:200px;height:200px;border:0"
    mount.appendChild(iframe)
  }

  return iframe
}

export async function initAmbientPlayer() {
  return ensureIframe()
}

export function queueAmbientPlay() {
  wantPlay = true
  const iframe = ensureIframe()
  const url = embedUrl({ autoplay: true, mute: false })
  if (!iframe.src.includes(PLAYING_MARKER) || iframe.src.includes("mute=1")) {
    iframe.src = url
  }
  return true
}

export function isPlayerReady() {
  return Boolean(document.getElementById(IFRAME_ID))
}

export async function playAmbientTrack() {
  queueAmbientPlay()
}

export function pauseAmbientTrack() {
  wantPlay = false
  const iframe = document.getElementById(IFRAME_ID)
  if (iframe) iframe.src = "about:blank"
}

export function setAmbientTrackVolume() {}
