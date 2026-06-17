import { useAccessibility } from "../context/AccessibilityContext.jsx"
import { useCoarsePointer } from "../hooks/useMediaQuery.js"
import CustomCursor from "./CustomCursor.jsx"
import AccessibilityMenu from "./AccessibilityMenu.jsx"

export default function AppShell({ children }) {
  const { systemCursor } = useAccessibility()
  const coarsePointer = useCoarsePointer()

  return (
    <>
      {!systemCursor && !coarsePointer && <CustomCursor />}
      <AccessibilityMenu />
      {children}
    </>
  )
}
