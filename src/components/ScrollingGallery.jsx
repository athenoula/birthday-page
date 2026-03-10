import { useMemo, useRef, useState, useEffect } from "react"

function VideoCard({ media, roundedCorners, editable, onUpdateCaption, accent, isDark, autoUnmute }) {
  const radius = roundedCorners ? 14 : 3
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(!autoUnmute)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted
    }
  }, [muted])

  const toggleMute = () => setMuted(m => !m)

  return (
    <div className="relative group" style={{ borderRadius: radius, overflow: "hidden" }}>
      <video
        ref={videoRef}
        src={media.src}
        className="w-full object-cover block"
        style={{ aspectRatio: media.aspect || "3/4" }}
        autoPlay
        loop
        playsInline
        muted={muted}
        onClick={toggleMute}
        onError={e => { e.target.style.display = "none" }}
      />
      {/* mute indicator */}
      <button
        onClick={toggleMute}
        className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border-none text-white text-sm"
        style={{
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
        }}
      >
        {muted ? "🔇" : "🔊"}
      </button>
      {/* caption overlay */}
      <div className="absolute bottom-0 left-0 right-0 px-3 pt-8 pb-2.5"
        style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.75))" }}>
        {editable ? (
          <input
            value={media.caption || ""}
            onChange={e => onUpdateCaption?.(media.id, e.target.value)}
            placeholder="Add a note..."
            className="w-full bg-transparent border-none outline-none text-white text-xs font-bold"
            style={{
              fontFamily: "'Nunito', sans-serif",
              borderBottom: "1px dashed rgba(255,255,255,0.3)",
              textShadow: "0 1px 3px rgba(0,0,0,0.5)",
              paddingBottom: 2,
            }}
          />
        ) : (
          media.caption && (
            <div className="text-white text-xs font-bold"
              style={{
                fontFamily: "'Nunito', sans-serif",
                textShadow: "0 1px 3px rgba(0,0,0,0.5)",
              }}>{media.caption}</div>
          )
        )}
      </div>
    </div>
  )
}

function PhotoCard({ photo, roundedCorners, editable, onUpdateCaption, accent, isDark }) {
  const radius = roundedCorners ? 14 : 3

  return (
    <div className="relative group" style={{ borderRadius: radius, overflow: "hidden" }}>
      <img
        src={photo.src}
        alt={photo.caption || ""}
        className="w-full object-cover block"
        style={{ aspectRatio: photo.aspect || "3/4" }}
        loading="lazy"
        onError={e => { e.target.style.display = "none" }}
      />
      {/* caption overlay */}
      <div className="absolute bottom-0 left-0 right-0 px-3 pt-8 pb-2.5"
        style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.75))" }}>
        {editable ? (
          <input
            value={photo.caption || ""}
            onChange={e => onUpdateCaption?.(photo.id, e.target.value)}
            placeholder="Add a note..."
            className="w-full bg-transparent border-none outline-none text-white text-xs font-bold"
            style={{
              fontFamily: "'Nunito', sans-serif",
              borderBottom: "1px dashed rgba(255,255,255,0.3)",
              textShadow: "0 1px 3px rgba(0,0,0,0.5)",
              paddingBottom: 2,
            }}
          />
        ) : (
          photo.caption && (
            <div className="text-white text-xs font-bold"
              style={{
                fontFamily: "'Nunito', sans-serif",
                textShadow: "0 1px 3px rgba(0,0,0,0.5)",
              }}>{photo.caption}</div>
          )
        )}
      </div>
    </div>
  )
}

function GreetingCard({ greeting, name, font, accent, accent2, isDark, roundedCorners }) {
  const radius = roundedCorners ? 14 : 3
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-8"
      style={{
        borderRadius: radius,
        background: isDark
          ? `linear-gradient(135deg, ${accent}22, ${accent2}22)`
          : `linear-gradient(135deg, ${accent}15, ${accent2}15)`,
        border: `1px solid ${accent}33`,
        minHeight: 180,
      }}>
      <div style={{
        fontFamily: font.family,
        fontSize: "clamp(1.4rem, 4vw, 2rem)",
        color: accent,
        lineHeight: 1.1,
      }}>{greeting}</div>
      <div className="flex items-center gap-2 my-2">
        <div className="h-[1px] w-6 rounded-full" style={{ background: `${accent}44` }} />
        <span className="text-xs" style={{ color: `${accent}66` }}>✦</span>
        <div className="h-[1px] w-6 rounded-full" style={{ background: `${accent}44` }} />
      </div>
      <div style={{
        fontFamily: font.family,
        fontSize: "clamp(1.6rem, 5vw, 2.5rem)",
        color: accent2,
        lineHeight: 1.1,
      }}>{name}</div>
    </div>
  )
}

function MessageCard({ message, accent, isDark, roundedCorners }) {
  if (!message) return null
  const radius = roundedCorners ? 14 : 3
  return (
    <div className="flex flex-col items-center justify-center text-center px-5 py-6"
      style={{
        borderRadius: radius,
        background: isDark
          ? "rgba(255,255,255,0.05)"
          : "rgba(255,255,255,0.6)",
        backdropFilter: "blur(8px)",
        border: `1px solid ${accent}22`,
        minHeight: 120,
      }}>
      <div className="text-2xl mb-2">💌</div>
      <div className="text-sm font-semibold leading-relaxed"
        style={{
          color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)",
          fontFamily: "'Nunito', sans-serif",
        }}>{message}</div>
    </div>
  )
}

function GalleryColumn({ items, direction = "up", speed = 30 }) {
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden flex-1 min-w-0">
      <div
        className={`gallery-col ${direction === "up" ? "gallery-col-up" : "gallery-col-down"}`}
        style={{ "--scroll-speed": `${speed}s` }}
      >
        {doubled.map((item, i) => (
          <div key={`${item.key}-${i}`}>{item.node}</div>
        ))}
      </div>
    </div>
  )
}

export default function ScrollingGallery({
  photos, greeting, name, subMessage, font, theme,
  roundedCorners = true, editable = false, onUpdateCaption,
}) {
  const { accent, accent2 } = theme
  const isDark = theme.id === "galaxy"

  // assign varied aspect ratios to photos
  const photosWithAspect = useMemo(() =>
    photos.map((p, i) => ({
      ...p,
      aspect: ["3/4", "4/5", "1/1", "4/5", "3/4", "5/6"][i % 6],
    }))
  , [photos])

  // build items for each column, weaving in greeting + message cards
  const [col1Items, col2Items, col3Items] = useMemo(() => {
    const c1 = [], c2 = [], c3 = []
    const cols = [c1, c2, c3]

    let firstVideo = true
    photosWithAspect.forEach((photo, i) => {
      const col = cols[i % 3]
      if (photo.type === "video") {
        const unmute = firstVideo
        firstVideo = false
        col.push({
          key: `video-${photo.id}`,
          node: <VideoCard media={photo} roundedCorners={roundedCorners} editable={editable}
            onUpdateCaption={onUpdateCaption} accent={accent} isDark={isDark} autoUnmute={unmute} />,
        })
      } else {
        col.push({
          key: `photo-${photo.id}`,
          node: <PhotoCard photo={photo} roundedCorners={roundedCorners} editable={editable}
            onUpdateCaption={onUpdateCaption} accent={accent} isDark={isDark} />,
        })
      }
    })

    // insert greeting card at start of column 2
    c2.unshift({
      key: "greeting",
      node: <GreetingCard greeting={greeting} name={name} font={font}
        accent={accent} accent2={accent2} isDark={isDark} roundedCorners={roundedCorners} />,
    })

    // insert message card in column 1 after 2nd photo
    if (subMessage) {
      const insertAt = Math.min(2, c1.length)
      c1.splice(insertAt, 0, {
        key: "message",
        node: <MessageCard message={subMessage} accent={accent} isDark={isDark} roundedCorners={roundedCorners} />,
      })
    }

    return [c1, c2, c3]
  }, [photosWithAspect, greeting, name, subMessage, font, accent, accent2, isDark, roundedCorners, editable, onUpdateCaption])

  if (photos.length < 3) {
    return (
      <div className="grid grid-cols-2 gap-3 w-full max-w-4xl mx-auto px-4 py-8">
        <div className="col-span-2">
          <GreetingCard greeting={greeting} name={name} font={font}
            accent={accent} accent2={accent2} isDark={isDark} roundedCorners={roundedCorners} />
        </div>
        {photos.map((p, i) => (
          p.type === "video"
            ? <VideoCard key={p.id} media={{ ...p, aspect: "4/5" }} roundedCorners={roundedCorners}
                editable={editable} onUpdateCaption={onUpdateCaption} accent={accent} isDark={isDark}
                autoUnmute={photos.filter(x => x.type === "video").indexOf(p) === 0} />
            : <PhotoCard key={p.id} photo={{ ...p, aspect: "4/5" }} roundedCorners={roundedCorners}
                editable={editable} onUpdateCaption={onUpdateCaption} accent={accent} isDark={isDark} />
        ))}
        {subMessage && (
          <div className="col-span-2">
            <MessageCard message={subMessage} accent={accent} isDark={isDark} roundedCorners={roundedCorners} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex gap-3 w-full max-w-5xl mx-auto px-3 overflow-hidden" style={{ height: "100vh" }}>
      <GalleryColumn items={col1Items} direction="up" speed={32} />
      <GalleryColumn items={col2Items} direction="down" speed={38} />
      <GalleryColumn items={col3Items} direction="up" speed={35} />
    </div>
  )
}
