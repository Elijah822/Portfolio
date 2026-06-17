import { useEffect, useState } from "react"

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    mq.addEventListener("change", onChange)
    onChange()
    return () => mq.removeEventListener("change", onChange)
  }, [query])

  return matches
}

export function useIsMobile() {
  return useMediaQuery("(max-width: 768px)")
}

export function useCoarsePointer() {
  return useMediaQuery("(pointer: coarse)")
}

export function useFinePointer() {
  return useMediaQuery("(hover: hover) and (pointer: fine)")
}
