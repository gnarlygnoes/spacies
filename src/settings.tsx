import { CurrentScreen } from "./main";
import { clickMeText } from "./App";

export default function Settings(props: {
  setScreen: (screen: CurrentScreen) => void;
}) {
  const { setScreen } = props;

  return (
    <>
      <h2>There are no settings rofl. This is just a spacies game...</h2>

      <button
        onClick={() => {
          setScreen("start");
        }}
      >
        {clickMeText}
      </button>
    </>
  );
}
