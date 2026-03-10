import { motion } from "motion/react"
import FloatingEmojis from "./FloatingEmojis"
import ScrollingGallery from "./ScrollingGallery"
import { fireSideCannons, fireStars } from "../utils/confetti"

export default function CardView({
  cardState, photos,
  editable = false,
  onUpdateCaption,
  children,
}) {
  const { name, greeting, subMessage, theme, font, emojiSet, isDark, confettiColors, roundedCorners } = cardState

  return (
    <div className="relative" style={{
      background: theme.bg,
      fontFamily: "'Nunito', sans-serif",
    }}>
      <FloatingEmojis emojis={emojiSet.emojis} isDark={isDark} />

      {/* ── Scrolling Photo Gallery (the card itself) ── */}
      <section className="relative z-[1]">
        <ScrollingGallery
          photos={photos}
          greeting={greeting}
          name={name}
          subMessage={subMessage}
          font={font}
          theme={theme}
          roundedCorners={roundedCorners}
          editable={editable}
          onUpdateCaption={onUpdateCaption}
        />
      </section>

      {/* ── Confetti buttons + footer ── */}
      <section className="flex flex-col items-center justify-center relative z-[1] py-10 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <motion.button whileHover={{ scale: 1.1, rotate: -2 }} whileTap={{ scale: 0.9 }}
            onClick={() => fireStars(confettiColors)}
            className="border-none cursor-pointer text-lg px-8 py-4 rounded-full font-bold"
            style={{
              background: "linear-gradient(135deg,#ffe44d,#ffbd00)",
              color: "#7a4800",
              fontFamily: font.family,
              boxShadow: "0 6px 24px rgba(255,189,0,0.35)",
            }}>⭐ Sparkles!</motion.button>

          <motion.button whileHover={{ scale: 1.1, rotate: -2 }} whileTap={{ scale: 0.9 }}
            onClick={() => fireSideCannons(confettiColors)}
            className="border-none cursor-pointer text-lg px-8 py-4 rounded-full font-bold"
            style={{
              background: "linear-gradient(135deg,#6bcb77,#4d96ff)",
              color: "#fff",
              fontFamily: font.family,
              boxShadow: "0 6px 24px rgba(77,150,255,0.35)",
            }}>🎊 Celebrate!</motion.button>
        </motion.div>

        <div className="text-center text-sm tracking-wide"
          style={{
            fontFamily: font.family,
            color: theme.text,
            opacity: 0.4,
          }}>Made with 💖 for {name}'s special day</div>
      </section>

      {/* Slot for creator controls */}
      {children}

      <div className="h-6" />
    </div>
  )
}
