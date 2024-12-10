interface Pos {
  x: number
  y: number
}

export interface Bullet {
  r: number
  x: number
  y: number
}

export class Weapon {
  pos: Pos = {
    x: 0,
    y: 0
  }
  weaponLock = false
  time = 0

  constructor() {
    this.pos.x = 0
    this.pos.y = 0
    this.weaponLock = false
    this.time = 0
  }
}
