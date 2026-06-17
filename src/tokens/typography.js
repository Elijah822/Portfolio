export const FONT_HEADING =
  '"Bricolage Grotesque Variable", "Bricolage Grotesque", system-ui, sans-serif'

export const FONT_BODY = '"Graphie", system-ui, sans-serif'

/** @deprecated Use FONT_BODY or FONT_HEADING */
export const FONT = FONT_BODY

export function loadFonts() {
  // Bricolage is bundled via @fontsource in main.jsx
  // Graphie is self-hosted via src/styles/fonts.css
}
