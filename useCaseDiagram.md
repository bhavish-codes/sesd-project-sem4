```mermaid
flowchart LR

%% Actors
User((User))
GitHubAPI((GitHub API))
AIService((AI Analysis Service))
Database((Database))

%% System Boundary
subgraph GitHub_Profile_Reviewer_System

Register(Register / Login)
PasteURL(Paste GitHub Profile URL)
FetchData(Fetch Profile Data)
AnalyzeProfile(Analyze Profile)
AIProcessing(AI Processing)
GenerateReport(Generate Evaluation Report)
SkillSummary(View Skill Summary)
Suggestions(View Improvement Suggestions)
DownloadReport(Download Report)
SaveReport(Save Report to Dashboard)
Logout(Logout)

end

%% User interactions
User --> Register
User --> PasteURL
User --> AnalyzeProfile
User --> GenerateReport
User --> SkillSummary
User --> Suggestions
User --> Logout

%% System includes
AnalyzeProfile --> FetchData
AnalyzeProfile --> AIProcessing
GenerateReport --> SkillSummary
GenerateReport --> Suggestions

%% Optional extensions
GenerateReport -.-> DownloadReport
AnalyzeProfile -.-> SaveReport

%% External systems
GitHubAPI --> FetchData
AIService --> AIProcessing
Database --> SaveReport
Database --> Register
