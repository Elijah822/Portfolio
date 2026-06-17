import { useEffect, useRef } from "react"

const GOLD = "#c9aa7c"

export default function CustomCursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    document.documentElement.classList.add("custom-cursor-active")
    document.body.style.cursor = "none"

    let mx = 0
    let my = 0
    let dx = 0
    let dy = 0
    let rx = 0
    let ry = 0
    let big = false
    let raf

    const onMove = e => {
      mx = e.clientX
      my = e.clientY
    }

    const onOver = e => {
      big = Boolean(e.target.closest("a,button,[data-h],input,label,[role='button'],select,textarea"))
    }

    const opts = { passive: true, capture: true }
    document.addEventListener("pointermove", onMove, opts)
    document.addEventListener("mousemove", onMove, opts)
    document.addEventListener("mouseover", onOver, opts)

    const tick = () => {
      dx += (mx - dx) * 0.35
      dy += (my - dy) * 0.35
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      if (dot.current) {
        dot.current.style.transform = `translate3d(${dx - 4}px,${dy - 4}px,0) scale(${big ? 2.5 : 1})`
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx - 20}px,${ry - 20}px,0) scale(${big ? 1.6 : 1})`
      }
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener("pointermove", onMove, opts)
      document.removeEventListener("mousemove", onMove, opts)
      document.removeEventListener("mouseover", onOver, opts)
      document.documentElement.classList.remove("custom-cursor-active")
      document.body.style.cursor = ""
    }
  }, [])

  return (
    <>
      <div
        ref={dot}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: GOLD,
          pointerEvents: "none",
          zIndex: 100000,
          willChange: "transform",
          transition: "transform 0.12s ease",
        }}
      />
      <div
        ref={ring}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: `1px solid ${GOLD}`,
          pointerEvents: "none",
          zIndex: 99999,
          opacity: 0.35,
          willChange: "transform",
        }}
      />
    </>
  )
}
