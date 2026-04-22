# 🕶️ Git Analyser: Marginal Extraction

![Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

A highly stylized, finite-state-machine (FSM) driven web application designed to act as an "encrypted portal" for analyzing GitHub developers' public profiles. The system features a brutalist, espionage-themed aesthetic, evaluating coder activity and projecting it via "Extraction Matrices" and "Linguistic Formulas."

---

## ⚡ Core Features

- 🛡️ **State-Driven Architecture**: Trades traditional page routing for a React multi-screen Finite State Machine (`AUTH` → `LOADING` → `RESULT` → `MULTI_RESULT`).
- 💻 **Encrypted Portal UI**: Operates via a "Secure Handshake" interface with strict brutalist styling and terminal-like diagnostics.
- 📊 **Extraction Matrix**: A visual heat-map block simulating complex codebase analysis based on real GitHub commit activity.
- 🧮 **Linguistic Formula**: Translates programming languages into a volumetric composition bar chart.
- 🔄 **Seamless Loading Flow**: Animated transitions showing faux trace routes, latency data, and system logs while data decodes.
- ⚙️ **Robust Backend**: Express.js server handling GitHub OAuth, token management, and profile data fetching via GraphQL & REST APIs.

---

## 🛠️ Technology Stack

| Architecture Layer | Technology |
|-------------------|------------|
| **Frontend** | [Next.js](https://nextjs.org/) (App Router), React, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Prisma ORM |
| **State Management**| Custom React `useState` Finite State Machine |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (or MongoDB Atlas)
- GitHub OAuth Application (for Client ID & Secret)

### Local Development Setup

1. **Clone & Install Dependencies**
```bash
# Install frontend dependencies
cd gitanalyser
npm install

# Install backend dependencies
cd ../backend
npm install
```

2. **Environment Variables**
Create a `.env` file in the `backend/` directory:
```env
DATABASE_URL="your-mongodb-connection-string"
PORT=3001
GITHUB_CLIENT_ID="your-github-oauth-client-id"
GITHUB_CLIENT_SECRET="your-github-oauth-client-secret"
GITHUB_REDIRECT_URI="http://localhost:3001/api/auth/callback"
FRONTEND_URL="http://localhost:3000"
GITHUB_TOKEN="your-github-personal-access-token"
JWT_SECRET="your-secure-jwt-secret"
```

3. **Initialize the Server**
Run both development servers concurrently:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd gitanalyser && npm run dev
```
Navigate to `http://localhost:3000` to initiate the handshake.

---

## 📂 Project Structure

```text
sesd-project-sem4/
├── backend/                  # Express.js API server
│   ├── api/                  # Vercel serverless entry points
│   │   └── index.ts
│   ├── lib/                  # Database connection utilities
│   │   └── prisma.ts
│   ├── prisma/               # Database schema & migrations
│   │   └── schema.prisma
│   ├── src/
│   │   ├── index.ts          # Main server entry & routing
│   │   └── services/         # OOP Business logic & External APIs
│   │       ├── AuthService.ts
│   │       └── GitHubService.ts
│   └── vercel.json           # Backend deployment config
│
├── gitanalyser/              # Next.js SPA Frontend
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   │   ├── error/        # Custom error boundary
│   │   │   ├── globals.css   # Global brutalist styles
│   │   │   ├── layout.tsx    # App layout wrapper
│   │   │   └── page.tsx      # Main application host container
│   │   ├── components/       # React components
│   │   │   ├── FlashCard.tsx # Core FSM router component
│   │   │   └── screens/      # Stylized UI states
│   │   │       ├── AuthScreen.tsx
│   │   │       ├── LoadingScreen.tsx
│   │   │       ├── MultiResultScreen.tsx
│   │   │       └── ResultScreen.tsx
│   │   └── types/            # TypeScript interfaces
│   │       └── index.ts
│   └── next.config.ts        # Next.js configuration
│
└── Docs/                     # System Architecture Diagrams
    ├── classDiagram.md       # Component state mapping diagram
    ├── ErDiagram.md          # Database schema visualization
    ├── sequenceDiagram.md    # Step-by-step FSM rendering trace
    └── useCaseDiagram.md     # Thematic flowchart of user interaction
```

---

## 📡 API Endpoints

| Method | Endpoint                | Description |
| ------ | ----------------------- | ----------- |
| `GET`  | `/api/auth/github`      | Initiates GitHub OAuth flow |
| `GET`  | `/api/auth/callback`    | Handles OAuth callback & JWT assignment |
| `GET`  | `/api/me`               | Verifies current JWT session |
| `GET`  | `/api/github/:username` | Aggregates REST & GraphQL profile data |

---

## 🎯 Next Steps & Roadmap

1. **AI Processing Integration**: Connect the backend to an AI service (HuggingFace/OpenAI) to feed the aggregated GitHub `ProfileData` into an LLM, generating a natural language "Threat Assessment" of the developer's skills.
2. **Multi-Target Analysis**: Fully implement the `MULTI_RESULT` screen to compare multiple GitHub profiles side-by-side using the same extraction aesthetic.
3. **Database Caching**: Fully utilize the MongoDB Prisma integration to cache historical GitHub lookups, significantly reducing external API rate limits on repeated target searches.

---
*End of Document. Authorization Required for edits.*
