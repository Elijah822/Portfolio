import { useState } from "react"
import { useAccessibility } from "../context/AccessibilityContext.jsx"
import { TEXT_SIZE_LEVELS } from "../lib/accessibilityState.js"

const BG = "#07070c"
const TEXT = "#e0dbd2"
const DIM = "#a39e98"
const GOLD = "#c9aa7c"
const BORDER = "rgba(255,255,255,0.07)"

function A11yIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="4.5" r="2" />
      <path d="M12 7v5" />
      <path d="M7.5 11h9" />
      <path d="M9.5 21l2.5-6 2.5 6" />
    </svg>
  )
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
        padding: "14px 0",
        borderBottom: `1px solid ${BORDER}`,
        cursor: "inherit",
      }}
    >
      <span>
        <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 14, color: TEXT, marginBottom: 4 }}>{label}</span>
        <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 12, color: DIM, lineHeight: 1.5 }}>{description}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        data-h
        onClick={onChange}
        style={{
          flexShrink: 0,
          width: 44,
          height: 26,
          borderRadius: 999,
          border: `1px solid ${checked ? GOLD : BORDER}`,
          background: checked ? "rgba(201,170,124,0.22)" : "rgba(255,255,255,0.04)",
          position: "relative",
          cursor: "inherit",
          transition: "all 0.2s ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: checked ? 21 : 3,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: checked ? GOLD : DIM,
            transition: "left 0.2s ease, background 0.2s ease",
          }}
        />
      </button>
    </label>
  )
}

export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false)
  const {
    textSize,
    setTextSize,
    reduceMotion,
    toggleReduceMotion,
    highContrast,
    toggleHighContrast,
    systemCursor,
    toggleSystemCursor,
    resetPrefs,
  } = useAccessibility()

  return (
    <>
      <button
        type="button"
        data-h
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label="Accessibility options"
        onClick={() => setOpen(v => !v)}
        style={{
          position: "fixed",
          bottom: 24,
          left: 24,
          zIndex: 1200,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--font-body)",
          fontSize: 12,
          letterSpacing: 2,
          color: open ? BG : TEXT,
          background: open ? GOLD : "rgba(7,7,12,0.92)",
          border: `1px solid ${open ? GOLD : BORDER}`,
          padding: "12px 16px",
          cursor: "inherit",
          textTransform: "uppercase",
          backdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
        }}
      >
        <A11yIcon />
        A11y
      </button>

      {open && (
        <div
          id="a11y-panel"
          role="dialog"
          aria-label="Accessibility settings"
          style={{
            position: "fixed",
            bottom: 76,
            left: 24,
            zIndex: 1200,
            width: "min(92vw, 340px)",
            background: "rgba(7,7,12,0.97)",
            border: `1px solid ${BORDER}`,
            padding: "22px 22px 16px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.45)",
          }}
        >
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 3, color: GOLD, textTransform: "uppercase", marginBottom: 6 }}>
            Accessibility
          </div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: 22, color: TEXT, marginBottom: 18 }}>
            Reading & motion
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 2, color: DIM, textTransform: "uppercase", marginBottom: 10 }}>
              Text size
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {TEXT_SIZE_LEVELS.map(level => (
                <button
                  key={level.id}
                  type="button"
                  data-h
                  aria-pressed={textSize === level.id}
                  onClick={() => setTextSize(level.id)}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    letterSpacing: 1,
                    color: textSize === level.id ? BG : TEXT,
                    background: textSize === level.id ? GOLD : "rgba(255,255,255,0.04)",
                    border: `1px solid ${textSize === level.id ? GOLD : BORDER}`,
                    padding: "10px 8px",
                    cursor: "inherit",
                  }}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          <Toggle
            label="Reduce motion"
            description="Minimise animations and auto-playing movement."
            checked={reduceMotion}
            onChange={toggleReduceMotion}
          />
          <Toggle
            label="High contrast"
            description="Increase text and border contrast for readability."
            checked={highContrast}
            onChange={toggleHighContrast}
          />
          <Toggle
            label="Standard cursor"
            description="Use the system pointer instead of the custom cursor."
            checked={systemCursor}
            onChange={toggleSystemCursor}
          />

          <button
            type="button"
            data-h
            onClick={resetPrefs}
            style={{
              marginTop: 14,
              width: "100%",
              fontFamily: "var(--font-body)",
              fontSize: 11,
              letterSpacing: 2,
              color: DIM,
              background: "none",
              border: `1px solid ${BORDER}`,
              padding: "10px 12px",
              cursor: "inherit",
              textTransform: "uppercase",
            }}
          >
            Reset to defaults
          </button>
        </div>
      )}
    </>
  )
}
