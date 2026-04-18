# GitHub Profile Reviewer (Classified SPA Edition)

A highly stylized, finite-state-machine (FSM) driven web application designed to act as an "encrypted portal" for analyzing GitHub developers' public profiles. The system features a brutalist, espionage-themed aesthetic, evaluating coder activity and projecting it via "Extraction Matrices" and "Linguistic Formulas."

## Features

- **State-Driven Architecture**: Trades traditional routing for a React multi-screen FSM (`AUTH` → `LOADING` → `RESULT`).
- **Encrypted Portal UI**: Operates via a "Secure Handshake" interface with brutalist styling and terminal-like diagnostics.
- **Extraction Matrix**: A visual heat-map block simulating complex codebase analysis.
- **Linguistic Formula**: Translates programming languages into a volumetric composition bar.
- **Seamless Loading Flow**: Animated transitions showing faux trace routes, latency data, and system logs.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Library**: React
- **Styling**: Tailwind CSS + Vanilla CSS components.
- **State Management**: React `useState` structured as a custom FSM.

## Getting Started

### Installation

Navigate to the frontend directory and install the dependencies:

```bash
cd gitanalyser
npm install
```

### Running Locally

Fire up the development server:

```bash
npm run dev
```

Point your browser to [http://localhost:3000](http://localhost:3000) to initiate the connection. The system will start on the `AUTH` screen.

## Folder Structure

```text
sesd-project-sem4/
├── backend/                  # Future Node.js / Express backend
├── gitanalyser/              # Next.js SPA Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css   # Contains Tailwind & custom color variables
│   │   │   ├── layout.tsx
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

**Current Status**: Front-End single-page FSM foundation design completed with mocked data.

**Next Immediate Objective**: Backend API & Real Data Integration.

1. **API Integration in Loading Screen**: Modify the `setTimeout` in the `<LoadingScreen />` component to execute an asynchronous `fetch()` command addressing the GitHub API. 
2. **Dynamic Visualizer Generation**: Connect the retrieved GitHub repository data (loc, contributions, languages) to the state mapping, updating the "Extraction Matrix" and "Linguistic Formula" in `<ResultScreen />` to render dynamically based on the fetched arrays instead of static mockups.
3. **Real OAuth Flow**: Replace the visual button state trigger in `<AuthScreen />` to redirect through the typical GitHub OAuth flow, capturing an access token on callback to increase API rate limits.
4. **AI Processing**: Send the fetched raw data block to a preferred backend service to generate the natural language summary.
