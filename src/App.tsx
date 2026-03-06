import { useGameStore } from "./store/useGameStore";
import { MainMenu } from "./components/Screens/MainMenu";
import { GameScreen } from "./components/Screens/GameScreen";
import { OptionsMenu } from "./components/Screens/OptionsMenu";

function App() {
  const currentScreen = useGameStore((state) => state.currentScreen);

  return (
    <>
      {currentScreen === "main_menu" && <MainMenu />}
      {currentScreen === "game" && <GameScreen />}
      {currentScreen === "options" && <OptionsMenu />}
    </>
  );
}

export default App;
