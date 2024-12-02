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
  const size = pickSize(innerWidth, innerHeight)

  ctx.canvas.width = size
  ctx.canvas.height = size
}

function pickSize(width: number, height: number): number {
  const maxSize = 1200
  const smallerOne = Math.min(width, height)

  if (smallerOne < maxSize) {
    return smallerOne
  }
  return maxSize
}
