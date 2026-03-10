import { motion, AnimatePresence } from "motion/react"

export default function PhotoCarousel({
  photos, current, visible, animDir, goTo, prev, next,
  showCaptions, showThumbs, roundedCorners, theme, editable = false,
  onUpdateCaption, onRemovePhoto,
}) {
  const photo = photos[current] || photos[0]
  if (!photo) return null

  const slideStyle = {
    transition: visible ? "opacity .25s ease, transform .25s ease" : "none",
    opacity: visible ? 1 : 0,
    transform: visible
      ? "translateX(0) scale(1)"
      : `translateX(${animDir === "left" ? "-40px" : "40px"}) scale(0.97)`,
    width: "100%",
    height: "100%",
  }

  return (
    <>
      {/* main image */}
      <div className="relative w-full max-w-[540px] mt-4">
        <div className="relative overflow-hidden bg-white" style={{
          borderRadius: roundedCorners ? 24 : 4,
          boxShadow: `0 12px 48px ${theme.accent}33, 0 4px 16px rgba(0,0,0,0.1)`,
          aspectRatio: "4/3",
        }}>
          <div style={slideStyle}>
            <img src={photo.src} alt="" className="w-full h-full object-cover block" style={{ aspectRatio: "4/3" }}
              onError={e => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='16'%3EImage unavailable%3C/text%3E%3C/svg%3E" }}
            />
          </div>

          {/* caption */}
          {showCaptions && (
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8" style={{ background: "linear-gradient(transparent,rgba(0,0,0,0.65))" }}>
              {editable ? (
                <input
                  value={photo.caption || ""}
                  onChange={e => onUpdateCaption?.(photo.id, e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-white font-bold text-sm"
                  style={{
                    fontFamily: "'Nunito',sans-serif",
                    borderBottom: "2px dashed rgba(255,255,255,0.4)",
                    textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                  }}
                />
              ) : (
                <div className="text-white font-bold text-sm" style={{
                  fontFamily: "'Nunito',sans-serif",
                  textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                }}>{photo.caption}</div>
              )}
            </div>
          )}

          {/* counter */}
          <div className="absolute top-3 right-3 text-white text-xs font-bold rounded-full px-3 py-0.5" style={{
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(6px)",
          }}>{current + 1} / {photos.length}</div>

          {/* remove button (creator only) */}
          {editable && photos.length > 1 && (
            <button onClick={() => onRemovePhoto?.(photo.id)} title="Remove this photo"
              className="absolute top-3 left-3 text-white border-none rounded-full w-[26px] h-[26px] cursor-pointer text-xs flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}>
              ✕
            </button>
          )}

          {/* source badge for URL photos in creator mode */}
          {editable && photo.sourceType === "url" && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 text-white text-[0.65rem] font-bold rounded-full px-2 py-0.5" style={{
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(6px)",
            }}>🔗 URL photo</div>
          )}
        </div>

        {/* nav arrows */}
        {["left", "right"].map(dir => {
          const isLeft = dir === "left"
          const disabled = isLeft ? current === 0 : current === photos.length - 1
          return (
            <motion.button key={dir}
              whileHover={disabled ? {} : { scale: 1.15 }}
              whileTap={disabled ? {} : { scale: 0.9 }}
              onClick={isLeft ? prev : next}
              disabled={disabled}
              className="absolute top-1/2 -translate-y-1/2 w-11 h-11 rounded-full text-white text-2xl border-none flex items-center justify-center"
              style={{
                [isLeft ? "left" : "right"]: -22,
                background: disabled ? "#ccc" : `rgba(255,255,255,0.2)`,
                backdropFilter: disabled ? "none" : "blur(12px)",
                border: disabled ? "none" : `2px solid ${theme.accent}66`,
                color: disabled ? "#999" : theme.accent,
                cursor: disabled ? "default" : "pointer",
                boxShadow: disabled ? "none" : `0 4px 14px ${theme.accent}33`,
                opacity: disabled ? 0.3 : 1,
                transition: "opacity .15s",
              }}>
              {isLeft ? "◁" : "▷"}
            </motion.button>
          )
        })}
      </div>

      {/* dots */}
      <div className="flex gap-2 mt-4 z-[1]">
        {photos.map((_, i) => (
          <motion.button key={i} layout
            onClick={() => goTo(i, i > current ? "right" : "left")}
            className="border-none cursor-pointer p-0"
            style={{
              width: i === current ? 28 : 10,
              height: 10,
              borderRadius: 99,
              background: i === current ? theme.accent : `${theme.accent}44`,
              boxShadow: i === current ? `0 2px 8px ${theme.accent}66` : "none",
              transition: "background .3s ease",
            }}
          />
        ))}
      </div>

      {/* thumbnails */}
      {showThumbs && photos.length > 1 && (
        <div className="flex gap-2 mt-3.5 z-[1] overflow-x-auto max-w-[540px] w-full pb-1">
          {photos.map((ph, i) => (
            <img key={ph.id} src={ph.src} alt=""
              onClick={() => goTo(i, i > current ? "right" : "left")}
              className="w-[54px] h-[54px] object-cover shrink-0 cursor-pointer transition-all duration-200"
              style={{
                borderRadius: roundedCorners ? 10 : 3,
                border: i === current ? `3px solid ${theme.accent}` : "3px solid transparent",
                opacity: i === current ? 1 : 0.58,
                boxShadow: i === current ? `0 2px 10px ${theme.accent}55` : "none",
              }}
              onError={e => { e.target.style.display = "none" }}
            />
          ))}
        </div>
      )}
    </>
  )
}
