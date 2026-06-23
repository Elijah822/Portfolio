import { useLocation, useParams } from "react-router-dom"
import { SpeedInsights, computeRoute } from "@vercel/speed-insights/react"

export default function RouterSpeedInsights() {
  const { pathname } = useLocation()
  const params = useParams()
  const route = computeRoute(pathname, params)

  return (
    <SpeedInsights
      route={route}
      basePath={import.meta.env.VITE_VERCEL_OBSERVABILITY_BASEPATH}
      configString={import.meta.env.VITE_VERCEL_OBSERVABILITY_CLIENT_CONFIG}
    />
  )
}
