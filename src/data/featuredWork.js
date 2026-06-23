import { ALL_PROJECTS } from "./projects.js"
import { SHOWREEL } from "./projectMedia.js"

const FEATURED_IDS = ["01", "02", "03", "07"]

export const FEATURED_WORK = FEATURED_IDS.map(id => {
  const project = ALL_PROJECTS.find(p => p.id === id)
  const reel = SHOWREEL.find(s => s.id === id)
  return project ? { ...project, videoUrl: reel?.url ?? null, videoLabel: reel?.label ?? null } : null
}).filter(Boolean)
