```mermaid
flowchart LR

    User[User]
    GitHub[GitHub API]
    AI[AI Analysis Service]
    DB[(Database)]

    subgraph System[GitHub Profile Reviewer System]

        UC1((Register / Login))
        UC2((Paste GitHub Profile URL))
        UC3((Analyze Profile))
        UC4((View AI Evaluation Report))
        UC5((View Skill Summary))
        UC6((View Improvement Suggestions))
        UC7((Logout))

        UC8((Fetch Profile Data))
        UC9((AI Processing))
        UC10((Generate Summary))
        UC11((Download Report))
        UC12((Save Report to Dashboard))

        User --> UC1
        User --> UC2
        User --> UC3
        User --> UC4
        User --> UC5
        User --> UC6
        User --> UC7

        UC3 -->|<<include>>| UC8
        UC3 -->|<<include>>| UC9
        UC4 -->|<<include>>| UC10

        UC4 -.->|<<extend>>| UC11
        UC3 -.->|<<extend>>| UC12
    end

    GitHub --> UC8
    AI --> UC9
    DB --> UC12
    DB --> UC1
