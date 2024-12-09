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
  enemies: Enemy[][] = [[]]
  pBullet: Bullet = {
    id: 0,
    r: 0,
    x: 0,
    y: 0,
  }

  pBullets = new Map()

  time = 0
  enemyDir = 1
  enemyDrop = false
  enemyShootTimer = 2
  curShootTime = 0

  initPlayer() {
    let w = this.ctx.canvas.width / 15
    let h = this.ctx.canvas.height / 15
    let x = this.ctx.canvas.width / 2 - w / 2
    let y = this.ctx.canvas.height - h - 2


    this.player.rec = {
      x: x,
      y: y,
      w: w,
      h: h,
    }
  }

  initPlayerBullet() {
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
    let rows = 5
    let cols = 10
    let alive = 0

    for (let i = 1; i < rows; i++) {
      this.enemies.push([])
    }
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let e: Enemy = new Enemy
        e.rec.w = this.ctx.canvas.width / 16
        e.rec.h = this.ctx.canvas.height / 16
        e.rec.x = j * (e.rec.w + 10)
        e.rec.y = i * (e.rec.h + 10)
        this.enemies[i].push(e)
        alive++
      }
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
    this.whoCanShoot()

    this.draw()
  }

  updatePlayerBullets(dt: number) {
    if (this.player.shooting) {
      this.initPlayerBullet()
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
    this.curShootTime += dt
    if (this.time > 1) {
      this.time = 0
      this.moveEnemies()
    }

    if (this.curShootTime > this.enemyShootTimer) {
      this.shoot()

      this.enemyShootTimer = Math.random() * 2.0 + 1
      console.log("New shoot timer: " + this.enemyShootTimer)
      this.curShootTime = 0
    }


    this.removeTheDead()
  }

  removeTheDead() {
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

  moveEnemies() {
    for (let row of this.enemies) {
      for (let e of row) {
        e.rec.x += this.ctx.canvas.width / 32 * this.enemyDir
        if (this.enemyDrop) {
          e.rec.y += this.ctx.canvas.height / 32
        }
      }
    }
    this.enemyDrop = false
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      for (let j = this.enemies[i].length - 1; j >= 0; j--) {
        if (this.enemies[i][j].alive) {
          if (this.enemies[i][j].rec.x + this.enemies[i][j].rec.w > this.ctx.canvas.width - this.ctx.canvas.width / 32) {
            this.enemyDir = -1
            this.enemyDrop = true
          }
        }
      }
    }
    for (let i = 0; i < this.enemies.length; i++) {
      for (let j = 0; j < this.enemies[i].length; j++) {
        if (this.enemies[i][j].alive) {
          if (this.enemies[i][j].rec.x < this.ctx.canvas.width / 32) {
            this.enemyDir = 1
            this.enemyDrop = true
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

  whoCanShoot() {
    let rows = this.enemies.length
    let cols = this.enemies[0].length

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        for (let k = 1; k < rows + 1; k++) {
          if (this.enemies[rows - k][j].alive) {
            this.enemies[rows - k][j].colour = 'blue'
            this.enemies[rows - k][j].canShoot = true
            break
          }
        }
      }
    }
  }

  shoot() {
    let numCanShoot = 0
    for (let row of this.enemies) {
      for (let enemy of row) {
        if (enemy.canShoot) {
          numCanShoot++
        }
      }
    }

    let randNum = Math.floor(Math.random() * numCanShoot)

    let counter = 0
    for (let row of this.enemies) {
      for (let enemy of row) {
        if (enemy.canShoot) {
          counter++
        }
        if (counter === randNum) {
          console.log("Enemy at " + enemy.rec.x + " goes bang!")
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
          this.ctx.fillStyle = enemy.colour
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
