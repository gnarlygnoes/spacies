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
    }
  }

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
}
