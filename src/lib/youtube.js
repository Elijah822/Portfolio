export function ytThumbnail(videoId, quality = "maxresdefault") {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
}

export function ytEmbedUrl(videoId, { autoplay = false, mute = true, loop = true } = {}) {
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: mute ? "1" : "0",
    loop: loop ? "1" : "0",
    playlist: loop ? videoId : "",
    controls: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  })
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`
}
