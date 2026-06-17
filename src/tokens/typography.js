export const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"

export const FONT =
  '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

export function loadFonts() {
  if (document.getElementById("portfolio-fonts")) return
  const link = document.createElement("link")
  link.id = "portfolio-fonts"
  link.rel = "stylesheet"
  link.href = FONTS_URL
  document.head.appendChild(link)
}
