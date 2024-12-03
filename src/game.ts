type Direction = 'left' | 'right' | 'none'



export class Game {
  player = new Player()

  constructor(public ctx: CanvasRenderingContext2D) {
    this.player.rec.x = ctx.canvas.width / 2 - this.player.rec.w / 2
    this.player.rec.y = ctx.canvas.height - this.player.rec.h - 2
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
    this.player.update(dt)

    console.log(dt)



    this.draw()
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

    this.drawPlayer()
  }

  drawPlayer() {
    const { x, y, w, h } = this.player.rec
    this.ctx.fillStyle = 'darkgreen'
    this.ctx.beginPath()
    this.ctx.rect(x, y, w, h)
    this.ctx.fill()
  }
}

class Player {
  rec: Rec = {
    x: 0,
    y: 0,
    w: 60,
    h: 80,
  }

  dir: Direction = "none"

  keys = {
    a: {
      pressed: false
    },
    d: {
      pressed: false
    },
  }

  handleInputs() {
    window.addEventListener("keydown", (e) => {
      if (e.key === 'a') {
        this.keys.a.pressed = true
      }
      else if (e.key === 'd') {
        this.keys.d.pressed = true
      }
    })
    window.addEventListener("keyup", (e) => {
      if (e.key === 'a') {
        this.keys.a.pressed = false
      }
      if (e.key === 'd') {
        this.keys.d.pressed = false
      }
    })
  }

  update(dt: number) {
    this.handleInputs()

    if (this.keys.a.pressed) {
      this.dir = 'left'
    } else if (this.keys.d.pressed) {
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

interface Rec {
  x: number
  y: number
  w: number
  h: number
}

