import "./App.css";
import { CurrentScreen } from "./main";

export const clickMeText = "Click me!!! Please! PLEEEEAASE!!! CLICK MEEEEE!!";

function Menu(props: { setScreen: (screen: CurrentScreen) => void }) {
  const { setScreen } = props;

  return (
    <main>
      <h1>Welcome to Spacies!</h1>
      <div className="menu">
        <button
          className="menu-button"
          onClick={() => {
            setScreen("game");
          }}
        >
          {clickMeText}
        </button>

        <button className="menu-button" onClick={() => setScreen("settings")}>
          Change Settings
        </button>

        <button className="menu-button">Load Previous Game</button>
      </div>
    </main>
  );
}

export default Menu;
