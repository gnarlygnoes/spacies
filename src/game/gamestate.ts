import { Game } from '../game'

export enum GameState {
  'Paused',
  'Active',
  'Victorious',
  'Defeated'
}

export function DisplayState(g: Game) {
  console.log(g)
}

//function gamePaused() {
//}
//
//function winScreen() { }
//
//function loseScreen() { }
