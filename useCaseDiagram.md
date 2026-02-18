```mermaid
flowchart LR

    User[User]
    GitHub[GitHub API]
    OAuth[GitHub OAuth Service]
    AI[AI Analysis Service]
    DB[(Database)]

    subgraph System[GitHub Profile Reviewer System]

        UC1((Register / Login))
        UC2((Login with GitHub OAuth))
        UC3((Paste GitHub Profile URL))
        UC4((Analyze Profile))
        UC5((View AI Evaluation Report))
        UC6((View Skill Summary))
        UC7((View Improvement Suggestions))
        UC8((Logout))

        UC9((Fetch Profile Data))
        UC10((AI Processing))
        UC11((Generate Summary))
        UC12((Download Report))
        UC13((Save Report to Dashboard))
        UC14((Store User Session))

        User --> UC1
        User --> UC2
        User --> UC3
        User --> UC4
        User --> UC5
        User --> UC6
        User --> UC7
        User --> UC8

        UC2 -->|<<include>>| UC14
        UC4 -->|<<include>>| UC9
        UC4 -->|<<include>>| UC10
        UC5 -->|<<include>>| UC11

        UC5 -.->|<<extend>>| UC12
        UC4 -.->|<<extend>>| UC13
    end

    OAuth --> UC2
    GitHub --> UC9
    AI --> UC10
    DB --> UC13
    DB --> UC14

