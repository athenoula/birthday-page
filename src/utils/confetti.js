import confetti from "canvas-confetti"

export const clamp = (v, mn, mx) => Math.min(Math.max(v, mn), mx)

export function fireSideCannons(colors) {
  const end = Date.now() + 2200
  const frame = () => {
    if (Date.now() > end) return
    confetti({ particleCount:3, angle:60,  spread:55, startVelocity:55, origin:{x:0,y:0.65}, colors })
    confetti({ particleCount:3, angle:120, spread:55, startVelocity:55, origin:{x:1,y:0.65}, colors })
    requestAnimationFrame(frame)
  }
  frame()
}

export function fireStars(colors) {
  const d = { spread:360, ticks:60, gravity:0, decay:0.94, startVelocity:25, colors }
  const shoot = () => {
    confetti({ ...d, particleCount:35, scalar:1.2, shapes:["star"] })
    confetti({ ...d, particleCount:10, scalar:0.75, shapes:["circle"] })
  }
  setTimeout(shoot, 0)
  setTimeout(shoot, 120)
  setTimeout(shoot, 250)
}
