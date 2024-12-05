import { Enemy } from "./game/enemies"
import { Player, Rec } from "./game/player"

interface Bullet {
  id: number
  r: number
  x: number
  y: number
}

export class Game {
  player = new Player
  //enemies: Enemy[][] = [[new Enemy]]
  //enemies = Array() as Enemy[][]
  enemies: Enemy[][] = [[new Enemy]]
  pBullet: Bullet = {
    id: 0,
    r: 0,
    x: 0,
    y: 0,
  }

  pBullets = new Map()

  time = 0

  initPlayer() {
    this.player.rec = {
      x: this.ctx.canvas.width / 2 - this.player.rec.w / 2,
      y: this.player.rec.y = this.ctx.canvas.height - this.player.rec.h - 2,
      w: this.ctx.canvas.width / 15,
      h: this.ctx.canvas.height / 15,
    }
  }

  initPlayerBullets() {
    if (this.player.shooting) {

      this.pBullet = {
        id: this.pBullet.id + 1,
        r: 5,
        x: this.player.rec.x + this.player.rec.w / 2 - this.pBullet.r / 2,
        y: this.player.rec.y,
      }
      this.pBullets.set(this.pBullet.id, this.pBullet)
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
    this.updatePlayerBullets(dt)
    this.handleCollisions()

    this.draw()
  }

  updatePlayerBullets(dt: number) {
    if (this.player.shooting) {
      this.initPlayerBullets()
    }

    for (let [id, bullet] of this.pBullets) {
      bullet.y -= 1000 * dt

      if (bullet.y < -5) {
        //this.deleteBullet()
        this.pBullets.delete(id)
      }
    }
  }

  updateEnemies(dt: number) {
    this.time += dt
    if (this.time > 1) {
      this.time = 0
    }

    for (let row of this.enemies) {
      for (let e of row) {
        if (!e.alive) {
          e.rec = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
          }
        }
      }
    }
  }

  handleCollisions() {
    for (let [id, bullet] of this.pBullets) {
      for (let row of this.enemies) {
        for (let e of row) {
          let bulletRec: Rec = {
            x: bullet.x,
            y: bullet.y,
            w: bullet.r,
            h: bullet.r
          }

          if (doesItCrash(e.rec, bulletRec)) {
            this.pBullets.delete(id)
            e.alive = false
          }
        }
      }
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
    for (let [_, bullet] of this.pBullets) {
      const { x, y, r } = bullet
      this.ctx.fillStyle = 'yellow'
      this.ctx.beginPath()
      this.ctx.rect(x, y, r, r)
      this.ctx.fill()
    }
  }

  drawEnemies() {
    for (let row of this.enemies) {
      for (let enemy of row) {
        if (enemy.alive) {
          const { x, y, w, h } = enemy.rec
          this.ctx.fillStyle = 'red'
          this.ctx.beginPath()
          this.ctx.rect(x, y, w, h)
          this.ctx.fill()
        }
      }
    }
  }
}

function doesItCrash(rec1: Rec, rec2: Rec): boolean {
  if ((rec1.y < rec2.y + rec2.h && rec1.y + rec1.h > rec2.y) && (rec1.x < rec2.x + rec2.w && rec1.x + rec1.w > rec2.x)) {
    return true
  }

  return false
}
