import { ALL_PROJECTS } from "./projects.js"
import { SHOWREEL } from "./projectMedia.js"
import { getProjectMeta } from "./projectMeta.js"

const FEATURED_IDS = ["01", "02", "03", "07"]

export const FEATURED_WORK = FEATURED_IDS.map(id => {
  const project = ALL_PROJECTS.find(p => p.id === id)
  const meta = getProjectMeta(id)
  const reel = SHOWREEL.find(s => s.id === id)
  const hasVideo = reel?.url && !meta?.noThumbnail
  return project
    ? {
        ...project,
        videoUrl: hasVideo ? reel.url : null,
        videoLabel: hasVideo ? reel.label : null,
      }
    : null
}).filter(Boolean)
