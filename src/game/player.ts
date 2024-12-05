import { Weapon } from "./weapon"

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

  keys = {
    left: {
      pressed: false
    },
    right: {
      pressed: false
    },
    shoot: {
      pressed: false
    }
  }

  shooting = false
  reloading = false
  bTime = 0
  reloadTime = .2

  handleInputs() {
    window.addEventListener("keydown", (e) => {
      if (e.key === 'a') {
        this.keys.left.pressed = true
      }
      else if (e.key === 'd') {
        this.keys.right.pressed = true
      }
      if (e.key === ' ') {
        this.keys.shoot.pressed = true
      }

      //console.log(e)
    })

    window.addEventListener("keyup", (e) => {
      if (e.key === 'a') {
        this.keys.left.pressed = false
      }
      if (e.key === 'd') {
        this.keys.right.pressed = false
      }
      if (e.key === ' ') {
        this.keys.shoot.pressed = false
      }
    })
  }

  movePlayer(dt: number, screenWidth: number, screenHeight: number) {
    if (this.keys.left.pressed) {
      this.dir = 'left'
    } else if (this.keys.right.pressed) {
      this.dir = 'right'
    } else {
      this.dir = 'none'
    }

    if (this.dir === 'right') {
      this.rec.x += (screenWidth * 1.25) * dt
    }
    if (this.dir === 'left') {
      this.rec.x -= (screenWidth * 1.25) * dt
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

  updateShooter(dt: number) {
    if (this.shooting) {
      this.shooting = false
    }
    if (this.keys.shoot.pressed && !this.reloading) {
      this.shoot()
      this.reloading = true
    }

    if (this.reloading) {
      this.bTime += dt
    }

    if (this.bTime > this.reloadTime) {
      this.reloading = false
      this.bTime = 0
    }
  }

  update(dt: number, screenWidth: number, screenHeight: number) {
    this.handleInputs()
    this.movePlayer(dt, screenWidth, screenHeight)
    this.updateShooter(dt)
  }
}
