"use client";

import { useEffect, useState } from "react";
import { AppData, ProfileData, Screen } from "@/types";

interface Props {
  setScreen: (screen: Screen) => void;
  setData: (data: AppData) => void; 
}

interface Target {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  location: string | null;
  totalCommits: number | null;
  topLanguage: string | null;
}

export function MultiResultScreen({ setScreen, setData }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://sesd-project-sem4.vercel.app";

  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/targets`);
        // const res = await fetch(`http://localhost:3001/api/targets`)
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Failed to fetch targets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTargets();
  }, [BACKEND_URL]);

  const handleRescan = (username?: string) => {
    const target = username || query.trim();
    if (!target) return;
    // Set the username on data so LoadingScreen picks it up, then go to LOADING
    setData({ login: target });
    setScreen("LOADING");
  };

  return (
    <div className="w-full h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="border-b-[4px] border-black p-6 flex justify-col md:flex-row justify-between items-start shrink-0 bg-[#eae6dc]">
        <div>
          <div className="text-[var(--color-brand-red)] font-bold font-mono tracking-widest text-xs mb-2">
            MATCHING SUBJECTS // [PARTIAL ALIAS SCAN]
          </div>
          <h1 className="text-6xl font-['Playfair_Display',var(--font-serif)] font-bold text-[var(--color-brand-red)] leading-none uppercase">
            Classified<br />Contacts
          </h1>
        </div>

        <div className="flex flex-col items-end gap-4 mt-4 md:mt-0">
          <div className="w-24 h-24 absolute top-4 right-4 pointer-events-none opacity-80 hidden md:block">
            <svg viewBox="0 0 100 100" className="w-full h-full text-black">
              <path id="circlePath4" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
              <text className="text-[12px] font-mono font-bold tracking-widest" fill="currentColor">
                <textPath href="#circlePath4">
                  MARGINAL DATA CONFIDENTIAL • SUBJECT LOGS •
                </textPath>
              </text>
            </svg>
          </div>
          <div className="mt-16 mr-12 text-xs font-bold font-mono tracking-[0.2em] text-transparent select-none hidden md:block">SPACER</div>
          <div className="flex border-[3px] border-black bg-white md:mr-12 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRescan()}
              placeholder="github username"
              className="px-4 py-2 font-mono text-lg font-bold w-48 text-gray-700 bg-white outline-none"
            />
            <button
              onClick={() => handleRescan()}
              className="bg-black text-white px-6 py-2 font-black font-mono flex items-center justify-center cursor-pointer hover:bg-gray-800 uppercase text-lg border-l-[3px] border-black"
            >
              Re-scan
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center font-mono text-lg animate-pulse">
            [ACCESSING_ARCHIVES...]
          </div>
        ) : results.length === 0 ? (
          <div className="col-span-full flex items-center justify-center font-mono text-lg opacity-50">
            NO_PREVIOUS_SUBJECTS_EXTRACTED
          </div>
        ) : (
          results.map((target, idx) => (
            <div 
              key={target.id || idx} 
              onClick={() => handleRescan(target.username)}
              className="border-[4px] border-black bg-[#eae6dc] flex flex-col shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_rgba(0,0,0,1)] transition-all cursor-pointer group"
            >
              {/* Top Bar */}
              <div className="flex justify-between items-center border-b-[2px] border-black px-3 py-1 font-mono text-[10px] font-bold tracking-widest">
                <div>FILE: {target.id.slice(-8).toUpperCase()}</div>
                {(!target.location || target.location === "***") ? (
                  <div className="flex items-center gap-2">LOC: <span className="bg-black text-black select-none">******</span></div>
                ) : (
                  <div>LOC: [{target.location.toUpperCase()}]</div>
                )}
              </div>

              {/* Profile Image */}
              <div className="p-4 border-b-[2px] border-black bg-white/50">
                <div className="aspect-square bg-gray-200 w-full overflow-hidden border-[2px] border-black relative">
                  {target.avatarUrl ? (
                    <img 
                      src={target.avatarUrl} 
                      alt={target.username} 
                      className="w-full h-full object-cover grayscale contrast-125"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-gray-400 font-bold">?</div>
                  )}
                  <div className="absolute inset-0 bg-[var(--color-brand-red)] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-2xl font-['Playfair_Display',var(--font-serif)] font-bold uppercase tracking-wide">
                  {target.name || "UNKNOWN SUBJECT"}
                </h3>
                <div className="text-[var(--color-brand-red)] font-bold font-mono tracking-widest text-xs mt-1 mb-6">
                  @{target.username.toUpperCase()}
                </div>

                <div className="mt-auto grid grid-cols-3 gap-2 border-t-[2px] border-black pt-3">
                  <div className="col-span-1">
                    <div className="text-[9px] font-mono tracking-widest font-bold mb-1 uppercase">Commits</div>
                    <div className="font-bold text-sm">{target.totalCommits || "—"}</div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-[9px] font-mono tracking-widest font-bold mb-1 uppercase">Linguistics</div>
                    <div className="font-bold text-sm truncate">{target.topLanguage || "—"}</div>
                  </div>
                  <div className="col-span-1 flex justify-end items-end">
                    <div className="w-8 h-8 border-[2px] border-black flex items-center justify-center bg-white group-hover:bg-black group-hover:text-white transition-colors">
                      →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
