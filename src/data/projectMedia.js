import { cloudinaryVideoFrame, videoPoster } from "../lib/cloudinary.js"

const VIDEO = "https://res.cloudinary.com/dj8jyjcvo/video/upload"

const QUEUEPAY_VIDEO = `${VIDEO}/v1781689621/QueuePay_Final_1_1_dt8ysa.mp4`
const SIMPAT_VIDEO = `${VIDEO}/v1781667517/Simpat_Motion_d6lzaz.mp4`
const SVAR_VIDEO = `${VIDEO}/v1781689583/freecompress-Svar_Portfolio_FINAL_1_1_ri3rzv.mp4`
const RISKEASE_VIDEO = `${VIDEO}/v1781690565/RiskEase_1_cban6j.mp4`

// Gallery item shapes:
// { type: "image", src: "<public_id or full Cloudinary URL>", alt, caption?, featured? }
// { type: "videoFrame", src: "<video public path>", at: <seconds>, alt, caption?, featured? }

export const PROJECT_MEDIA = {
  "01": {
    hero: {
      type: "video",
      url: RISKEASE_VIDEO,
      label: "RiskEase: Compliance Platform",
      showOnProjectPage: false,
    },
  },
  "02": {
    hero: {
      type: "video",
      url: QUEUEPAY_VIDEO,
      label: "QueuePay: Self-Checkout",
    },
    gallery: [
      { type: "videoFrame", src: QUEUEPAY_VIDEO, at: 1, alt: "QueuePay mobile scan flow", caption: "Scan-and-pay customer flow", featured: true },
      { type: "videoFrame", src: QUEUEPAY_VIDEO, at: 5, alt: "QueuePay cart summary", caption: "Live cart total while shopping" },
      { type: "videoFrame", src: QUEUEPAY_VIDEO, at: 9, alt: "QueuePay payment options", caption: "Multiple payment methods at checkout" },
      { type: "videoFrame", src: QUEUEPAY_VIDEO, at: 14, alt: "QueuePay digital receipt", caption: "Digital receipt for exit verification" },
    ],
  },
  "03": {
    hero: {
      type: "video",
      url: SIMPAT_VIDEO,
      label: "SimPat: Medical Simulation",
    },
    gallery: [
      { type: "videoFrame", src: SIMPAT_VIDEO, at: 2, alt: "SimPat case discovery", caption: "Case library with difficulty indicators", featured: true },
      { type: "videoFrame", src: SIMPAT_VIDEO, at: 7, alt: "SimPat voice simulation", caption: "Voice-based OSCE-style consultation" },
      { type: "videoFrame", src: SIMPAT_VIDEO, at: 12, alt: "SimPat AI examiner feedback", caption: "Transcript and examiner feedback side by side" },
    ],
  },
  "04": {
    gallery: [
      // Add Cloudinary stills: { type: "image", src: "public_id", alt, caption }
    ],
  },
  "05": {
    gallery: [
      // Add Cloudinary stills when uploaded
    ],
  },
  "06": {
    gallery: [
      // Add Cloudinary stills when uploaded
    ],
  },
  "07": {
    hero: {
      type: "video",
      url: SVAR_VIDEO,
      label: "Svar.se: Expert Marketplace",
    },
    gallery: [
      { type: "videoFrame", src: SVAR_VIDEO, at: 2, alt: "Svar.se AI search", caption: "Natural-language expert search", featured: true },
      { type: "videoFrame", src: SVAR_VIDEO, at: 6, alt: "Svar.se expert profiles", caption: "Expert discovery and comparison" },
      { type: "videoFrame", src: SVAR_VIDEO, at: 11, alt: "Svar.se booking flow", caption: "Search to booked session in under two minutes" },
    ],
  },
}

export const SHOWREEL = Object.entries(PROJECT_MEDIA)
  .filter(([, m]) => m.hero)
  .map(([id, m]) => ({
    id,
    ...m.hero,
  }))

export function getProjectMedia(projectId) {
  return PROJECT_MEDIA[projectId] ?? null
}

export { videoPoster, cloudinaryVideoFrame }
