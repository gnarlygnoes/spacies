import { Rec } from "./player";

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

export function moveEnemies(enemies: Enemy[][], c: CanvasRenderingContext2D, dir: number, drop: boolean) {
  let hStep = c.canvas.width / 32
  let vStep = c.canvas.height / 32

  for (let row of enemies) {
    for (let e of row) {
      e.rec.x += hStep * dir
      if (drop) {
        e.rec.y += vStep
      }
    }
  }
  drop = false

  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = enemies[i].length - 1; j >= 0; j--) {
      if (enemies[i][j].alive) {
        if (enemies[i][j].rec.x + enemies[i][j].rec.w > c.canvas.width - hStep) {
          dir = -1
          drop = true
        }
      }
    }
  }
  for (let i = 0; i < enemies.length; i++) {
    for (let j = 0; j < enemies[i].length; j++) {
      if (enemies[i][j].alive) {
        if (enemies[i][j].rec.x < hStep) {
          dir = 1
          drop = true
        }
      }
    }
  }
}
