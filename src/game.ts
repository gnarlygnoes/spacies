import { Star, StarField } from "./game/background"
import { Defence, makeDefence } from "./game/defence"
import { Enemy, makeEnemy, removeTheDead } from "./game/enemies"
import { GameState } from "./game/gamestate"
import { Player, Rec } from "./game/player"
import { Settings } from "./game/settings"
import { Bullet } from "./game/weapon"

export class Game {
  gameTexture = new Image
  shift = 0
  frameWidth = 0
  frameHeight = 0
  totalFrames = 0
  currentFrame = 0

  settings: Settings = new Settings

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
  animTime = .5
  curAnimTime = 0
  state = true

  enemyDir = 1
  enemyDrop = false
  enemyShootTimer = 2
  curShootTime = 0

  // Settings and gamestate
  gamestate = GameState.Active
  fireRate = 1
  playerScore = 0
  speed = 1
  bulletBuffer = 6
  onScreenBullets = 0

  loadTexture() {
    this.gameTexture.src = './img/SpaceInvaders.png'

    this.shift = 0
    this.frameWidth = 16
    this.frameHeight = 16
    this.totalFrames = 35
    this.currentFrame = 0
  }

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
    let w = this.ctx.canvas.width / 6
    let h = this.ctx.canvas.width / 12
    let y = this.ctx.canvas.height - this.ctx.canvas.height / 4

    for (let i = 0; i < 4; i++) {
      const defence: Defence = makeDefence((1.5 * i * w) + (35 / 854) * this.ctx.canvas.width, y, w, h)
      this.defences.set(this.defId, defence)
      this.defId++
    }
  }

  constructor(public ctx: CanvasRenderingContext2D) {
    this.loadTexture()
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
      this.speed = .35
    else if (this.playerScore >= 4000 && this.playerScore < 4900)
      this.speed = .2
    else if (this.playerScore >= 4900)
      this.speed = .06
  }

  update(dt: number) {
    if (this.gamestate === GameState.Paused) {
      if (!this.settings.keys.pause.active) {
        this.gamestate = GameState.Active
      }
    }


    if (this.gamestate === GameState.Active) {
      if (this.settings.keys.pause.active) {
        this.gamestate = GameState.Paused
      }
      this.player.update(dt, this.ctx.canvas.width, this.ctx.canvas.height, this.settings)
      this.updateEnemies(dt)
      this.updateBullets(dt)
      this.handleCollisions()
      this.whoCanShoot()
      this.updateDefences()

      this.setSpeed()
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
    this.curAnimTime += dt
    if (this.curAnimTime >= this.animTime) {
      if (this.state) {
        this.state = false
      } else {
        this.state = true
      }

      this.curAnimTime = 0
    }
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
      for (let defence of this.defences.values()) {
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

      for (let defence of this.defences.values()) {
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
        }
        if (enemy.canShoot) {
          counter++
        }

      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    //this.ctx.fillStyle = 'black'
    //this.ctx.fill()
    this.drawStars()

    this.drawPlayer()
    this.drawEnemies()
    this.drawDefences()

    this.drawBullets()

  }

  drawFrame(sx: number, sy: number, rec: Rec) {
    this.ctx.drawImage(this.gameTexture, sx * 16, sy * 16, 16, 16, rec.x, rec.y, rec.w, rec.h)
  }

  drawDefence(sy: number, rec: Rec) {
    this.ctx.drawImage(this.gameTexture, 48, sy * 16, 32, 16, rec.x, rec.y, rec.w, rec.h)
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
    this.drawFrame(4, 0, this.player.rec)
  }

  drawBullets() {
    for (let bullet of this.pBullets.values()) {
      const { x, y, r } = bullet
      this.ctx.fillStyle = 'yellow'
      this.ctx.beginPath()
      this.ctx.rect(x, y, r, r)
      this.ctx.fill()
    }

    for (let bullet of this.eBullets.values()) {
      const { x, y, r } = bullet
      this.ctx.fillStyle = 'lightgreen'
      this.ctx.beginPath()
      this.ctx.arc(x, y, r, 0, 2 * Math.PI)
      this.ctx.fill()
    }
  }

  drawEnemies() {
    for (let i = 0; i < this.enemies.length; i++) {
      for (let j = 0; j < this.enemies[i].length; j++) {
        if (this.enemies[i][j].alive) {
          if (this.state)
            this.drawFrame(0, i, this.enemies[i][j].rec)
          else
            this.drawFrame(1, i, this.enemies[i][j].rec)
        }
      }
    }
  }

  drawDefences() {
    for (let defence of this.defences.values()) {
      if (defence.alive) {
        if (defence.health >= 8) {
          this.drawDefence(1, defence.rec)
        } else if (defence.health >= 6 && defence.health < 8) {
          this.drawDefence(2, defence.rec)
        } else if (defence.health >= 4 && defence.health < 6) {
          this.drawDefence(3, defence.rec)
        } else if (defence.health >= 2 && defence.health < 4) {
          this.drawDefence(4, defence.rec)
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
