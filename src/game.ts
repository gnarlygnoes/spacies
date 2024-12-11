import { Star, StarField } from "./game/background"
import { Defence, makeDefence } from "./game/defence"
import { Enemy, makeEnemy, removeTheDead } from "./game/enemies"
import { Player, Rec } from "./game/player"
import { Bullet } from "./game/weapon"

export class Game {
  stars: Star[] = []
  player = new Player
  enemies: Enemy[][] = [[]]
  defences = new Map()
  defId = 0

  pBullets = new Map()
  eBullets = new Map()
  pId = 0
  eId = 0

  time = 0
  enemyDir = 1
  enemyDrop = false
  enemyShootTimer = 2
  curShootTime = 0

  // Settings and gamestate
  gamePaused = false
  fireRate = 1
  playerScore = 0
  speed = 1

  initStars() {
    this.stars = StarField(this.ctx.canvas.width, this.ctx.canvas.height, 900)
  }

  initPlayer() {
    let w = this.ctx.canvas.height / 17
    let h = this.ctx.canvas.height / 17
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
      let r = 5
      let bullet: Bullet = {
        r,
        x: this.player.rec.x + this.player.rec.w / 2 - r / 2,
        y: this.player.rec.y,
      }
      this.pBullets.set(this.pId, bullet)
      this.pId++
    }
  }

  initEnemies() {
    let rows = 5
    let cols = 10
    let alive = 0
    let w = this.ctx.canvas.height / 17
    let h = this.ctx.canvas.height / 17

    for (let i = 1; i < rows; i++) {
      this.enemies.push([])
    }
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let e: Enemy = makeEnemy(j * (w + 10), i * (h + 10), w, h)
        this.enemies[i].push(e)
        alive++
      }
    }
  }

  initEnemyBullet(e: Enemy) {
    let r = 3
    let b: Bullet = {
      r,
      x: e.rec.x + e.rec.w / 2 - r / 2,
      y: e.rec.y + e.rec.h
    }
    this.eBullets.set(this.eId, b)
    this.eId++
  }

  initDefences() {
    let w = this.ctx.canvas.width / 8
    let h = this.ctx.canvas.width / 8
    let y = this.ctx.canvas.height - this.ctx.canvas.height / 4

    for (let i = 0; i < 4; i++) {
      const defence: Defence = makeDefence((2 * i * w) + 30, y, w, h)
      this.defences.set(this.defId, defence)
      this.defId++

      //this.defences.push(makeDefence((2 * i * w) + 30, y, w, h))
    }
  }

  constructor(public ctx: CanvasRenderingContext2D) {
    this.initStars()
    this.initPlayer()
    this.initEnemies()
    this.initDefences()
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

  setSpeed() {
    if (this.playerScore < 1000)
      this.speed = 0.8
    else if (this.playerScore >= 1000 && this.playerScore < 2000)
      this.speed = .7
    else if (this.playerScore >= 2000 && this.playerScore < 3000)
      this.speed = .5
    else if (this.playerScore >= 3000 && this.playerScore < 4000)
      this.speed = .4
    else if (this.playerScore >= 4000 && this.playerScore < 4900)
      this.speed = .3
    else if (this.playerScore >= 4900)
      this.speed = .06
  }

  update(dt: number) {
    if (!this.gamePaused) {
      this.player.update(dt, this.ctx.canvas.width, this.ctx.canvas.height)
      this.updateEnemies(dt)
      this.updateBullets(dt)
      this.handleCollisions()
      this.whoCanShoot()
      this.updateDefences()

      this.setSpeed()
      if (this.player.health = 0) {
        console.log("Game Over lmao")
      }
    }

    this.draw()
  }

  updateBullets(dt: number) {
    if (this.player.shooting) {
      this.initPlayerBullet()
    }

    for (let [id, bullet] of this.pBullets) {
      bullet.y -= this.ctx.canvas.height * dt

      if (bullet.y < -5) {
        //this.deleteBullet()
        this.pBullets.delete(id)
      }
    }

    for (let [id, bullet] of this.eBullets) {
      bullet.y += this.ctx.canvas.height * dt

      if (bullet.y > this.ctx.canvas.height + 5) {
        this.eBullets.delete(id)
      }
    }
  }

  updateEnemies(dt: number) {
    this.time += dt
    this.curShootTime += dt
    if (this.time > this.speed) {
      this.time = 0
      this.moveEnemies()
    }

    if (this.curShootTime > this.enemyShootTimer) {
      this.shoot()

      this.enemyShootTimer = (Math.random() * 2 + 2) * this.speed
      this.curShootTime = 0
    }

    removeTheDead(this.enemies)
  }

  moveEnemies() {
    for (let row of this.enemies) {
      for (let e of row) {
        e.rec.x += this.ctx.canvas.width / 64 * this.enemyDir
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
            if (this.enemies[i][j].canShoot && this.enemies[i][j].rec.y < this.ctx.canvas.height - this.ctx.canvas.height / 3 - this.enemies[i][j].rec.h)
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
            if (this.enemies[i][j].canShoot && this.enemies[i][j].rec.y < this.ctx.canvas.height - this.ctx.canvas.height / 3 - this.enemies[i][j].rec.h)
              this.enemyDrop = true
          }
        }
      }
    }
  }

  updateDefences() {
    for (let [id, defence] of this.defences) {
      if (defence.health <= 0) {
        this.defences.delete(id)
      }
    }
  }

  handleCollisions() {
    for (let [id, bullet] of this.pBullets) {
      let bulletRec: Rec = {
        x: bullet.x,
        y: bullet.y,
        w: bullet.r,
        h: bullet.r
      }
      for (let row of this.enemies) {
        for (let e of row) {


          if (doesItCrash(e.rec, bulletRec)) {
            this.pBullets.delete(id)
            e.alive = false
            this.playerScore += 100
          }
        }
      }
      for (let [_, defence] of this.defences) {
        if (doesItCrash(defence.rec, bulletRec)) {
          this.pBullets.delete(id)
          defence.health--
        }
      }
    }

    for (let [id, bullet] of this.eBullets) {
      let bulletRec: Rec = {
        x: bullet.x,
        y: bullet.y,
        w: bullet.r,
        h: bullet.r,
      }

      if (doesItCrash(this.player.rec, bulletRec)) {
        this.eBullets.delete(id)
        this.player.health--
      }

      for (let [_, defence] of this.defences) {
        if (doesItCrash(defence.rec, bulletRec)) {
          this.eBullets.delete(id)
          defence.health--
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
          if (!this.enemies[rows - k][j].alive) {
            this.enemies[rows - k][j].canShoot = false
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
        if (counter === randNum && enemy.canShoot) {
          this.initEnemyBullet(enemy)
          console.log(counter)
        }
        if (enemy.canShoot) {
          counter++
        }

      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.drawStars()

    this.drawPlayer()
    this.drawEnemies()
    this.drawDefences()

    this.drawBullets()
  }

  drawStars() {

    for (let star of this.stars) {
      this.ctx.fillStyle = `rgb(${star.colour.r}
                                ${star.colour.g}
                                ${star.colour.b}`
      this.ctx.beginPath()
      this.ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI)
      this.ctx.fill()
    }
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

    for (let [_, bullet] of this.eBullets) {
      const { x, y, r } = bullet
      this.ctx.fillStyle = 'lightgreen'
      this.ctx.beginPath()
      this.ctx.arc(x, y, r, 0, 2 * Math.PI)
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

  drawDefences() {
    for (let [_, defence] of this.defences) {
      if (defence.alive) {
        const { x, y, w, h } = defence.rec
        this.ctx.fillStyle = 'grey'
        this.ctx.beginPath()
        this.ctx.rect(x, y, w, h)
        this.ctx.fill()
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
