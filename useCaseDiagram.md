```mermaid
flowchart LR

    %% Actors
    User[User]
    GitHubAPI[GitHub API]
    OAuth[GitHub OAuth Service]
    AI[AI Analysis Service]
    DB[(Database)]

    %% System Boundary
    subgraph System[GitHub Profile Reviewer System]

        %% User Actions
        UC1((Register / Login))
        UC2((Login via GitHub OAuth))
        UC3((Paste GitHub Profile URL))
        UC4((Analyze Public Profile))
        UC5((View AI Evaluation Report))
        UC6((View Skill Summary))
        UC7((View Improvement Suggestions))
        UC8((Download Report))
        UC9((Logout))

        %% Internal Processes
        UC10((Fetch Public Profile Data))
        UC11((Run AI Analysis))
        UC12((Generate Evaluation Summary))
        UC13((Save Report to Dashboard))
        UC14((Store User Session))

        %% User Interactions
        User --> UC1
        User --> UC2
        User --> UC3
        User --> UC4
        User --> UC5
        User --> UC6
        User --> UC7
        User --> UC8
        User --> UC9

        %% Includes (mandatory flows)
        UC2 -->|<<include>>| UC14
        UC4 -->|<<include>>| UC10
        UC4 -->|<<include>>| UC11
        UC5 -->|<<include>>| UC12

        %% Extends (optional features)
        UC4 -.->|<<extend>>| UC13
        UC5 -.->|<<extend>>| UC8
    end

    %% External Connections
    OAuth --> UC2
    GitHubAPI --> UC10
    AI --> UC11
    DB --> UC13
    DB --> UC14
