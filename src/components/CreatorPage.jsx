import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { DEMO_PHOTOS, THEMES, FONTS, EMOJI_SETS, GREETINGS } from "../data/constants"
import { fireSideCannons } from "../utils/confetti"
import { uploadToCloudinary, isCloudinaryConfigured } from "../utils/cloudinary"
import useCardState from "../hooks/useCardState"
import CardView from "./CardView"
import ShareModal from "./ShareModal"
import Toggle from "./Toggle"

function Section({ title, emoji, open, onToggle, accent, isDark, children }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{
      background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.75)",
      backdropFilter: "blur(12px)",
      boxShadow: isDark ? "0 2px 12px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)",
      borderLeft: `4px solid ${accent}`,
    }}>
      <button onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3.5 cursor-pointer border-none bg-transparent text-left"
        style={{ fontFamily: "'Nunito', sans-serif" }}>
        <span className="font-black text-sm tracking-wide" style={{ color: isDark ? "#e0d0ff" : "#333" }}>
          {emoji} {title}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="text-lg" style={{ color: accent }}>▾</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden">
            <div className="px-5 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function CreatorPage() {
  const cardState = useCardState()
  const [photos, setPhotos] = useState(DEMO_PHOTOS)
  const [shareOpen, setShareOpen] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [openSection, setOpenSection] = useState("theme")
  const [uploading, setUploading] = useState(0)
  const fileRef = useRef(null)

  useEffect(() => { fireSideCannons(cardState.confettiColors) }, [])

  const handleFiles = async files => {
    const fileList = Array.from(files)

    if (isCloudinaryConfigured()) {
      setUploading(prev => prev + fileList.length)
      for (const f of fileList) {
        try {
          const { url, type } = await uploadToCloudinary(f)
          setPhotos(p => [...p, {
            id: Date.now() + Math.random(), src: url,
            caption: "", sourceType: "url", type,
          }])
        } catch (err) {
          console.error("Upload failed:", err.message)
        } finally {
          setUploading(prev => prev - 1)
        }
      }
    } else {
      const fresh = fileList.map((f, i) => ({
        id: Date.now() + i, src: URL.createObjectURL(f),
        caption: "Add a caption ✏️", sourceType: "local",
        type: f.type.startsWith("video/") ? "video" : "photo",
      }))
      setPhotos(p => [...p, ...fresh])
    }
  }

  const isVideoUrl = url => /\.(mp4|webm|mov|ogg|m4v)(\?|$)/i.test(url)

  const addImageUrl = () => {
    const trimmed = imageUrl.trim()
    if (!trimmed) return
    setPhotos(p => [...p, {
      id: Date.now(), src: trimmed, caption: "", sourceType: "url",
      type: isVideoUrl(trimmed) ? "video" : "photo",
    }])
    setImageUrl("")
  }

  const onDrop = e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }
  const updateCaption = (id, val) => setPhotos(p => p.map(ph => ph.id === id ? { ...ph, caption: val } : ph))
  const removePhoto = id => setPhotos(p => p.filter(ph => ph.id !== id))
  const movePhoto = (id, dir) => setPhotos(p => {
    const idx = p.findIndex(ph => ph.id === id)
    if (idx < 0) return p
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= p.length) return p
    const copy = [...p]
    ;[copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]]
    return copy
  })
  const toggle = key => setOpenSection(prev => prev === key ? null : key)

  const removedDemos = DEMO_PHOTOS.filter(d => !photos.some(p => p.id === d.id))
  const addDemoPhoto = demo => setPhotos(p => [...p, { ...demo }])

  const {
    name, setName, greeting, setGreeting, subMessage, setSubMessage,
    themeId, setThemeId, fontId, setFontId, emojiSetId, setEmojiSetId,
    showCaptions, setShowCaptions, showThumbs, setShowThumbs,
    roundedCorners, setRoundedCorners, autoPlay, setAutoPlay,
    autoPlaySecs, setAutoPlaySecs,
    theme, font, isDark, confettiColors,
  } = cardState

  const panelText = isDark ? "#e0d0ff" : "#1a1a2e"
  const inputBg = isDark ? "rgba(255,255,255,0.07)" : "#f8f8f8"

  return (
    <>
      <CardView
        cardState={cardState}
        photos={photos}
        editable={true}
        onUpdateCaption={updateCaption}
      >
        {/* ── Creator controls below card ── */}
        <section className="relative z-[1] flex flex-col items-center px-4 py-10">
          <div className="w-full max-w-[560px] flex flex-col gap-3">

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 justify-center mb-4">
              <motion.button whileHover={{ scale: 1.07, rotate: -1 }} whileTap={{ scale: 0.95 }}
                onClick={() => fileRef.current.click()}
                className="border-none cursor-pointer text-base px-6 py-3 rounded-full font-bold"
                style={{
                  background: `linear-gradient(135deg,${theme.accent},${theme.accent2})`,
                  color: "#fff", fontFamily: font.family,
                  boxShadow: `0 4px 16px ${theme.accent}44`,
                }}>📸 Add Photos / Videos</motion.button>
              <input ref={fileRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />

              <motion.button whileHover={{ scale: 1.07, rotate: -1 }} whileTap={{ scale: 0.95 }}
                onClick={() => setShareOpen(true)}
                className="border-none cursor-pointer text-base px-6 py-3 rounded-full font-bold"
                style={{
                  background: "linear-gradient(135deg,#ff6bdf,#ff4d8d)",
                  color: "#fff", fontFamily: font.family,
                  boxShadow: "0 4px 16px rgba(255,77,141,0.4)",
                }}>🎁 Share Card</motion.button>
            </div>

            {/* Image URL input */}
            <div className="flex gap-2">
              <input value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addImageUrl()}
                placeholder="Paste an image or video URL..."
                className="flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold outline-none"
                style={{
                  background: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.8)",
                  backdropFilter: "blur(8px)", border: `2px solid ${theme.accent}44`,
                  color: isDark ? "#e0d0ff" : "#333", fontFamily: "'Nunito',sans-serif",
                }} />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={addImageUrl}
                className="px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer border-none text-white shrink-0"
                style={{ background: theme.accent }}>Add</motion.button>
            </div>

            {/* Drag & drop */}
            <div onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)} onDrop={onDrop}
              className="rounded-xl px-5 py-3 text-center font-bold text-sm transition-all duration-200"
              style={{
                border: `3px dashed ${dragOver ? theme.accent : theme.accent + "55"}`,
                background: dragOver ? `${theme.accent}11` : (isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.35)"),
                color: dragOver ? theme.accent : (isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.38)"),
                backdropFilter: "blur(4px)",
              }}>{dragOver ? "Drop it! 📸" : "Drag & drop photos or videos here"}</div>

            {uploading > 0 && (
              <div className="text-center text-sm font-bold py-2 animate-pulse"
                style={{ color: theme.accent }}>
                Uploading {uploading} file{uploading > 1 ? "s" : ""}...
              </div>
            )}

            {/* Photo list (reorderable + removable) */}
            {photos.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-1">
                {photos.map((ph, idx) => (
                  <div key={ph.id} className="flex items-center gap-2 group rounded-lg py-1 px-2"
                    style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)" }}>
                    {ph.type === "video" ? (
                      <video src={ph.src} className="w-12 h-12 object-cover rounded-md shrink-0" muted
                        style={{ border: `2px solid ${theme.accent}33` }} />
                    ) : (
                      <img src={ph.src} alt="" className="w-12 h-12 object-cover rounded-md shrink-0"
                        style={{ border: `2px solid ${theme.accent}33` }} />
                    )}
                    {ph.type === "video" && (
                      <span className="text-[10px] bg-black/50 text-white px-1 rounded">🎬</span>
                    )}
                    <span className="flex-1 text-xs font-semibold truncate min-w-0"
                      style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" }}>
                      {ph.caption || (ph.sourceType === "demo" ? "Stock photo" : "Uploaded")}
                    </span>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button onClick={() => movePhoto(ph.id, -1)} disabled={idx === 0}
                        className="w-6 h-6 rounded flex items-center justify-center border-none cursor-pointer text-xs bg-transparent"
                        style={{ color: idx === 0 ? (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)") : theme.accent }}>▲</button>
                      <button onClick={() => movePhoto(ph.id, 1)} disabled={idx === photos.length - 1}
                        className="w-6 h-6 rounded flex items-center justify-center border-none cursor-pointer text-xs bg-transparent"
                        style={{ color: idx === photos.length - 1 ? (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)") : theme.accent }}>▼</button>
                      <button onClick={() => removePhoto(ph.id)}
                        className="w-6 h-6 rounded flex items-center justify-center border-none cursor-pointer text-xs"
                        style={{ color: "#ef4444", background: "transparent" }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add back removed stock photos */}
            {removedDemos.length > 0 && (
              <div className="mt-2">
                <div className="text-xs font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)" }}>
                  Add stock photos
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {removedDemos.map(d => (
                    <button key={d.id} onClick={() => addDemoPhoto(d)}
                      className="relative w-12 h-12 rounded-md overflow-hidden cursor-pointer border-none p-0 group/add"
                      style={{ opacity: 0.6 }}>
                      <img src={d.src} alt="" className="w-full h-full object-cover" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-lg opacity-0 group-hover/add:opacity-100 transition-opacity">+</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Editing sections ── */}
            <div className="flex flex-col gap-3 mt-4">
              <Section title="Colour Theme" emoji="🎨" open={openSection === "theme"} onToggle={() => toggle("theme")} accent={theme.accent} isDark={isDark}>
                <div className="flex flex-wrap gap-3">
                  {THEMES.map(t => (
                    <motion.button key={t.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => setThemeId(t.id)}
                      className="w-[52px] h-[52px] rounded-xl cursor-pointer p-0"
                      style={{
                        border: themeId === t.id ? `3px solid ${t.accent}` : "3px solid transparent",
                        outline: themeId === t.id ? `2px solid ${t.accent}` : "none",
                        outlineOffset: 2, background: t.bg,
                      }}><span className="text-xl">{t.label.split(" ")[0]}</span></motion.button>
                  ))}
                </div>
                <div className="mt-2 text-xs font-bold" style={{ color: `${theme.accent}99` }}>{theme.label}</div>
              </Section>

              <Section title="Text & Name" emoji="✏️" open={openSection === "text"} onToggle={() => toggle("text")} accent={theme.accent} isDark={isDark}>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider mb-1 block" style={{ color: panelText, opacity: 0.5 }}>Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Their name..."
                      className="w-full py-2 px-3 rounded-xl font-bold text-base outline-none"
                      style={{ border: `2px solid ${theme.accent}44`, fontFamily: "'Nunito',sans-serif", background: inputBg, color: panelText }} />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider mb-1 block" style={{ color: panelText, opacity: 0.5 }}>Greeting</label>
                    <div className="flex flex-wrap gap-1.5">
                      {GREETINGS.map(g => (
                        <motion.button key={g} whileTap={{ scale: 0.95 }} onClick={() => setGreeting(g)}
                          className="py-1.5 px-3 rounded-full text-xs font-bold cursor-pointer"
                          style={{
                            border: `2px solid ${greeting === g ? theme.accent : "transparent"}`,
                            background: greeting === g ? `${theme.accent}22` : (isDark ? "rgba(255,255,255,0.05)" : "#f0f0f0"),
                            color: panelText,
                          }}>{g}</motion.button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider mb-1 block" style={{ color: panelText, opacity: 0.5 }}>Personal Message</label>
                    <textarea value={subMessage} onChange={e => setSubMessage(e.target.value)} rows={3}
                      className="w-full py-2 px-3 rounded-xl font-semibold text-sm outline-none resize-y"
                      style={{ border: `2px solid ${theme.accent}44`, fontFamily: "'Nunito',sans-serif", background: inputBg, color: panelText }} />
                  </div>
                </div>
              </Section>

              <Section title="Title Font" emoji="🔤" open={openSection === "font"} onToggle={() => toggle("font")} accent={theme.accent} isDark={isDark}>
                <div className="flex flex-col gap-2">
                  {FONTS.map(f => (
                    <motion.button key={f.id} whileTap={{ scale: 0.97 }} onClick={() => setFontId(f.id)}
                      className="py-2.5 px-4 rounded-xl text-left text-lg cursor-pointer transition-colors"
                      style={{
                        border: `2px solid ${fontId === f.id ? theme.accent : "transparent"}`,
                        background: fontId === f.id ? `${theme.accent}18` : (isDark ? "rgba(255,255,255,0.05)" : "#f2f2f2"),
                        fontFamily: f.family, color: panelText,
                      }}>Happy Birthday</motion.button>
                  ))}
                </div>
              </Section>

              <Section title="Background Vibes" emoji="✨" open={openSection === "emoji"} onToggle={() => toggle("emoji")} accent={theme.accent} isDark={isDark}>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_SETS.map(es => (
                    <motion.button key={es.id} whileTap={{ scale: 0.95 }} onClick={() => setEmojiSetId(es.id)}
                      className="py-1.5 px-3 rounded-full text-sm font-bold cursor-pointer"
                      style={{
                        border: `2px solid ${emojiSetId === es.id ? theme.accent : "transparent"}`,
                        background: emojiSetId === es.id ? `${theme.accent}22` : (isDark ? "rgba(255,255,255,0.07)" : "#eee"),
                        color: panelText,
                      }}>{es.label}</motion.button>
                  ))}
                </div>
              </Section>

              <Section title="Gallery Options" emoji="⚙️" open={openSection === "display"} onToggle={() => toggle("display")} accent={theme.accent} isDark={isDark}>
                <div className="flex flex-col gap-3">
                  <Toggle value={roundedCorners} onChange={setRoundedCorners} label="Rounded photo corners" accent={theme.accent} />
                </div>
              </Section>
            </div>

          </div>
        </section>
      </CardView>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} cardState={cardState} photos={photos} />
    </>
  )
}
