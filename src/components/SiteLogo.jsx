export default function SiteLogo({ size = 28, className = "", style = {}, ...props }) {
  return (
    <img
      src="/logo-mark.png"
      alt="Elijah Akinlolu"
      width={size}
      height={size}
      className={className}
      style={{ display: "block", width: size, height: size, objectFit: "contain", flexShrink: 0, ...style }}
      {...props}
    />
  )
}
