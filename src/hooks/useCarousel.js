import { useState, useRef, useEffect, useCallback } from "react"
import { clamp } from "../utils/confetti"

export default function useCarousel(photos, { autoPlay, autoPlaySecs } = {}) {
  const [current, setCurrent] = useState(0)
  const [animDir, setAnimDir] = useState(null)
  const [visible, setVisible] = useState(true)
  const autoTimer = useRef(null)

  // keep current in bounds when photos change
  useEffect(() => {
    if (current >= photos.length) {
      setCurrent(Math.max(0, photos.length - 1))
    }
  }, [photos.length, current])

  // autoplay
  useEffect(() => {
    clearInterval(autoTimer.current)
    if (autoPlay && photos.length > 1) {
      autoTimer.current = setInterval(() => {
        setAnimDir("right")
        setVisible(false)
        setTimeout(() => {
          setCurrent(c => (c + 1) % photos.length)
          setVisible(true)
        }, 260)
      }, autoPlaySecs * 1000)
    }
    return () => clearInterval(autoTimer.current)
  }, [autoPlay, autoPlaySecs, photos.length])

  const goTo = useCallback((next, dir) => {
    if (!visible) return
    setAnimDir(dir)
    setVisible(false)
    setTimeout(() => {
      setCurrent(clamp(next, 0, photos.length - 1))
      setVisible(true)
    }, 260)
  }, [visible, photos.length])

  const prev = useCallback(() => {
    if (current > 0) goTo(current - 1, "left")
  }, [current, goTo])

  const next = useCallback(() => {
    if (current < photos.length - 1) goTo(current + 1, "right")
  }, [current, photos.length, goTo])

  // keyboard nav
  useEffect(() => {
    const h = e => {
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [prev, next])

  return { current, animDir, visible, goTo, prev, next }
}
