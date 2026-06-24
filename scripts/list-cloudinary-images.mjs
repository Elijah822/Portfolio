#!/usr/bin/env node
/**
 * List recent Cloudinary images to map into projectMedia.js galleries.
 *
 * Usage:
 *   CLOUDINARY_URL=cloudinary://<key>:<secret>@dj8jyjcvo node scripts/list-cloudinary-images.mjs
 *
 * Copy delivery URLs from output into PROJECT_MEDIA[id].gallery as:
 *   { type: "image", src: "<url or public_id>", alt: "...", caption: "..." }
 */

import { readFileSync, existsSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

function loadEnv(path) {
  if (!existsSync(path)) return {}
  const env = {}
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim()
    if (!t || t.startsWith("#") || !t.includes("=")) continue
    const [k, ...rest] = t.split("=")
    env[k.trim()] = rest.join("=").trim().replace(/^['"]|['"]$/g, "")
  }
  return env
}

const env = { ...loadEnv(resolve(root, ".env")), ...loadEnv(resolve(root, ".env.local")), ...process.env }
let { CLOUDINARY_URL, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME = "dj8jyjcvo" } = env

if (CLOUDINARY_URL?.startsWith("cloudinary://")) {
  const rest = CLOUDINARY_URL.slice("cloudinary://".length)
  const [creds, cloud] = rest.split("@")
  ;[CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET] = creds.split(":")
  CLOUDINARY_CLOUD_NAME = cloud
}

if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error("Missing CLOUDINARY_URL or CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET in .env")
  process.exit(1)
}

const auth = Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString("base64")
const res = await fetch(
  `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/image?max_results=100&direction=desc`,
  { headers: { Authorization: `Basic ${auth}` } },
)

if (!res.ok) {
  console.error("Cloudinary API error:", res.status, await res.text())
  process.exit(1)
}

const { resources = [] } = await res.json()
const base = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_1400`

for (const r of resources) {
  console.log(`${r.created_at}\t${r.width}x${r.height}\t${base}/${r.public_id}\t${r.public_id}`)
}
