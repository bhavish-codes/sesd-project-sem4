# GitHub Profile Reviewer (Classified SPA Edition)

A highly stylized, finite-state-machine (FSM) driven web application designed to act as an "encrypted portal" for analyzing GitHub developers' public profiles. The system features a brutalist, espionage-themed aesthetic, evaluating coder activity and projecting it via "Extraction Matrices" and "Linguistic Formulas."

## Features

- **State-Driven Architecture**: Trades traditional routing for a React multi-screen FSM (`AUTH` → `LOADING` → `RESULT` → `MULTI_RESULT`).
- **Encrypted Portal UI**: Operates via a "Secure Handshake" interface with brutalist styling and terminal-like diagnostics.
- **Extraction Matrix**: A visual heat-map block simulating complex codebase analysis.
- **Linguistic Formula**: Translates programming languages into a volumetric composition bar.
- **Seamless Loading Flow**: Animated transitions showing faux trace routes, latency data, and system logs.
- **Backend API**: Express.js server with GitHub OAuth and profile data fetching via GraphQL.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router) + React
- **Backend**: Express.js (Node.js)
- **Database**: MongoDB (via Prisma)
- **Styling**: Tailwind CSS + Vanilla CSS components.
- **State Management**: React `useState` structured as a custom FSM.
- **Deployment**: Vercel-ready (both frontend and backend)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (or use the provided MongoDB Atlas connection)
- GitHub OAuth App (for authentication)

### Local Development

1. **Clone and install dependencies:**

```bash
# Frontend
cd gitanalyser
npm install

# Backend
cd ../backend
npm install
```

2. **Configure environment variables:**

Create `backend/.env`:

```env
DATABASE_URL="your-mongodb-connection-string"
PORT=3001
GITHUB_CLIENT_ID="your-github-oauth-client-id"
GITHUB_CLIENT_SECRET="your-github-oauth-client-secret"
GITHUB_REDIRECT_URI=http://localhost:3001/api/auth/callback
FRONTEND_URL=http://localhost:3000
GITHUB_TOKEN="your-github-personal-access-token"
```

3. **Run the application:**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd gitanalyser
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Vercel Deployment

### Backend Deployment

```bash
cd backend
vercel deploy
```

Required environment variables in Vercel:

- `DATABASE_URL`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GITHUB_REDIRECT_URI` — `https://your-backend.vercel.app/api/auth/callback`
- `FRONTEND_URL` — Your frontend Vercel URL
- `VERCEL_FRONTEND_URL` — Your frontend Vercel URL
- `GITHUB_TOKEN`

### Frontend Deployment

```bash
cd gitanalyser
vercel deploy
```

Required environment variables:

- `NEXT_PUBLIC_API_URL` — `https://your-backend.vercel.app`

## API Endpoints

| Method | Endpoint                | Description                  |
| ------ | ----------------------- | ---------------------------- |
| GET    | `/`                     | Health check                 |
| GET    | `/api/auth/github`      | Start GitHub OAuth           |
| GET    | `/api/auth/callback`    | OAuth callback               |
| GET    | `/api/github/:username` | Get GitHub profile data      |
| GET    | `/api/users`            | List all users               |
| GET    | `/api/users/:id`        | Get user by ID               |
| POST   | `/api/profile/:userId`  | Fetch & store GitHub profile |
| GET    | `/api/reports/:userId`  | Get user reports             |
| POST   | `/api/reports/:userId`  | Create a report              |

## Folder Structure

```text
sesd-project-sem4/
├── backend/                  # Express.js API server
│   ├── src/
│   │   ├── index.ts          # Main server entry
│   │   ├── services/         # Business logic
│   │   └── models/           # Data models
│   ├── prisma/               # Database schema
│   └── vercel.json           # Vercel config
├── gitanalyser/              # Next.js SPA Frontend
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   ├── components/       # React components
│   │   └── types/            # TypeScript types
│   └── .env.example          # Environment template
└── readme.md
│   │   │   └── page.tsx      # Main application host container
│   │   ├── components/
│   │   │   ├── FlashCard.tsx # Core Finite State Machine router component
│   │   │   └── screens/      # Stylized individual states
│   │   │       ├── AuthScreen.tsx
│   │   │       ├── LoadingScreen.tsx
│   │   │       ├── MultiResultScreen.tsx
│   │   │       └── ResultScreen.tsx
│   │   └── types/
│   │       └── index.ts      # TypeScript interfaces and state types
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
├── classDiagram.md           # Component state mapping diagram
├── ErDiagram.md              # Database caching schema visualization
├── idea.md                   # Initial project conception outline
├── readme.md                 # Project documentation
├── sequenceDiagram.md        # Step-by-step FSM rendering trace
└── useCaseDiagram.md         # Thematic flowchart of user interaction
```

## Project Structure & Diagrams

This project uses Mermaid diagrams to define its logic structure. See the included `.md` files for full architectures:

- **[Class Diagram](./classDiagram.md)**: Details the React FSM Component structures.
- **[Sequence Diagram](./sequenceDiagram.md)**: Outlines how the FSM transitions from Authentication to Data Rendering.
- **[Use Case Diagram](./useCaseDiagram.md)**: Highlights the thematic user behaviors.
- **[ER Diagram](./ErDiagram.md)**: Maps out the eventual cached DB schema for Targets and Insights.

## Next Step in Implementation

**Current Status**: Full-stack application completed. The finite-state machine frontend successfully integrates with the Express backend, securely handles GitHub OAuth authentication, and accurately fetches/aggregates real developer data via the GitHub API (REST & GraphQL).

**Next Immediate Objective**: AI Analysis & Multi-Target Scanning

1. **AI Processing Integration**: Connect the backend to an AI service (e.g., HuggingFace or OpenAI) to feed the aggregated GitHub data (`ProfileData`) into an LLM and generate the natural language "Report" summary of the developer's skills and weaknesses.
2. **Multi-Target Analysis**: Expand the `MULTI_RESULT` screen to allow comparing multiple GitHub profiles side-by-side using the same extraction aesthetic.
3. **Caching Optimization**: Fully utilize the MongoDB Prisma integration to cache historical GitHub lookups, significantly reducing external API rate limits on repeated searches.
