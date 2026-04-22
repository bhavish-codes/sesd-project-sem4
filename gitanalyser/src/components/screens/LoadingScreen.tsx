import { useEffect, useState } from "react";
import { Screen } from "@/types";

interface Props {
  setScreen: (screen: Screen) => void;
  setData: (data: any) => void;
  data: any;
}

export function LoadingScreen({ setScreen, setData, data }: Props) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const fetchGitHubData = async (username: string) => {
      setLogs(["INITIALIZING INTERCEPTOR...", "SCANNING GITHUB RELAYS..."]);

      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://sesd-project-sem4.vercel.app";
        const res = await fetch(`${API_URL}/api/github/${username}`);

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const rawData = await res.json();
        
        const formattedData = {
          ...rawData.profile,
          avatarUrl: rawData.profile?.avatar,
          username: rawData.profile?.login,
          commits: rawData.contributions?.totalContributions || "0",
          repos: rawData.stats?.totalRepos || "0",
          followers: rawData.stats?.totalFollowers || "0",
          languages: rawData.languages
        };

        

        setLogs((prev) => [...prev, "DATA_PACKETS_RECEIVED.", "DECODING..."]);

        // Artificial delay for premium feel
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setLogs((prev) => [...prev, "DECODING COMPLETE.", "REDIRECTING..."]);

        // Final tiny delay before transition
        // await new Promise((resolve) => setTimeout(resolve, 500));
        setData(formattedData);
        setScreen("RESULT");
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setLogs(["FAILED TO FETCH DATA", "TARGET_LOST."]);
      }
    };

    const username = data?.login || data?.username || "torvalds";
    fetchGitHubData(username);
  }, [setData, setScreen, data]);

  return (
    <div className="w-full h-full flex flex-col bg-[#eae6dc]">
      {/* Header */}
      <div className="border-b-[4px] border-black p-6 flex justify-between items-start shrink-0">
        <div>
          <div className="text-[var(--color-brand-red)] font-bold font-mono tracking-widest text-xs mb-2">
            SIGNAL INTERCEPTION //
          </div>
          <h1 className="text-6xl font-['Playfair_Display',var(--font-serif)] font-bold text-[var(--color-brand-red)] leading-none uppercase">
            Marginal
            <br />
            Extraction
          </h1>
        </div>

        <div className="flex flex-col items-end gap-4">
          <div className="w-24 h-24 absolute top-4 right-4 pointer-events-none opacity-80 animate-spin-slow">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                id="circlePath2"
                d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                fill="transparent"
              />
              <text
                className="text-[12px] font-mono font-bold tracking-widest"
                fill="black"
              >
                <textPath href="#circlePath2">
                  PLEASE WAIT • SC ACQUIRING TARGET •
                </textPath>
              </text>
            </svg>
          </div>
          <div className="mt-16 mr-12 text-xs font-bold font-mono tracking-widest text-gray-700">
            TARGET ALIAS <span className="float-right">[SCANNING...]</span>
          </div>
          <div className="flex border-[3px] border-black bg-white mr-12">
            <div className="px-4 py-2 font-mono text-lg font-bold w-48 text-gray-500 truncate">
              {data?.login || "torvalds"}
            </div>
            <div className="bg-[var(--color-brand-red)] text-white px-6 py-2 font-black font-mono flex items-center justify-center border-l-[3px] border-black uppercase text-lg">
              Busy
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column */}
        <div className="w-1/3 border-r-[4px] border-black flex flex-col p-6 relative">
          {/* Target Square */}
          <div className="w-full aspect-square border-[3px] border-black relative bg-[#e2ddd1] flex items-center justify-center overflow-hidden mb-8">
            <div className="absolute inset-0 bg-grid-pattern opacity-50 block filter brightness-95"></div>
            <div className="w-12 h-12 border-2 border-[var(--color-brand-red)] rounded-full relative z-10 flex items-center justify-center animate-pulse-scale">
              <div className="w-16 h-0.5 bg-[var(--color-brand-red)] absolute"></div>
              <div className="w-0.5 h-16 bg-[var(--color-brand-red)] absolute"></div>
            </div>
          </div>

          {/* Bars */}
          <div className="space-y-3 mb-auto">
            <div className="h-6 bg-black w-full animate-bar"></div>
            <div
              className="h-4 bg-[var(--color-brand-red)] w-2/5 animate-bar"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div className="mt-8 space-y-2">
              <div
                className="h-4 bg-black w-full animate-bar"
                style={{ animationDelay: "0.4s" }}
              ></div>
              <div
                className="h-4 bg-black w-full animate-bar"
                style={{ animationDelay: "0.6s" }}
              ></div>
              <div
                className="h-4 bg-black w-3/5 animate-bar"
                style={{ animationDelay: "0.8s" }}
              ></div>
            </div>
          </div>

          <div className="font-mono text-[10px] text-[var(--color-brand-red)] uppercase leading-relaxed tracking-widest">
            {"> TRACE_ROUTE: 192.168.1.1"}
            <br />
            {"> LATENCY: 12ms"}
            <br />
            {"> PACKET_LOSS: 0%"}
            <br />
            {"> BUFFERING_HEADERS..."}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-2/3 flex flex-col p-6">
          {/* Top pending boxes */}
          <div className="flex gap-4 border-[3px] border-black mb-6 divide-x-[3px] divide-black">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-1 py-8 flex flex-col items-center justify-center bg-[#eae6dc]"
              >
                <div className="w-12 h-4 bg-black mb-4"></div>
                <div className="font-mono text-sm tracking-widest text-[var(--color-brand-red)] font-black">
                  PENDING
                </div>
              </div>
            ))}
          </div>

          {/* Decoding schema area */}
          <div className="flex-1 border-[3px] border-black relative p-4 flex flex-col overflow-hidden">
            <div className="flex justify-between font-mono font-bold text-sm tracking-widest mb-12">
              <div>DECODING SCHEMA</div>
              <div className="text-[var(--color-brand-red)]">[HEX_DUMP]</div>
            </div>

            {/* Faux hex block */}
            <div className="flex flex-wrap gap-2 opacity-10 pointer-events-none mb-auto">
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-[var(--color-brand-red)]"
                ></div>
              ))}
            </div>

            {/* Overlay Banner */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border-4 border-black border-r-[var(--color-brand-red)] border-b-[var(--color-brand-red)] text-white px-8 py-4 font-mono z-10 whitespace-nowrap shadow-[8px_8px_0_rgba(0,0,0,0.2)]">
              <span className="text-xl font-bold tracking-wider">
                TARGET ACQUISITION IN PROGRESS
              </span>
            </div>

            {/* Red Scanning line */}
            <div className="absolute inset-0 pointer-events-none z-20">
              <div className="absolute left-0 right-0 h-0.5 bg-[var(--color-brand-red)] shadow-[0_0_10px_rgba(187,42,40,0.5)] animate-scan"></div>
            </div>

            {/* Console output bottom box */}
            <div className="mt-8 border-[1px] border-[var(--color-brand-red)] p-4 bg-[#eae6dc] h-32 flex flex-col justify-end text-[var(--color-brand-red)] font-mono text-xs tracking-widest">
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
