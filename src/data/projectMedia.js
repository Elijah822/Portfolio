const CLOUD = "https://res.cloudinary.com/dj8jyjcvo/video/upload"

export const PROJECT_MEDIA = {
  "01": {
    hero: {
      type: "video",
      url: `${CLOUD}/v1781690565/RiskEase_1_cban6j.mp4`,
      label: "RiskEase — Compliance Platform",
      showOnProjectPage: false,
    },
  },
  "02": {
    hero: {
      type: "video",
      url: `${CLOUD}/v1781689621/QueuePay_Final_1_1_dt8ysa.mp4`,
      label: "QueuePay — Self-Checkout",
    },
  },
  "03": {
    hero: {
      type: "video",
      url: `${CLOUD}/v1781667517/Simpat_Motion_d6lzaz.mp4`,
      label: "SimPat — Medical Simulation",
    },
  },
  "07": {
    hero: {
      type: "video",
      url: `${CLOUD}/v1781689583/freecompress-Svar_Portfolio_FINAL_1_1_ri3rzv.mp4`,
      label: "Svar.se — Expert Marketplace",
    },
  },
}

export const SHOWREEL = Object.entries(PROJECT_MEDIA).map(([id, m]) => ({
  id,
  ...m.hero,
}))

export function getProjectMedia(projectId) {
  return PROJECT_MEDIA[projectId] ?? null
}

export function videoPoster(url) {
  return url.replace("/upload/", "/upload/so_0,f_jpg,w_1200,q_auto/")
}
