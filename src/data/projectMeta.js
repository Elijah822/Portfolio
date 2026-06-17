export const RESUME_URL =
  "https://res.cloudinary.com/dj8jyjcvo/raw/upload/v1781697585/Akinlolu_Elijah_General_Resume_fubgjr.docx"

export const MUSIC_YOUTUBE_ID = "q_BCyHd0vhA"
export const GAMES_TRAILER_ID = "q_BCyHd0vhA"

export const PROJECT_META = {
  "01": { region: "UK · Europe", flags: ["🇬🇧", "🇪🇺"], siteUrl: "https://www.toke.ai/" },
  "02": { region: "Global", flags: ["🌍"], siteUrl: null },
  "03": { region: "United Kingdom", flags: ["🇬🇧"], siteUrl: "https://simpat.ai/" },
  "04": { region: "United States", flags: ["🇺🇸"], siteUrl: "https://theautismhelper.com/" },
  "05": { region: "Global", flags: ["🌍"], siteUrl: null },
  "06": { region: "United States", flags: ["🇺🇸"], siteUrl: null },
  "07": { region: "Sweden", flags: ["🇸🇪"], siteUrl: "https://svar.se" },
  "08": { region: "Global", flags: ["🌍"], siteUrl: null },
}

export function getProjectMeta(id) {
  return PROJECT_META[id] ?? null
}
