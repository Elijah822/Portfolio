import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { AccessibilityProvider } from "./context/AccessibilityContext.jsx"
import { AmbientAudioProvider } from "./context/AmbientAudioContext.jsx"
import AppShell from "./components/AppShell.jsx"
import ScrollToTop from "./components/ScrollToTop.jsx"
import { loadFonts } from "./tokens/typography.js"
import { applyA11yPrefs, loadA11yPrefs } from "./lib/accessibilityState.js"
import { initScrollRestoration } from "./lib/scrollToTop.js"
import "@fontsource-variable/bricolage-grotesque/wght.css"
import "./styles/global.css"
import Portfolio from "./Portfolio.jsx"
import Games from "./Games.jsx"
import About from "./pages/About.jsx"
import Exploration from "./pages/Exploration.jsx"
import ProjectPage from "./pages/ProjectPage.jsx"

loadFonts()
initScrollRestoration()
applyA11yPrefs(loadA11yPrefs())

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AccessibilityProvider>
      <AppShell>
        <AmbientAudioProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Portfolio />} />
              <Route path="/about" element={<About />} />
              <Route path="/exploration" element={<Exploration />} />
              <Route path="/work/:id" element={<ProjectPage />} />
              <Route path="/games" element={<Games />} />
            </Routes>
            <Analytics />
            <SpeedInsights />
          </BrowserRouter>
        </AmbientAudioProvider>
      </AppShell>
    </AccessibilityProvider>
  </StrictMode>
)
