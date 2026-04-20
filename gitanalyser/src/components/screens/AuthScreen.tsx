import { Screen } from "@/types";

interface Props {
  setScreen: (screen: Screen) => void;
}

export function AuthScreen({ setScreen }: Props) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative p-8">
      {/* Top Right Stamp */}
      <div className="absolute top-8 right-8 w-32 h-32 opacity-80 pointer-events-none select-none flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
          <path
            id="circlePath"
            d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
            fill="transparent"
          />
          <text
            className="text-[9.5px] font-mono font-bold tracking-widest"
            fill="currentColor"
          >
            <textPath href="#circlePath">
              SECURE PORTAL • VERIFY IDENTITY HANDSHAKE INITIATED •
            </textPath>
          </text>
        </svg>
      </div>

      {/* Main Card */}
      <div className="w-[500px] bg-[#eae6dc] border-[4px] border-black relative p-12 flex flex-col items-center shadow-[12px_12px_0_0_rgba(0,0,0,1)] z-10 before:content-[''] before:absolute before:border-b-[4px] before:border-black before:w-16 before:-bottom-3 before:left-1/2 before:-translate-x-1/2">
        <div className="text-[var(--color-brand-red)] font-bold font-mono tracking-widest text-xs mb-8">
          PROTOCOL ID: [GITHUB_GATEWAY]
        </div>

        <h1 className="text-5xl font-['Playfair_Display',var(--font-serif)] font-bold text-center leading-none mb-12 uppercase">
          Initiating
          <br />
          Secure
          <br />
          Handshake
        </h1>

        <div className="w-32 h-32 mb-16">
          <svg viewBox="0 0 24 24" fill="black" className="w-full h-full">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"
            />
          </svg>
        </div>

        <button
          className="w-full bg-black text-white px-8 py-5 font-mono text-sm tracking-widest font-bold uppercase hover:bg-gray-800 transition-colors relative"
          onClick={() => {
            const API_URL =
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
            window.location.href = `${API_URL}/api/auth/github`;
          }}
        >
          Authenticate via Github
          <div className="absolute -left-2 top-0 bottom-0 w-2 bg-[var(--color-brand-red)]"></div>
          <div className="absolute -right-2 top-0 bottom-0 w-2 bg-[var(--color-brand-red)]"></div>
        </button>
        <div className="text-[10px] font-mono text-[var(--color-brand-red)] mt-3 mb-10 tracking-[0.2em] font-bold">
          SECURE REDIRECT // LEVEL 4 CLEARANCE REQUIRED
        </div>

        <div className="text-gray-400 font-mono text-xs tracking-widest">
          LISTENING FOR HANDSHAKE...
        </div>
      </div>
    </div>
  );
}
