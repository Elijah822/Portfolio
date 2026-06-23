import { INDUSTRIES } from "./industries.js"

export const ALL_PROJECTS = INDUSTRIES.flatMap(g => g.projects)

export function getProjectById(id) {
  return ALL_PROJECTS.find(p => p.id === id) ?? null
}
