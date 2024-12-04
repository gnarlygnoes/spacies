interface Pos {
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
}
