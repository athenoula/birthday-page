import { useState } from "react"
import { GREETINGS, THEMES, FONTS, EMOJI_SETS } from "../data/constants"

export default function useCardState(initial = {}) {
  const [name, setName] = useState(initial.name || "Alex")
  const [greeting, setGreeting] = useState(initial.greeting || GREETINGS[0])
  const [subMessage, setSubMessage] = useState(initial.subMessage ?? "Wishing you all the joy in the world today 🌈")
  const [themeId, setThemeId] = useState(initial.themeId || "candy")
  const [fontId, setFontId] = useState(initial.fontId || "boogaloo")
  const [emojiSetId, setEmojiSetId] = useState(initial.emojiSetId || "party")
  const [showCaptions, setShowCaptions] = useState(initial.showCaptions ?? true)
  const [showThumbs, setShowThumbs] = useState(initial.showThumbs ?? true)
  const [roundedCorners, setRoundedCorners] = useState(initial.roundedCorners ?? true)
  const [autoPlay, setAutoPlay] = useState(initial.autoPlay ?? false)
  const [autoPlaySecs, setAutoPlaySecs] = useState(initial.autoPlaySecs ?? 3)

  const theme = THEMES.find(t => t.id === themeId) || THEMES[0]
  const font = FONTS.find(f => f.id === fontId) || FONTS[0]
  const emojiSet = EMOJI_SETS.find(e => e.id === emojiSetId) || EMOJI_SETS[0]
  const isDark = themeId === "galaxy"
  const confettiColors = [theme.accent, theme.accent2, "#ffd93d", "#6bcb77", "#ff6bdf"]

  return {
    name, setName,
    greeting, setGreeting,
    subMessage, setSubMessage,
    themeId, setThemeId,
    fontId, setFontId,
    emojiSetId, setEmojiSetId,
    showCaptions, setShowCaptions,
    showThumbs, setShowThumbs,
    roundedCorners, setRoundedCorners,
    autoPlay, setAutoPlay,
    autoPlaySecs, setAutoPlaySecs,
    theme, font, emojiSet, isDark, confettiColors,
  }
}
