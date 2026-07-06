import { StrictMode, lazy, Suspense } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Analytics } from "@vercel/analytics/react"
import RouterSpeedInsights from "./components/RouterSpeedInsights.jsx"
import { AccessibilityProvider } from "./context/AccessibilityContext.jsx"
import { AmbientAudioProvider } from "./context/AmbientAudioContext.jsx"
import AppShell from "./components/AppShell.jsx"
import ScrollToTop from "./components/ScrollToTop.jsx"
import { loadFonts } from "./tokens/typography.js"
import { applyA11yPrefs, loadA11yPrefs } from "./lib/accessibilityState.js"
import { initScrollRestoration } from "./lib/scrollToTop.js"
import "@fontsource-variable/bricolage-grotesque/wght.css"
import "./styles/global.css"

const Portfolio = lazy(() => import("./Portfolio.jsx"))
const Games = lazy(() => import("./Games.jsx"))
const About = lazy(() => import("./pages/About.jsx"))
const Exploration = lazy(() => import("./pages/Exploration.jsx"))
const Contact = lazy(() => import("./pages/Contact.jsx"))
const ProjectPage = lazy(() => import("./pages/ProjectPage.jsx"))

loadFonts()
initScrollRestoration()
applyA11yPrefs(loadA11yPrefs())

function RouteFallback() {
  return <div style={{ minHeight: "100vh", background: "#07070c" }} aria-hidden />
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AccessibilityProvider>
      <AppShell>
        <AmbientAudioProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Portfolio />} />
                <Route path="/about" element={<About />} />
                <Route path="/exploration" element={<Exploration />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/work/:id" element={<ProjectPage />} />
                <Route path="/games" element={<Games />} />
              </Routes>
            </Suspense>
            <Analytics />
            <RouterSpeedInsights />
          </BrowserRouter>
        </AmbientAudioProvider>
      </AppShell>
    </AccessibilityProvider>
  </StrictMode>
)
