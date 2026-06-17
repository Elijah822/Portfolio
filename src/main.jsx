import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Portfolio from "./Portfolio.jsx"
import Games from "./Games.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/games" element={<Games />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
