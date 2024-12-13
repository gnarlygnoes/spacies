import { Settings } from "./settings"

export interface Rec {
  x: number, y: number, w: number, h: number
}

type Direction = 'left' | 'right' | 'none'

export class Player {
  rec: Rec = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  }

  dir: Direction = "none"

  shooting = false
  reloading = false
  curReloadTime = 0
  reloadTime = .6

  health = 3



  movePlayer(dt: number, screenWidth: number, screenHeight: number, settings: Settings) {
    if (settings.keys.left.pressed) {
      this.dir = 'left'
    } else if (settings.keys.right.pressed) {
      this.dir = 'right'
    } else {
      this.dir = 'none'
    }

    if (this.dir === 'right') {
      this.rec.x += (screenWidth) * dt
    }
    if (this.dir === 'left') {
      this.rec.x -= (screenWidth) * dt
    }

    if (this.rec.x + this.rec.w > screenWidth) {
      this.rec.x = screenWidth - this.rec.w
    }
    if (this.rec.x < 0) {
      this.rec.x = 0
    }

    this.rec.y = screenHeight - this.rec.h - 10
  }

  shoot() {
    this.shooting = true
  }

  updateShooter(dt: number, settings: Settings) {
    if (this.shooting) {
      this.shooting = false
    }
    if (settings.keys.shoot.pressed && !this.reloading) {
      this.shoot()
      this.reloading = true
    }

    if (this.reloading) {
      this.curReloadTime += dt
    }

    if (this.curReloadTime > this.reloadTime) {
      this.reloading = false
      this.curReloadTime = 0
    }
  }

  update(dt: number, screenWidth: number, screenHeight: number, settings: Settings) {
    this.movePlayer(dt, screenWidth, screenHeight, settings)
    this.updateShooter(dt, settings)
  }
}
