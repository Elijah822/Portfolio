import { useAccessibility } from "../context/AccessibilityContext.jsx"
import CustomCursor from "./CustomCursor.jsx"
import AccessibilityMenu from "./AccessibilityMenu.jsx"

export default function AppShell({ children }) {
  const { systemCursor } = useAccessibility()

  return (
    <>
      {!systemCursor && <CustomCursor />}
      <AccessibilityMenu />
      {children}
    </>
  )
}
