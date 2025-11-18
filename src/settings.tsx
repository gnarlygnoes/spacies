import { CurrentScreen } from './main'
import { clickMeText } from './App'

function Settings(props: { setScreen: (screen: CurrentScreen) => void }) {
  const { setScreen } = props

  return (
    <>
      <h1>Welcome to Spacies!</h1>

      <button onClick={() => {
        setScreen('game')
      }}>{clickMeText}</button>
    </>
  )
}

export default Settings 
