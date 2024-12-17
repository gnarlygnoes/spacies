import './App.css'
import { CurrentScreen } from './main'

function App(props: { setScreen: (screen: CurrentScreen) => void }) {
  const { setScreen } = props

  return (
    <main>
      <h1>Welcome to Spacies!</h1>
      <div className='menu'>
        <button className='menu-button' onClick={() => {
          setScreen('game')
        }}>Click me to start the game!</button>

        <button className='menu-button'>Change Settings</button>
      </div>
    </main>
  )
}

export default App