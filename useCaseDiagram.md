flowchart LR

User([User])
GitHubAPI([GitHub API])
AIService([AI Analysis Service])
DB([Database])

subgraph System["GitHub Profile Reviewer System"]

U1((Register / Login))
U2((Paste GitHub Profile URL))
U3((Analyze Profile))
U4((View AI Evaluation Report))
U5((View Skill Summary))
U6((View Improvement Suggestions))
U7((Logout))

I1((Fetch Profile Data))
I2((AI Processing))
I3((Generate Summary))
E1((Download Report))
E2((Save Report to Dashboard))

end

User --> U1
User --> U2
User --> U3
User --> U4
User --> U5
User --> U6
User --> U7

U3 -->|<<include>>| I1
U3 -->|<<include>>| I2
U4 -->|<<include>>| I3

U4 -.->|<<extend>>| E1
U3 -.->|<<extend>>| E2

GitHubAPI --> I1
AIService --> I2
DB --> E2
DB --> U1
