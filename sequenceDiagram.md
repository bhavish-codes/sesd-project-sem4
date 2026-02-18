```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Backend
    participant OAuth as GitHub OAuth
    participant GitHub as GitHub API
    participant AI as AI Analysis Service
    participant DB as Database

    %% Optional Authentication Flow
    User->>Frontend: Click "Login with GitHub"
    Frontend->>OAuth: Request authorization
    OAuth-->>Frontend: Authorization code
    Frontend->>Backend: Send auth code
    Backend->>OAuth: Exchange code for access token
    OAuth-->>Backend: Access token
    Backend->>DB: Store user session
    Backend-->>Frontend: Login success

    %% Public Profile Analysis Flow
    User->>Frontend: Paste GitHub Profile URL
    User->>Frontend: Click Analyze
    Frontend->>Backend: Send profile URL

    Backend->>GitHub: Fetch public profile data
    GitHub-->>Backend: Profile + repo data

    Backend->>AI: Send structured profile data
    AI-->>Backend: Skill analysis + insights

    Backend->>Backend: Generate evaluation report

    alt User is logged in
        Backend->>DB: Save report to dashboard
    end

    Backend-->>Frontend: Return report
    Frontend-->>User: Display evaluation results

    opt Download report
        User->>Frontend: Download report
        Frontend->>Backend: Request file
        Backend-->>Frontend: Report file
    end
