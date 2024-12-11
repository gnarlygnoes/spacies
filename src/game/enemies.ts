import { Direction, Rec } from "./player";

//export class Enemy {
//  rec: Rec = {
//    x: 0,
//    y: 0,
//    w: 0,
//    h: 0
//  }
//  alive: boolean = true
//  colour = 'red'
//  canShoot = false
//}

export interface Enemy {
  rec: Rec
  alive: boolean
  colour: string
  canShoot: boolean
}

export function makeEnemy(x: number, y: number, w: number, h: number): Enemy {
  let rec: Rec = {
    x,
    y,
    w,
    h
  }
  let e: Enemy = {
    rec,
    alive: true,
    colour: 'red',
    canShoot: false
  }
  return e
}

export function removeTheDead(enemies: Enemy[][]) {
  for (let row of enemies) {
    for (let e of row) {
      if (!e.alive) {
        e.rec = {
          x: 0,
          y: 0,
          w: 0,
          h: 0
        }
      }
    }
  }
}

