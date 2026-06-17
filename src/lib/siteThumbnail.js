export function siteScreenshot(url) {
  if (!url) return null
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false`
}

export function projectThumbnail(meta) {
  if (meta?.noThumbnail) return null
  if (meta?.siteThumbnail) return meta.siteThumbnail
  if (meta?.siteUrl) return siteScreenshot(meta.siteUrl)
  return null
}
