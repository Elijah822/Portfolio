const STORAGE_KEY = "portfolio-intro-loader-done"

let completed = false

export function hasIntroLoaderCompleted() {
  if (completed) return true
  try {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      completed = true
      return true
    }
  } catch (_) {}
  return false
}

export function markIntroLoaderCompleted() {
  completed = true
  try {
    sessionStorage.setItem(STORAGE_KEY, "1")
  } catch (_) {}
}
