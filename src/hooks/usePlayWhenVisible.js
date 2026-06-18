import { useEffect } from "react"

export function usePlayWhenVisible(videoRef, enabled = true) {
  useEffect(() => {
    const video = videoRef.current
    if (!video || !enabled) return

    let visible = false

    const syncPlayback = () => {
      if (document.hidden || !visible) {
        video.pause()
        return
      }
      void video.play().catch(() => {})
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.15
        syncPlayback()
      },
      { threshold: [0, 0.15, 0.35] }
    )

    const onVisibility = () => syncPlayback()

    obs.observe(video)
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      obs.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      video.pause()
    }
  }, [videoRef, enabled])
}
