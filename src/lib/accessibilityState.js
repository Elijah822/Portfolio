const STORAGE_KEY = "portfolio-a11y"

export const TEXT_SIZE_LEVELS = [
  { id: 0, label: "Default", scale: 1 },
  { id: 1, label: "Large", scale: 1.12 },
  { id: 2, label: "Extra large", scale: 1.24 },
]

export const DEFAULT_A11Y = {
  textSize: 0,
  reduceMotion: false,
  highContrast: false,
  systemCursor: false,
}

export function loadA11yPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_A11Y }
    return { ...DEFAULT_A11Y, ...JSON.parse(raw) }
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
  return TEXT_SIZE_LEVELS.find(l => l.id === textSize)?.scale ?? 1
}

export function applyA11yPrefs(prefs) {
  const root = document.documentElement

  root.dataset.textSize = String(prefs.textSize)
  root.dataset.reduceMotion = prefs.reduceMotion ? "true" : "false"
  root.dataset.highContrast = prefs.highContrast ? "true" : "false"
  root.dataset.systemCursor = prefs.systemCursor ? "true" : "false"

  const scale = getTextScale(prefs.textSize)
  root.style.setProperty("--a11y-text-scale", String(scale))
}
