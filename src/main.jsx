import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Portfolio from "./Portfolio.jsx"
import Games from "./Games.jsx"
import About from "./pages/About.jsx"
import ProjectPage from "./pages/ProjectPage.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/about" element={<About />} />
        <Route path="/work/:id" element={<ProjectPage />} />
        <Route path="/games" element={<Games />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
