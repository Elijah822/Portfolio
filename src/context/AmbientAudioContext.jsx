import { createContext, useCallback, useContext, useEffect, useState } from "react"
import SoundNudge from "../components/SoundNudge.jsx"
import { setupHeroVideoAmbientSync } from "../lib/heroVideoAmbient.js"
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

const AUDIO_PREF_KEY = "portfolio-audio-on"
const AmbientAudioContext = createContext(null)

export function AmbientAudioProvider({ children }) {
  const [soundOn, setSoundOn] = useState(() => isAudioPrefOn())

  const markSoundOn = useCallback(() => {
    setSoundOn(true)
    setAmbientVolume(0.22)
  }, [])

  useEffect(() => {
    const prev = sessionStorage.getItem(AUDIO_PREF_KEY)
    if (prev === "0") sessionStorage.removeItem(AUDIO_PREF_KEY)
  }, [])

  useEffect(() => {
    initAmbientPlayer()

    const offUnlock = onAudioUnlock(() => {
      if (isAudioPrefOn() && !isExplicitlyMuted()) markSoundOn()
    })
    const cleanupGesture = setupAudioOnMouseMove(markSoundOn)
    const cleanupHeroVideo = setupHeroVideoAmbientSync()

    return () => {
      offUnlock()
      cleanupGesture()
      cleanupHeroVideo()
    }
  }, [markSoundOn])

  const toggleSound = useCallback(() => {
    if (soundOn) {
      stopAmbientMusic()
      setAmbientVolume(0)
      setSoundOn(false)
    } else {
      if (!isAudioUnlocked()) unlockAudio()
      setSoundOn(true)
      setAmbientVolume(0.22)
      void startAmbientMusic().then(ok => {
        if (!ok) setSoundOn(false)
      })
    }
  }, [soundOn])

  return (
    <AmbientAudioContext.Provider value={{ soundOn, toggleSound }}>
      {children}
      <SoundNudge />
    </AmbientAudioContext.Provider>
  )
}

export function useAmbientAudio() {
  const ctx = useContext(AmbientAudioContext)
  if (!ctx) throw new Error("useAmbientAudio must be used within AmbientAudioProvider")
  return ctx
}
