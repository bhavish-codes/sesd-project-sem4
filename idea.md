# GitHub Profile Reviewer (Espionage/Terminal Theme)

## Core Concept
A full-stack, state-driven web application that acts as a "classified portal" to extract and analyze GitHub developers' public profiles.

## Key Features
1. **Secure Handshake Authentication**: Users authenticate via a custom GitHub OAuth flow styled as an espionage portal gateway.
2. **Real-Time Data Extraction**: The backend fetches and aggregates repositories, language volume, and contribution heatmaps using GitHub's REST and GraphQL APIs.
3. **Extraction Matrix & Linguistic Formula**: Converts raw code metrics into highly stylized visualizations (brutalist graphs, tracking logs).
4. **Finite-State Machine Architecture**: Replaces standard web navigation with seamless, animated transition states (`AUTH` -> `LOADING` -> `RESULT`).
5. **AI-Ready Analytics**: Designed to eventually pipe the aggregated developer footprint into an AI model to generate concise, human-readable insights on developer patterns.