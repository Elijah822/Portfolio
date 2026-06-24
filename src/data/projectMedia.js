import { cloudinaryVideoFrame, videoPoster } from "../lib/cloudinary.js"

const VIDEO = "https://res.cloudinary.com/dj8jyjcvo/video/upload"

const QUEUEPAY_VIDEO = `${VIDEO}/v1781689621/QueuePay_Final_1_1_dt8ysa.mp4`
const SIMPAT_VIDEO = `${VIDEO}/v1781667517/Simpat_Motion_d6lzaz.mp4`
const SVAR_VIDEO = `${VIDEO}/v1781689583/freecompress-Svar_Portfolio_FINAL_1_1_ri3rzv.mp4`
const RISKEASE_VIDEO = `${VIDEO}/v1781690565/RiskEase_1_cban6j.mp4`

// Gallery item shapes:
// { type: "image", src: "<public_id>", alt, caption?, featured? }

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
  },
  "03": {
    hero: {
      type: "video",
      url: SIMPAT_VIDEO,
      label: "SimPat: Medical Simulation",
    },
  },
  "05": {
    gallery: [
      { type: "image", src: "Dreamtter_1_aqsvj8", alt: "Dreamtter onboarding", caption: "Welcome flow — personalize your dream world", featured: true },
      { type: "image", src: "Dreamtter_o6y3om", alt: "Dreamtter mentorship", caption: "Choose guardians and mentors for your journey" },
      { type: "image", src: "Dec_1_g8gysn", alt: "Dream pledge ritual", caption: "Sign your dream into existence with a personal pledge" },
      { type: "image", src: "Dec_2_iltr7j", alt: "Habit progress tracking", caption: "Streaks, reminders, and progress toward long-term goals" },
      { type: "image", src: "Dec_3_cr0ttn", alt: "AI Sensei conversation", caption: "AI-guided coaching for career growth and life balance" },
    ],
  },
  "06": {
    gallery: [
      { type: "image", src: "Jan_1_sd3jvd", alt: "Job application tracker", caption: "Visual pipeline from saved to offer with AI keyword analysis", featured: true },
      { type: "image", src: "Jan_3_psgjc2", alt: "Profile management", caption: "Account hub for resume tools, goals, and document management" },
    ],
  },
  "07": {
    hero: {
      type: "video",
      url: SVAR_VIDEO,
      label: "Svar.se: Expert Marketplace",
    },
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
