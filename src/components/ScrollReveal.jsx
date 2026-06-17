import { useReveal } from "../hooks/useReveal.js"

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"

const VARIANTS = {
  "fade-up": {
    hidden: { opacity: 0, transform: "translateY(32px)" },
    visible: { opacity: 1, transform: "none" },
  },
  "fade-down": {
    hidden: { opacity: 0, transform: "translateY(-24px)" },
    visible: { opacity: 1, transform: "none" },
  },
  fade: {
    hidden: { opacity: 0, transform: "none" },
    visible: { opacity: 1, transform: "none" },
  },
  "scale-up": {
    hidden: { opacity: 0, transform: "translateY(24px) scale(0.96)" },
    visible: { opacity: 1, transform: "none" },
  },
  "slide-left": {
    hidden: { opacity: 0, transform: "translateX(-28px)" },
    visible: { opacity: 1, transform: "none" },
  },
  "slide-right": {
    hidden: { opacity: 0, transform: "translateX(28px)" },
    visible: { opacity: 1, transform: "none" },
  },
}

export default function ScrollReveal({
  as: Tag = "div",
  variant = "fade-up",
  delay = 0,
  duration = 780,
  threshold,
  rootMargin,
  className,
  style,
  children,
  ...rest
}) {
  const [ref, visible] = useReveal(threshold, rootMargin)
  const motion = VARIANTS[variant] ?? VARIANTS["fade-up"]
  const state = visible ? motion.visible : motion.hidden

  return (
    <Tag
      ref={ref}
      className={className}
      data-revealed={visible ? "true" : "false"}
      style={{
        ...style,
        opacity: state.opacity,
        transform: state.transform,
        transition: `opacity ${duration}ms ${delay}ms ${EASE}, transform ${duration}ms ${delay}ms ${EASE}`,
        willChange: visible ? "auto" : "opacity, transform",
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
