import { DEMO_PHOTOS, GREETINGS } from "../data/constants"

export function encodeCardToURL(state) {
  const params = new URLSearchParams()
  params.set("mode", "view")
  params.set("n", state.name)
  params.set("g", String(GREETINGS.indexOf(state.greeting)))
  params.set("m", state.subMessage)
  params.set("t", state.themeId)
  params.set("f", state.fontId)
  params.set("e", state.emojiSetId)
  params.set("cap", state.showCaptions ? "1" : "0")
  params.set("th", state.showThumbs ? "1" : "0")
  params.set("rc", state.roundedCorners ? "1" : "0")
  params.set("ap", state.autoPlay ? "1" : "0")
  params.set("as", String(state.autoPlaySecs))

  // encode demo photo indices
  const demoIndices = state.photos
    .filter(p => p.sourceType === "demo")
    .map(p => DEMO_PHOTOS.findIndex(d => d.id === p.id))
    .filter(i => i !== -1)
  if (demoIndices.length > 0) {
    params.set("p", demoIndices.join(","))
  }

  // encode demo photo captions (only if changed from default)
  const demoCaptions = state.photos
    .filter(p => p.sourceType === "demo")
    .map(p => {
      const orig = DEMO_PHOTOS.find(d => d.id === p.id)
      return p.caption !== orig?.caption ? p.caption : ""
    })
  if (demoCaptions.some(c => c !== "")) {
    params.set("pc", demoCaptions.join("|"))
  }

  // encode URL-based photos
  const urlPhotos = state.photos.filter(p => p.sourceType === "url")
  if (urlPhotos.length > 0) {
    params.set("urls", urlPhotos.map(p => p.src).join("|"))
    params.set("urlcaps", urlPhotos.map(p => p.caption).join("|"))
    // encode types (photo/video) - only if any videos exist
    if (urlPhotos.some(p => p.type === "video")) {
      params.set("urltypes", urlPhotos.map(p => p.type === "video" ? "v" : "p").join(""))
    }
  }

  return params.toString()
}

export function decodeCardFromURL(searchString) {
  const params = new URLSearchParams(searchString)

  const greetingIdx = parseInt(params.get("g") || "0", 10)

  // reconstruct photos
  const photos = []
  const demoIndices = (params.get("p") || "0,1,2,3,4").split(",").map(Number)
  const demoCaptions = params.get("pc")?.split("|") || []

  demoIndices.forEach((idx, i) => {
    if (idx >= 0 && idx < DEMO_PHOTOS.length) {
      const demo = DEMO_PHOTOS[idx]
      photos.push({
        ...demo,
        caption: demoCaptions[i] || demo.caption,
      })
    }
  })

  // URL-based photos
  const urls = params.get("urls")?.split("|") || []
  const urlCaptions = params.get("urlcaps")?.split("|") || []
  const urlTypes = params.get("urltypes") || ""
  urls.forEach((src, i) => {
    if (src) {
      photos.push({
        id: 1000 + i,
        src,
        caption: urlCaptions[i] || "",
        sourceType: "url",
        type: urlTypes[i] === "v" ? "video" : "photo",
      })
    }
  })

  return {
    name: params.get("n") || "Alex",
    greeting: GREETINGS[greetingIdx] || GREETINGS[0],
    subMessage: params.get("m") || "Wishing you all the joy in the world today 🌈",
    themeId: params.get("t") || "candy",
    fontId: params.get("f") || "boogaloo",
    emojiSetId: params.get("e") || "party",
    showCaptions: params.get("cap") !== "0",
    showThumbs: params.get("th") !== "0",
    roundedCorners: params.get("rc") !== "0",
    autoPlay: params.get("ap") === "1",
    autoPlaySecs: parseInt(params.get("as") || "3", 10),
    photos,
  }
}

export function getLocalPhotoCount(photos) {
  return photos.filter(p => p.sourceType === "local").length
}
