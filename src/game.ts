import { Enemy } from "./game/enemies"
import { Player } from "./game/player"

interface Bullet {
  x: number
  y: number
  r: number
  active: boolean
}

export class Game {
  player = new Player
  //enemies: Enemy[][] = [[new Enemy]]
  //enemies = Array() as Enemy[][]
  enemies: Enemy[][] = [[new Enemy]]
  pBullet: Bullet = {
    x: 0,
    y: 0,
    r: 0,
    active: false
  }

  time = 0

  initPlayer() {
    this.player.rec = {
      x: this.ctx.canvas.width / 2 - this.player.rec.w / 2,
      y: this.player.rec.y = this.ctx.canvas.height - this.player.rec.h - 2,
      w: this.ctx.canvas.width / 15,
      h: this.ctx.canvas.height / 15,
    }
  }

  initEnemies() {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 10; j++) {
        let e: Enemy = new Enemy
        e.rec.w = this.ctx.canvas.width / 16
        e.rec.h = this.ctx.canvas.height / 16
        e.rec.x = j * (e.rec.w + 10)
        e.rec.y = i * (e.rec.h + 10)
        this.enemies[i].push(e)
        //this.enemies[i][j].rec.x = j
        //this.enemies[i][j].rec.y = i
      }
      this.enemies.push([new Enemy])
    }
  }

  constructor(public ctx: CanvasRenderingContext2D) {
    this.initPlayer()
    this.initEnemies()
  }

  initGame() {
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
    this.updateEnemies(dt)

    if (this.player.shooting) {
      this.pBullet = {
        x: this.player.rec.x + this.player.rec.w / 2,
        y: this.player.rec.y,
        r: 5,
        active: true
      }
      this.player.shooting = false
    }

    if (this.pBullet.active) {
      this.pBullet.y -= 1000 * dt
    }
    console.log(this.pBullet.y)

    this.draw()
  }

  updateEnemies(dt: number) {
    this.time += dt
    if (this.time > 1) {
      this.time = 0
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

    this.drawPlayer()
    this.drawEnemies()
    this.drawBullets()
  }

  drawPlayer() {
    const { x, y, w, h } = this.player.rec
    this.ctx.fillStyle = 'darkgreen'
    this.ctx.beginPath()
    this.ctx.rect(x, y, w, h)
    this.ctx.fill()
  }

  drawBullets() {
    const { x, y, r, active } = this.pBullet
    if (active) {
      this.ctx.fillStyle = 'yellow'
      this.ctx.beginPath()
      this.ctx.rect(x, y, r, r)
      this.ctx.fill()
    }
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

