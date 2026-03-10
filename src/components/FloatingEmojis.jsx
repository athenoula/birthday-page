export default function FloatingEmojis({ emojis, isDark }) {
  if (!emojis || emojis.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {emojis.map((em, i) => (
        <span key={i} className="absolute" style={{
          fontSize: `${1.1 + (i % 3) * 0.5}rem`,
          left: `${(i * 137.5) % 95}%`,
          top: `${(i * 91) % 88}%`,
          opacity: isDark ? 0.28 : 0.18,
          animation: `float${i % 3} ${4 + i % 3}s ease-in-out infinite`,
          animationDelay: `${i * 0.4}s`,
        }}>{em}</span>
      ))}
    </div>
  )
}
