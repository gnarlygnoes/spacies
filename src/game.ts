import { Player } from "./game/player"

export class Game {
  player = new Player

  constructor(public ctx: CanvasRenderingContext2D) {
    this.player.rec.x = ctx.canvas.width / 2 - this.player.rec.w / 2
    this.player.rec.y = ctx.canvas.height - this.player.rec.h - 2
  }

  gameLoop() {
    requestAnimationFrame(this.loop)
  }

  private lastTime = 0
  loop = (time: number) => {
    this.update((time - this.lastTime) / 1000)
    requestAnimationFrame(this.loop)
    this.lastTime = time
  }

  update(dt: number) {
    this.player.update(dt)

    this.draw()
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

    this.drawPlayer()
  }

  drawPlayer() {
    const { x, y, w, h } = this.player.rec
    this.ctx.fillStyle = 'darkgreen'
    this.ctx.beginPath()
    this.ctx.rect(x, y, w, h)
    this.ctx.fill()
  }
}

