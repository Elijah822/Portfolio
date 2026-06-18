import { createContext, useCallback, useContext, useEffect, useState } from "react"
import {
  isAudioPrefOn,
  onAudioUnlock,
  requestAmbientPlay,
  setAmbientVolume,
  setupAudioOnMouseMove,
  startAmbientMusic,
  stopAmbientMusic,
  unlockAudio,
} from "../lib/portfolioAudio.js"
import { initAmbientPlayer } from "../lib/youtubePlayer.js"

const AmbientAudioContext = createContext(null)

export function AmbientAudioProvider({ children }) {
  const [soundOn, setSoundOn] = useState(() => isAudioPrefOn())

  const enableSound = useCallback(() => {
    setSoundOn(true)
    setAmbientVolume(0.22)
    startAmbientMusic()
  }, [])

  useEffect(() => {
    initAmbientPlayer().catch(() => {})

    const offUnlock = onAudioUnlock(() => {
      if (isAudioPrefOn()) enableSound()
    })
    const cleanupGesture = setupAudioOnMouseMove(enableSound)

    if (isAudioPrefOn()) enableSound()

    return () => {
      offUnlock()
      cleanupGesture()
    }
  }, [enableSound])

  useEffect(() => {
    if (!soundOn) return undefined
    requestAmbientPlay()
    const id = setInterval(() => requestAmbientPlay(), 1500)
    return () => clearInterval(id)
  }, [soundOn])

  const toggleSound = useCallback(() => {
    if (soundOn) {
      stopAmbientMusic()
      setAmbientVolume(0)
      setSoundOn(false)
    } else {
      unlockAudio()
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
