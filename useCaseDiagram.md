graph LR

    %% Actors
    U((User))
    G((GitHub API))
    AI((AI Analysis Service))
    DB((Database))

    %% System Boundary
    subgraph System["GitHub Profile Reviewer System"]
        direction TB

        %% Authentication
        subgraph Auth["Authentication"]
            UC1(Register)
            UC2(Login)
            UC3(Logout)
        end

        %% Profile Input
        subgraph Input["Profile Processing"]
            UC4(Paste GitHub Profile URL)
            UC5(Fetch Profile Data)
            UC6(Analyze Profile)
            UC7(AI Processing)
        end

        %% Results
        subgraph Results["Evaluation & Insights"]
            UC8(Generate Evaluation Report)
            UC9(View Skill Summary)
            UC10(View Improvement Suggestions)
            UC11(Download Report)
            UC12(Save Report to Dashboard)
        end
    end

    %% User Relations
    U --> UC1
    U --> UC2
    U --> UC3
    U --> UC4
    U --> UC6
    U --> UC8
    U --> UC9
    U --> UC10

    %% External Systems
    G --> UC5
    AI --> UC7
    DB --> UC12
    DB --> UC1

    %% Include Relationships
    UC6 --> UC5
    UC6 --> UC7
    UC8 --> UC9
    UC8 --> UC10

    %% Extend Relationships
    UC8 -.-> UC11
    UC6 -.-> UC12

    %% Styling
    style U fill:#f9f,stroke:#333,stroke-width:2px
    style G fill:#bbf,stroke:#333,stroke-width:2px
    style AI fill:#bbf,stroke:#333,stroke-width:2px
    style DB fill:#bbf,stroke:#333,stroke-width:2px
