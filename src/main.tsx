//import * as React from 'react'
import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Menu from './App.tsx'
import { initAndGetCanvas } from './canvas.ts'
import { Game } from './game.ts'
import Settings from './settings.tsx'
// import { initAndGetCanvas } from './canvas'

createRoot(document.getElementById('root')!).render(<GameUI />)

export type CurrentScreen = 'start' | 'game' | 'settings'

function GameUI() {
  const [screen, setScreen] = useState<CurrentScreen>('start')

  useEffect(() => {
    if (screen === 'game') {
      const canvas = initAndGetCanvas()
      const game = new Game(canvas)
      game.initGame()
    }
  }, [screen])

  if (screen === 'start') {
    return <Menu setScreen={setScreen} />
  }

  if (screen === 'settings') {
    return <Settings setScreen={setScreen} />
  }

  return (
    //<StrictMode>
    //  <App />
    //</StrictMode>
    //<div className='main'>
    <div className="canvas-container">
      <canvas id="canvas" />
    </div>
    //</div>
  )
}
