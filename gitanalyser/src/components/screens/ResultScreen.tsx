import { ProfileData, Screen } from "@/types";

interface Props {
  data: ProfileData;
  setScreen: (screen: Screen) => void;
}

export function ResultScreen({ data, setScreen }: Props) {
  return (
    <div className="w-full h-full flex flex-col bg-[#eae6dc]">
      {/* Header */}
      <div className="border-b-[4px] border-black p-6 flex justify-between items-start shrink-0">
        <div>
          <div className="text-[var(--color-brand-red)] font-bold font-mono tracking-widest text-xs mb-2">
            RECORD OF COMMITMENTS //
          </div>
          <h1 className="text-6xl font-['Playfair_Display',var(--font-serif)] font-bold text-[var(--color-brand-red)] leading-none uppercase">
            Marginal
            <br />
            Extraction
          </h1>
        </div>

        <div className="flex flex-col items-end gap-4">
          <div className="w-24 h-24 absolute top-4 right-4 pointer-events-none opacity-80">
            <svg viewBox="0 0 100 100" className="w-full h-full text-black">
              <path
                id="circlePath3"
                d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                fill="transparent"
              />
              <text
                className="text-[12px] font-mono font-bold tracking-widest"
                fill="currentColor"
              >
                <textPath href="#circlePath3">
                  COLD BREW CO FORMULA REGISTRADA •
                </textPath>
              </text>
              <circle cx="80" cy="50" r="4" fill="currentColor" />
            </svg>
          </div>
          <div className="mt-16 mr-12 text-xs font-bold font-mono tracking-widest text-gray-700">
            TARGET ALIAS <span className="float-right">[REQ. 01]</span>
          </div>
          <div className="flex border-[3px] border-black bg-white mr-12 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <div
              className="bg-black text-white px-8 py-2 font-black font-mono flex items-center justify-center cursor-pointer hover:bg-gray-800 uppercase text-lg"
              onClick={() => setScreen("MULTI_RESULT")}
            >
              Explore More
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 flex overflow-hidden lg:overflow-y-auto">
        {/* Left Column - Profile */}
        <div className="w-1/3 min-w-[280px] border-r-[4px] border-black flex flex-col p-6">
          <div className="border-[3px] border-black p-2 bg-white relative mb-6 shadow-[6px_6px_0_rgba(0,0,0,0.1)]">
            {/* Lvl Sticker */}
            <div className="absolute -top-4 -right-4 bg-[var(--color-brand-red)] text-black font-black border-[3px] border-black rounded-lg px-3 py-1 font-mono transform rotate-12 shadow-[3px_3px_0_rgba(0,0,0,1)] z-10 z-20 text-lg">
              LVL. {Math.floor((data?.commits || 0) / 1000)}
            </div>
            {/* Mock Image Placeholder */}
            <div className="aspect-square bg-gray-300 relative overflow-hidden grayscale">
              <picture>
                <img
                  src={
                    data?.avatarUrl ||
                    `https://avatars.githubusercontent.com/${data?.login}`
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </picture>
            </div>
          </div>

          <h2 className="text-4xl font-['Playfair_Display',var(--font-serif)] font-bold uppercase leading-tight mt-2">
            {data?.name ||
              data?.login ||
              "Linus Torvalds"}
          </h2>
          <div className="text-[var(--color-brand-red)] font-bold font-mono tracking-widest text-sm mb-6">
            @{data?.username || "torvalds"}
          </div>

          <p className="font-mono text-xs leading-relaxed text-gray-800">
            {data?.bio || "No bio available for this operative."}
          </p>

          <div className="font-mono text-xs font-bold tracking-widest mb-6 uppercase">
            [LOC: {data?.location || "UNKNOWN"}]
          </div>

          <div className="border-b-[3px] border-black mb-6"></div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="border-[2px] border-black px-2 py-1 text-[10px] font-bold tracking-widest uppercase">
              {data?.company || "INDEPENDENT"}
            </span>
            <span className="border-[2px] border-black px-2 py-1 text-[10px] font-bold tracking-widest uppercase">
              VERIFIED
            </span>
          </div>
        </div>

        {/* Right Column - Stats & Graphs */}
        <div className="w-2/3 flex flex-col p-6 space-y-6">
          {/* Top pending boxes */}
          <div className="flex gap-4 border-[3px] border-black divide-x-[3px] divide-black shrink-0 relative overflow-hidden">
            {/* Faux background heart outline or curved line could go absolute here, kept minimal */}
            {[
              { label: "COMMITS", val: data?.commits || "0" },
              { label: "REPOS", val: data?.repos || "0" },
              {
                label: "FOLLOWERS",
                val: data?.followers || "0",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex-1 py-6 flex flex-col items-center justify-center bg-[#eae6dc] z-10"
              >
                <div className="font-['Playfair_Display',var(--font-serif)] text-5xl font-bold text-[var(--color-brand-red)] mb-4">
                  {stat.val}
                </div>
                <div className="font-mono text-xs tracking-widest text-black font-black">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Linguistic Formula */}
          <div className="border-[3px] border-black p-4 bg-[#eae6dc]">
            <div className="flex justify-between items-end border-b-[2px] border-black pb-2 mb-4">
              <div className="font-['Playfair_Display',var(--font-serif)] font-bold text-xl tracking-wide uppercase">
                Linguistic Formula
              </div>
              <div className="text-[var(--color-brand-red)] font-mono text-[10px] tracking-widest font-black">
                [VOLUMETRIC BREAKDOWN]
              </div>
            </div>

            <div className="space-y-4">
              {(data?.languages && Object.keys(data.languages).length > 0
                ? Object.entries(data.languages)
                    .map(([lang, pct]) => ({
                      lang,
                      pct: Math.round(Number(pct)),
                    }))
                    .sort((a, b) => b.pct - a.pct)
                    .slice(0, 5)
                : [
                    { lang: "C", pct: 85 },
                    { lang: "MAKEFILE", pct: 10 },
                    { lang: "SHELL", pct: 5 },
                  ]
              ).map((item: { lang: string; pct: number }) => (
                <div key={item.lang} className="flex items-center gap-4">
                  <div className="w-24 font-mono text-xs font-bold tracking-widest truncate">
                    {item.lang}
                  </div>
                  <div className="flex-1 h-5 border-[1px] border-black flex gap-px bg-[#d1cec6] p-px">
                    <div
                      className="h-full bg-[var(--color-brand-red)]"
                      style={{ width: `${item.pct}%` }}
                    ></div>
                    <div className="flex-1 flex opacity-20">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 border-r border-[#666]"
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="w-10 text-right font-mono text-xs font-bold">
                    {item.pct}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Extraction Matrix */}
          <div className="border-[3px] border-black p-4 bg-[#eae6dc] flex-1 flex flex-col">
            <div className="flex justify-between items-end border-b-[2px] border-black pb-2 mb-4">
              <div className="font-['Playfair_Display',var(--font-serif)] font-bold text-xl tracking-wide uppercase">
                Extraction Matrix
              </div>
              <div className="text-[var(--color-brand-red)] font-mono text-[10px] tracking-widest font-black">
                [LAST 90 DAYS]
              </div>
            </div>

            <div className="border-[1px] border-[var(--color-brand-red)] p-4 flex items-end gap-[2px] flex-1 bg-[#eae6dc] min-h-[120px]">
              {(data?.contributions?.weeks?.flatMap((w) => w.contributionDays) || [])
                .slice(-140)
                .map((day, i: number) => {
                  const count = day.contributionCount || 0;
                  
                  // Color thresholds
                  let color = "bg-[#b1a99f]"; 
                  if (count === 0) color = "bg-[#dcd7cd] opacity-50"; 
                  else if (count > 10) color = "bg-[var(--color-brand-red)]";
                  else if (count > 5) color = "bg-black";

                  // Height scaling (assuming 15 commits is max height for this visualizer)
                  const heightPct = count === 0 ? 4 : Math.min(100, Math.max(10, (count / 15) * 100));

                  return (
                    <div 
                      key={day.date || i} 
                      className={`flex-1 ${color} hover:opacity-75 transition-all cursor-crosshair`}
                      style={{ height: `${heightPct}%` }}
                      title={`${count} commits on ${day.date}`}
                    ></div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
