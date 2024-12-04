import { Enemy } from "./game/enemies"
import { Player } from "./game/player"

export class Game {
  player = new Player
  //enemies: Enemy[][] = [[new Enemy]]
  //enemies = Array() as Enemy[][]
  enemies: Enemy[][] = [[new Enemy]]

  initEnemies() {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 10; j++) {
        let e: Enemy = new Enemy
        e.rec.x = j * 50
        e.rec.y = i * 50
        this.enemies[i].push(e)
        //this.enemies[i][j].rec.x = j
        //this.enemies[i][j].rec.y = i
      }
      this.enemies.push([new Enemy])
    }
    console.log("num rows: " + this.enemies[0].length)
  }


  constructor(public ctx: CanvasRenderingContext2D) {
    this.player.rec.x = ctx.canvas.width / 2 - this.player.rec.w / 2
    this.player.rec.y = ctx.canvas.height - this.player.rec.h - 2

    this.initEnemies()
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
    this.player.update(dt, this.ctx.canvas.width, this.ctx.canvas.height)

    this.draw()
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

    this.drawPlayer()
    this.drawEnemies()
  }

  drawPlayer() {
    const { x, y, w, h } = this.player.rec
    this.ctx.fillStyle = 'darkgreen'
    this.ctx.beginPath()
    this.ctx.rect(x, y, w, h)
    this.ctx.fill()
  }

  drawEnemies() {
    for (let row in this.enemies) {
      for (let col in this.enemies[row]) {
        const { x, y, w, h } = this.enemies[row][col].rec
        this.ctx.fillStyle = 'red'
        this.ctx.beginPath()
        this.ctx.rect(x, y, w, h)
        this.ctx.fill()
      }
    }
  }
}

