export function MultiResultScreen() {
  const targets = [
    { id: "894-A", name: "L. TORVALDS", handle: "@torvalds", loc: "HELSINKI", commits: "14.2K", lang: "C / ASM", img: "torvalds" },
    { id: "902-B", name: "TORV ***", handle: "@torv_dev", loc: "***", commits: "2.1K", lang: "RUST", img: "abramov" },
    { id: "761-C", name: "T. ORVILL", handle: "@torv_os", loc: "TOKYO", commits: "854", lang: "GO / PY", img: "orvill" },
    { id: "442-X", name: "M. TORVES", handle: "@mtorv", loc: "***", commits: "12K", lang: "JS / TS", img: "torves" },
    { id: "119-L", name: "A. TORVALD", handle: "@atorv", loc: "SF", commits: "432", lang: "C++", img: "atorv" },
    { id: "002-S", name: "TORV_SYS", handle: "@sys_torv", loc: "LONDON", commits: "9.2K", lang: "RUST", img: "syst" },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="border-b-[4px] border-black p-6 flex justify-between items-start shrink-0 bg-[#eae6dc]">
        <div>
          <div className="text-[var(--color-brand-red)] font-bold font-mono tracking-widest text-xs mb-2">
            MATCHING SUBJECTS // [PARTIAL ALIAS SCAN]
          </div>
          <h1 className="text-6xl font-['Playfair_Display',var(--font-serif)] font-bold text-[var(--color-brand-red)] leading-none uppercase">
            Classified<br />Contacts
          </h1>
        </div>
        
        <div className="flex flex-col items-end gap-4">
          <div className="w-24 h-24 absolute top-4 right-4 pointer-events-none opacity-80">
            <svg viewBox="0 0 100 100" className="w-full h-full text-black">
              <path id="circlePath4" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
              <text className="text-[12px] font-mono font-bold tracking-widest" fill="currentColor">
                <textPath href="#circlePath4">
                  MARGINAL DATA CONFIDENTIAL • SUBJECT LOGS •
                </textPath>
              </text>
            </svg>
          </div>
          <div className="mt-16 mr-12 text-xs font-bold font-mono tracking-[0.2em] text-transparent select-none">SPACER</div>
          <div className="flex border-[3px] border-black bg-white mr-12 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <div className="px-4 py-2 font-mono text-lg font-bold w-48 text-gray-700">torv</div>
            <div className="bg-black text-white px-6 py-2 font-black font-mono flex items-center justify-center cursor-pointer hover:bg-gray-800 uppercase text-lg">
              Re-scan
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid - Cards sitting on the grid background */}
      <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {targets.map((target) => (
          <div key={target.id} className="border-[4px] border-black bg-[#eae6dc] flex flex-col shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_rgba(0,0,0,1)] transition-all cursor-pointer">
            {/* Top Bar */}
            <div className="flex justify-between items-center border-b-[2px] border-black px-3 py-1 font-mono text-[10px] font-bold tracking-widest">
              <div>FILE: {target.id}</div>
              {target.loc === "***" ? (
                <div className="flex items-center gap-2">LOC: <div className="bg-black text-black select-none">******</div></div>
              ) : (
                <div>LOC: [{target.loc}]</div>
              )}
            </div>

            {/* Profile Image (placeholder representation) */}
            <div className="p-4 border-b-[2px] border-black">
              <div className="aspect-square bg-gray-300 w-full grayscale relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10 mix-blend-multiply"></div>
                {/* Fallback to simple icon since we don't have images */}
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-6xl text-gray-400 font-bold">
                  ?
                </div>
              </div>
            </div>

            {/* Content info */}
            <div className="p-4 flex-1 flex flex-col">
              {target.name.includes('*') ? (
                <div className="flex items-center gap-2 text-2xl font-['Playfair_Display',var(--font-serif)] font-bold uppercase tracking-wide">
                  TORV <div className="bg-black text-black select-none h-6 px-1">****</div>
                </div>
              ) : (
                <h3 className="text-2xl font-['Playfair_Display',var(--font-serif)] font-bold uppercase tracking-wide">
                  {target.name}
                </h3>
              )}
              
              <div className="text-[var(--color-brand-red)] font-bold font-mono tracking-widest text-xs mt-1 mb-6">
                {target.handle}
              </div>

              <div className="mt-auto grid grid-cols-3 gap-2 border-t-[2px] border-black pt-3">
                <div className="col-span-1">
                  <div className="text-[9px] font-mono tracking-widest font-bold mb-1">COMMITS</div>
                  <div className="font-bold text-sm">{target.commits}</div>
                </div>
                <div className="col-span-1">
                  <div className="text-[9px] font-mono tracking-widest font-bold mb-1">LANGUAGE</div>
                  <div className="font-bold text-sm">{target.lang}</div>
                </div>
                <div className="col-span-1 flex justify-end items-end">
                  <div className="w-6 h-6 border-[2px] border-black flex items-center justify-center bg-white hover:bg-black hover:text-white transition-colors cursor-pointer">
                     →
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
