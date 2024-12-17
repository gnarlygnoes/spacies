import { CurrentScreen } from './main'

function Settings(props: { setScreen: (screen: CurrentScreen) => void }) {
  const { setScreen } = props

  return (
    <>
      <h1>Welcome to Spacies!</h1>

      <button onClick={() => {
        setScreen('game')
      }}>Click me to start the game!</button>
    </>
  )
}

export default Settings 
