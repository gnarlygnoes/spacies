export function initAndGetCanvas(): CanvasRenderingContext2D {
  const canvas = document.getElementById('canvas')

  if (canvas instanceof HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (ctx) {
      manageCanvas(ctx)
      return ctx
    }
  }
  throw 'Failed to get the canvas element context!'
}

function manageCanvas(ctx: CanvasRenderingContext2D) {
  setCanvasSize(ctx)

  addEventListener('resize', () => {
    setCanvasSize(ctx)
  })
}

function setCanvasSize(ctx: CanvasRenderingContext2D) {
  const height = pickSize(innerWidth, innerHeight)

  ctx.canvas.width = height * .8
  ctx.canvas.height = height
}

function pickSize(width: number, height: number): number {
  const maxHeight = 1200
  const smallerOne = Math.min(width, height)

  if (smallerOne < maxHeight) {
    return smallerOne
  }
  return maxHeight
}
