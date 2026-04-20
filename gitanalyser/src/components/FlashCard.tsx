import { Screen } from "@/types";
import { AuthScreen } from "./screens/AuthScreen";
import { LoadingScreen } from "./screens/LoadingScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { MultiResultScreen } from "./screens/MultiResultScreen";
import { useEffect } from "react";
interface FlashCardProps {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  setData: (data: any) => void;
  data: any;
}

export function FlashCard({
  screen,
  setScreen,
  setData,
  data,
}: FlashCardProps) {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://sesd-project-sem4.vercel.app";
        const res = await fetch(`${BACKEND_URL}/api/me`, {
          credentials: "include",
        });

        const userData = await res.json();

        if (userData.loggedIn) {
          // ✅ user is logged in → go to loading
          setData(userData);
          setScreen("LOADING");
        }
        // If not logged in, stay on AUTH screen (do nothing)
      } catch (err) {
        console.log("Auth check failed, staying on AUTH");
      }
    };

    checkAuth();
  }, []);
  return (
    <div className="w-full h-full relative z-10 flex">
      {screen === "AUTH" && <AuthScreen setScreen={setScreen} />}
      {screen === "LOADING" && (
        <LoadingScreen setScreen={setScreen} setData={setData} data={data} />
      )}
      {screen === "RESULT" && (
        <ResultScreen data={data} setScreen={setScreen} />
      )}
      {screen === "MULTI_RESULT" && <MultiResultScreen />}
    </div>
  );
}
