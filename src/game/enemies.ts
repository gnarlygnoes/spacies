import { Rec } from "./player";

export class Enemy {
  rec: Rec = {
    x: 0,
    y: 0,
    w: 0,
    h: 0
  }
  alive: boolean = true
  colour = 'red'
  canShoot = false
}
