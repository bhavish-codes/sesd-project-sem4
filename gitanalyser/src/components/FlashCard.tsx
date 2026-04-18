import { Screen } from "@/types";
import { AuthScreen } from "./screens/AuthScreen";
import { LoadingScreen } from "./screens/LoadingScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { MultiResultScreen } from "./screens/MultiResultScreen";

interface FlashCardProps {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  setData: (data: any) => void;
  data: any;
}

export function FlashCard({ screen, setScreen, setData, data }: FlashCardProps) {
  return (
    <div className="w-full h-full relative z-10 flex">
      {screen === "AUTH" && <AuthScreen setScreen={setScreen} />}
      {screen === "LOADING" && <LoadingScreen setScreen={setScreen} setData={setData} />}
      {screen === "RESULT" && <ResultScreen data={data} setScreen={setScreen} />}
      {screen === "MULTI_RESULT" && <MultiResultScreen />}
    </div>
  );
}
