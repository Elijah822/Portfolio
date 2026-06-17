const BG = "#07070c"
const TEXT = "#e0dbd2"
const DIM = "#a39e98"
const GOLD = "#c9aa7c"
const BORDER = "rgba(255,255,255,0.07)"

export default function CloseButton({ onClick, fixed = true, className = "", style = {} }) {
  return (
    <button
      data-h
      type="button"
      aria-label="Close"
      className={className}
      onClick={onClick}
      style={{
        ...(fixed ? { position: "fixed", top: 24, right: 32, zIndex: 1000 } : {}),
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: `1px solid ${BORDER}`,
        background: "rgba(7,7,12,0.92)",
        color: TEXT,
        fontSize: 26,
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "none",
        transition: "all 0.2s ease",
        ...style,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = GOLD
        e.currentTarget.style.color = GOLD
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = BORDER
        e.currentTarget.style.color = TEXT
      }}
    >
      ×
    </button>
  )
}
