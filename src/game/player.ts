interface Rec {
  x: number, y: number, w: number, h: number
}

type Direction = 'left' | 'right' | 'none'

export class Player {
  rec: Rec = {
    x: 0,
    y: 0,
    w: 60,
    h: 80,
  }

  dir: Direction = "none"

  keys = {
    left: {
      pressed: false
    },
    right: {
      pressed: false
    },
  }

  handleInputs() {
    window.addEventListener("keydown", (e) => {
      if (e.key === 'a') {
        this.keys.left.pressed = true
      }
      else if (e.key === 'd') {
        this.keys.right.pressed = true
      }
    })
    window.addEventListener("keyup", (e) => {
      if (e.key === 'a') {
        this.keys.left.pressed = false
      }
      if (e.key === 'd') {
        this.keys.right.pressed = false
      }
    })
  }

  update(dt: number) {
    this.handleInputs()

    if (this.keys.left.pressed) {
      this.dir = 'left'
    } else if (this.keys.right.pressed) {
      this.dir = 'right'
    } else {
      this.dir = 'none'
    }

    if (this.dir === 'right') {
      this.rec.x += 1000 * dt
    }
    if (this.dir === 'left') {
      this.rec.x -= 1000 * dt
    }
  }
}
