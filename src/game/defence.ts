import { Rec } from "./player";

export interface Defence {
  rec: Rec
  health: number
  alive: boolean
}

export function makeDefence(x: number, y: number, w: number, h: number): Defence {
  let rec: Rec = {
    x, y, w, h
  }

  let d: Defence = {
    rec,
    health: 10,
    alive: true
  }

  return d
}
