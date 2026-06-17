import { createContext, useCallback, useContext, useEffect, useState } from "react"
import {
  isAudioUnlocked,
  onAudioUnlock,
  setAmbientVolume,
  setupAudioOnMouseMove,
  startAmbientMusic,
  stopAmbientMusic,
} from "../lib/portfolioAudio.js"
import { initAmbientPlayer } from "../lib/youtubePlayer.js"

const AmbientAudioContext = createContext(null)

export function AmbientAudioProvider({ children }) {
  const [soundOn, setSoundOn] = useState(() => isAudioUnlocked())

  const enableSound = useCallback(() => {
    setSoundOn(true)
    setAmbientVolume(0.22)
    startAmbientMusic()
  }, [])

  useEffect(() => {
    initAmbientPlayer().catch(() => {})

    const offUnlock = onAudioUnlock(enableSound)
    const cleanupGesture = setupAudioOnMouseMove(enableSound)

    if (isAudioUnlocked()) enableSound()

    return () => {
      offUnlock()
      cleanupGesture()
    }
  }, [enableSound])

  const toggleSound = useCallback(() => {
    if (soundOn) {
      stopAmbientMusic()
      setAmbientVolume(0)
      setSoundOn(false)
    } else if (isAudioUnlocked()) {
      enableSound()
    }
  }, [soundOn, enableSound])

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
