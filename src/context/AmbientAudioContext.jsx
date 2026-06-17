import { createContext, useCallback, useContext, useEffect, useState } from "react"
import {
  isAudioUnlocked,
  setAmbientVolume,
  setupAudioOnMouseMove,
  startAmbientMusic,
  stopAmbientMusic,
} from "../lib/portfolioAudio.js"

const AmbientAudioContext = createContext(null)

export function AmbientAudioProvider({ children }) {
  const [soundOn, setSoundOn] = useState(false)

  useEffect(() => {
    import("../lib/youtubePlayer.js").then(m => m.initAmbientPlayer())
    const cleanup = setupAudioOnMouseMove(() => {
      setSoundOn(true)
      setAmbientVolume(0.22)
    })
    return cleanup
  }, [])

  const toggleSound = useCallback(() => {
    if (soundOn) {
      stopAmbientMusic()
      setAmbientVolume(0)
      setSoundOn(false)
    } else if (isAudioUnlocked()) {
      setAmbientVolume(0.22)
      startAmbientMusic()
      setSoundOn(true)
    }
  }, [soundOn])

  return (
    <AmbientAudioContext.Provider value={{ soundOn, toggleSound }}>
      {children}
    </AmbientAudioContext.Provider>
  )
}

export function useAmbientAudio() {
  const ctx = useContext(AmbientAudioContext)
  if (!ctx) throw new Error("useAmbientAudio must be used within AmbientAudioProvider")
  return ctx
}
