import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { encodeCardToURL, getLocalPhotoCount } from "../utils/sharing"

export default function ShareModal({ open, onClose, cardState, photos }) {
  const [copied, setCopied] = useState(false)

  if (!open) return null

  const state = {
    name: cardState.name,
    greeting: cardState.greeting,
    subMessage: cardState.subMessage,
    themeId: cardState.themeId,
    fontId: cardState.fontId,
    emojiSetId: cardState.emojiSetId,
    showCaptions: cardState.showCaptions,
    showThumbs: cardState.showThumbs,
    roundedCorners: cardState.roundedCorners,
    autoPlay: cardState.autoPlay,
    autoPlaySecs: cardState.autoPlaySecs,
    photos,
  }

  const query = encodeCardToURL(state)
  const url = `${window.location.origin}${window.location.pathname}?${query}`
  const localCount = getLocalPhotoCount(photos)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const input = document.createElement("input")
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand("copy")
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            <h2 className="text-xl font-black mb-1" style={{ color: cardState.theme.accent }}>
              🎁 Share Your Card
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Copy this link and send it to {cardState.name}!
            </p>

            {localCount > 0 && (
              <div className="mb-3 p-3 rounded-xl text-sm font-semibold" style={{
                background: "#fff3cd",
                color: "#856404",
                border: "1px solid #ffeeba",
              }}>
                ⚠️ {localCount} uploaded photo{localCount > 1 ? "s" : ""} won't appear in the shared link (only URL and demo photos transfer). Paste image URLs instead for those.
              </div>
            )}

            <div className="flex gap-2 mb-3">
              <input
                readOnly
                value={url}
                className="flex-1 px-3 py-2 rounded-lg text-sm border border-gray-200 bg-gray-50 outline-none truncate"
                onClick={e => e.target.select()}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyLink}
                className="px-4 py-2 rounded-lg text-white font-bold text-sm cursor-pointer border-none shrink-0"
                style={{ background: copied ? "#22c55e" : cardState.theme.accent }}
              >
                {copied ? "Copied!" : "Copy"}
              </motion.button>
            </div>

            <div className="flex gap-2">
              <a href={url} target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center py-2 rounded-lg text-sm font-bold no-underline transition-colors"
                style={{
                  background: `${cardState.theme.accent}15`,
                  color: cardState.theme.accent,
                  border: `1px solid ${cardState.theme.accent}33`,
                }}>
                Preview in new tab ↗
              </a>
              <button onClick={onClose}
                className="flex-1 py-2 rounded-lg text-sm font-bold cursor-pointer bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 transition-colors">
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
