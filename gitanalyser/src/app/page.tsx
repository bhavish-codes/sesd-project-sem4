"use client";

import { useState } from "react";
import { Screen } from "@/types";
import { FlashCard } from "@/components/FlashCard";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("AUTH");
  const [data, setData] = useState<any>(null);

  const getSidebarText = () => {
    switch (screen) {
      case "AUTH": return "ENCRYPTED PORTAL ACCESS";
      case "LOADING": return "DATA EXTRACTION IN PROGRESS";
      case "RESULT": return "DATA EXTRACTED COLD";
      case "MULTI_RESULT": return "BATCH EXTRACTION ACTIVE";
    }
  };

  const getTopRef = () => {
    if (screen === "AUTH") return "PROTOCOL: OAUTH-2.0";
    if (screen === "MULTI_RESULT") return "QUERY REF: PRTL-772";
    return "SYS. REF: 894-A";
  };

  return (
    <main className="h-screen w-screen p-4 md:p-6 lg:p-8 bg-[#eae6dc] flex overflow-hidden">
      <div className="flex-1 w-full h-full border-[4px] border-black flex shadow-[8px_8px_0_0_rgba(0,0,0,1)] bg-[#eae6dc]">
        
        {/* Left Vertical Black Bar */}
        <div className="hidden md:flex w-12 lg:w-16 bg-black text-white flex-col justify-between items-center py-6 select-none shrink-0 border-r-[4px] border-black">
          <div className="vertical-text text-[10px] font-mono tracking-widest text-gray-400">
            {getTopRef()}
          </div>
          
          <div className="vertical-text text-lg font-bold tracking-[0.2em] text-white">
            {getSidebarText()}
          </div>
          
          <div className="vertical-text text-[10px] font-mono tracking-widest text-[var(--color-brand-red)]">
            STATUS: ACTIVE
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden bg-grid-pattern relative flex items-center justify-center">
          <FlashCard screen={screen} setScreen={setScreen} setData={setData} data={data} />
        </div>
        
      </div>
    </main>
  );
}
