import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AmbientAudioProvider } from "./context/AmbientAudioContext.jsx"
import { loadFonts } from "./tokens/typography.js"
import "@fontsource-variable/bricolage-grotesque"
import "./styles/global.css"
import Portfolio from "./Portfolio.jsx"
import Games from "./Games.jsx"
import About from "./pages/About.jsx"
import Exploration from "./pages/Exploration.jsx"
import ProjectPage from "./pages/ProjectPage.jsx"

loadFonts()

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AmbientAudioProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/about" element={<About />} />
          <Route path="/exploration" element={<Exploration />} />
          <Route path="/work/:id" element={<ProjectPage />} />
          <Route path="/games" element={<Games />} />
        </Routes>
      </BrowserRouter>
    </AmbientAudioProvider>
  </StrictMode>
)
