import { useEffect } from "react"
import { decodeCardFromURL } from "../utils/sharing"
import { fireSideCannons } from "../utils/confetti"
import useCardState from "../hooks/useCardState"
import CardView from "./CardView"

export default function ViewPage() {
  const decoded = decodeCardFromURL(window.location.search)
  const cardState = useCardState(decoded)

  useEffect(() => {
    fireSideCannons(cardState.confettiColors)
  }, [])

  return (
    <CardView
      cardState={cardState}
      photos={decoded.photos}
      editable={false}
    />
  )
}
