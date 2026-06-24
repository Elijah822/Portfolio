const CLOUD = "dj8jyjcvo"
const IMAGE_BASE = `https://res.cloudinary.com/${CLOUD}/image/upload`
const VIDEO_BASE = `https://res.cloudinary.com/${CLOUD}/video/upload`

/** Optimized still image from a Cloudinary public ID or full delivery URL. */
export function cloudinaryImage(src, { width = 1400, quality = "auto", format = "auto" } = {}) {
  const publicId = toPublicId(src, "image")
  return `${IMAGE_BASE}/f_${format},q_${quality},w_${width}/${publicId}`
}

/** Extract a JPG frame from a Cloudinary-hosted video at `seconds`. */
export function cloudinaryVideoFrame(src, seconds = 0, { width = 1400, quality = "auto" } = {}) {
  const publicId = toPublicId(src, "video")
  return `${VIDEO_BASE}/so_${seconds},f_jpg,w_${width},q_${quality}/${publicId}`
}

export function videoPoster(url, width = 1200) {
  return cloudinaryVideoFrame(url, 0, { width })
}

function toPublicId(src, type) {
  if (!src) return src
  if (!src.startsWith("http")) return src.replace(/\.(mp4|jpg|jpeg|png|webp)$/i, "")

  const marker = `/${type}/upload/`
  const i = src.indexOf(marker)
  if (i === -1) return src
  let path = src.slice(i + marker.length)
  // strip leading transforms segment if present
  if (!path.startsWith("v") && path.includes("/v")) {
    path = path.slice(path.indexOf("/v") + 1)
  }
  return path.replace(/\.(mp4|jpg|jpeg|png|webp)$/i, "")
}
