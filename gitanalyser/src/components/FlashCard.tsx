import { Screen } from "@/types";
import { AuthScreen } from "./screens/AuthScreen";
import { LoadingScreen } from "./screens/LoadingScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { MultiResultScreen } from "./screens/MultiResultScreen";
import { useEffect, useState } from "react";
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
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const BACKEND_URL =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://sesd-project-sem4.vercel.app";

        // console.log(`[AUTH] Checking session at ${BACKEND_URL}/api/me`);

        const res = await fetch(`${BACKEND_URL}/api/me`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

        // Prevention for 404 HTML pages being parsed as JSON
        if (!res.ok) {
          console.error(`[AUTH] Backend returned ${res.status}`);
          return;
        }

        const userData = await res.json();

        if (userData.loggedIn && userData.user) {
          console.log("[AUTH] Logged in as", userData.user.login);
          setData(userData.user);
          setScreen("LOADING");
        }
      } catch (err) {
        console.error("[AUTH] Check failed:", err);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [setData, setScreen]);

  if (isChecking) {
    return (
      <div className="w-full h-full bg-[#eae6dc] flex items-center justify-center font-mono text-sm tracking-widest animate-pulse">
        [INITIALIZING_HANDSHAKE...]
      </div>
    );
  }
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
