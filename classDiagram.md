```mermaid
classDiagram

    class User {
        +id: string
        +name: string
        +email: string
        +login()
        +logout()
    }

    class AuthService {
        +loginWithOAuth(code: string)
        +storeSession(user: User)
        +validateSession()
    }

    class GitHubService {
        +fetchPublicProfile(url: string)
        +fetchRepositories(username: string)
    }

    class AIAnalysisService {
        +analyzeProfile(data: ProfileData)
        +generateSkillSummary()
        +generateImprovementSuggestions()
    }

    class ProfileAnalyzer {
        +analyze(url: string)
        +generateReport()
    }

    class Report {
        +id: string
        +summary: string
        +skills: string[]
        +suggestions: string[]
        +download()
    }

    class Database {
        +saveUser(user: User)
        +saveReport(report: Report)
        +getUserReports(userId: string)
    }

    class ProfileData {
        +username: string
        +repositories: list
        +languages: list
        +activityStats: object
    }

    %% Relationships
    User --> AuthService
    AuthService --> Database
    ProfileAnalyzer --> GitHubService
    ProfileAnalyzer --> AIAnalysisService
    ProfileAnalyzer --> Report
    AIAnalysisService --> ProfileData
    GitHubService --> ProfileData
    Database --> Report
