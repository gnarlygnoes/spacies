export class Settings {
  keys = {
    left: {
      pressed: false
    },
    right: {
      pressed: false
    },
    shoot: {
      pressed: false
    },
    pause: {
      active: false
    }
  }

  moveLeft = 'a'
  moveRight = 'd'
  shoot = ' '
  pause = 'p'
  unpause = 'Enter'

  handleInputs() {
    window.addEventListener("keydown", (e) => {
      if (e.key === this.moveLeft || e.key === 'ArrowLeft') {
        this.keys.left.pressed = true
      }
      else if (e.key === this.moveRight || e.key === 'ArrowRight') {
        this.keys.right.pressed = true
      }
      if (e.key === this.shoot) {
        this.keys.shoot.pressed = true
      }
      console.log(e)
    })

    window.addEventListener("keypress", (e) => {
      if (e.key === this.pause) {
        if (!this.keys.pause.active) {
          this.keys.pause.active = true
        }
      }
      if (e.key === this.unpause) {
        if (this.keys.pause.active) {
          this.keys.pause.active = false
        }
      }
    })

    window.addEventListener("keyup", (e) => {
      if (e.key === this.moveLeft || e.key === 'ArrowLeft') {
        this.keys.left.pressed = false
      }
      if (e.key === this.moveRight || e.key === 'ArrowRight') {
        this.keys.right.pressed = false
      }
      if (e.key === this.shoot) {
        this.keys.shoot.pressed = false
      }
    })
  }
}
