export const RESUME_URL =
  "https://res.cloudinary.com/dj8jyjcvo/raw/upload/v1781697585/Akinlolu_Elijah_General_Resume_fubgjr.docx"

export const MUSIC_YOUTUBE_ID = "q_BCyHd0vhA"

export const PROJECT_META = {
  "01": {
    region: "UK · Europe",
    flags: ["🇬🇧", "🇪🇺"],
    siteUrl: "https://www.toke.ai/",
    noThumbnail: true,
  },
  "02": { region: "Global", flags: ["🌍"], siteUrl: null },
  "03": {
    region: "United Kingdom",
    flags: ["🇬🇧"],
    siteUrl: "https://simpat.ai/",
    siteThumbnail: "https://iad.microlink.io/qyTIrC0ZcDR6JjUASHO9U9w-y3jf1NLeru2nLB81nE7pTVNdFXWzZIVqIoJvOGEbLwl08_AFG18KK_PvyqQAMw.png",
  },
  "04": {
    region: "United States",
    flags: ["🇺🇸"],
    siteUrl: "https://theautismhelper.com/",
    siteThumbnail: "https://iad.microlink.io/Z8UqgK4UHRDBFhv1vCgyri423AzDlHz_DmdIAsF53fuGlopzDhE9sY6rH10_tyfUY3IrbEGnObuG1iQsQXxtvw.png",
  },
  "05": { region: "Romania", flags: ["🇷🇴"], siteUrl: null },
  "06": { region: "United States", flags: ["🇺🇸"], siteUrl: null },
  "07": {
    region: "Sweden",
    flags: ["🇸🇪"],
    siteUrl: "https://svar.se",
    siteThumbnail: "https://iad.microlink.io/VBOkWE9YEFjqohmMnmV--CM-PDY7fECsREZZcw05UXpml1FoLw996IoEb2oSL-4yjzqBzxRxo0AlsBjRHJVOJA.png",
  },
  "08": { region: "Global", flags: ["🌍"], siteUrl: null },
}

export function getProjectMeta(id) {
  return PROJECT_META[id] ?? null
}
