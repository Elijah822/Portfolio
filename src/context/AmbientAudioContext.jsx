import { createContext, useCallback, useContext, useEffect, useState } from "react"
import {
  initAmbientPlayer,
  isAudioPrefOn,
  isExplicitlyMuted,
  isAudioUnlocked,
  onAudioUnlock,
  setAmbientVolume,
  setupAudioOnMouseMove,
  startAmbientMusic,
  stopAmbientMusic,
  unlockAudio,
} from "../lib/portfolioAudio.js"

const AmbientAudioContext = createContext(null)

export function AmbientAudioProvider({ children }) {
  const [soundOn, setSoundOn] = useState(() => isAudioPrefOn())

  const enableSound = useCallback(() => {
    setSoundOn(true)
    setAmbientVolume(0.22)
    startAmbientMusic()
  }, [])

  useEffect(() => {
    initAmbientPlayer()

    const offUnlock = onAudioUnlock(() => {
      if (isAudioPrefOn() && !isExplicitlyMuted()) enableSound()
    })
    const cleanupGesture = setupAudioOnMouseMove(enableSound)

    if (isAudioPrefOn()) {
      unlockAudio()
      enableSound()
    }

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
    } else {
      if (!isAudioUnlocked()) unlockAudio()
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
