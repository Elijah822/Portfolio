const STORAGE_KEY = "portfolio-a11y"

export const TEXT_SIZE_LEVELS = [
  { id: 0, label: "Default", scale: 1 },
  { id: 1, label: "Large", scale: 1.125 },
  { id: 2, label: "Extra large", scale: 1.25 },
]

export const DEFAULT_A11Y = {
  textSize: 0,
  reduceMotion: false,
  highContrast: false,
  systemCursor: false,
}

function normalizeTextSize(value) {
  const id = Number(value)
  return TEXT_SIZE_LEVELS.some(l => l.id === id) ? id : 0
}

export function loadA11yPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_A11Y }
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_A11Y,
      ...parsed,
      textSize: normalizeTextSize(parsed.textSize),
    }
  } catch (_) {
    return { ...DEFAULT_A11Y }
  }
}

export function saveA11yPrefs(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch (_) {}
}

export function getTextScale(textSize) {
  const id = normalizeTextSize(textSize)
  return TEXT_SIZE_LEVELS.find(l => l.id === id)?.scale ?? 1
}

export function applyA11yPrefs(prefs) {
  const root = document.documentElement
  const textSize = normalizeTextSize(prefs.textSize)
  const scale = getTextScale(textSize)

  root.dataset.textSize = String(textSize)
  root.dataset.reduceMotion = prefs.reduceMotion ? "true" : "false"
  root.dataset.highContrast = prefs.highContrast ? "true" : "false"
  root.dataset.systemCursor = prefs.systemCursor ? "true" : "false"

  root.style.setProperty("--a11y-text-scale", String(scale))
  // Inline fallback for engines that lag on CSS zoom + custom properties
  root.style.zoom = scale === 1 ? "" : String(scale)
}
