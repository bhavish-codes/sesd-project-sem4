```mermaid
erDiagram

    USER {
        string id PK
        string name
        string email
        string oauth_provider
        datetime created_at
    }

    SESSION {
        string id PK
        string user_id FK
        string access_token
        datetime expires_at
    }

    PROFILE {
        string id PK
        string github_username
        string profile_url
        string raw_data
        datetime fetched_at
    }

    REPORT {
        string id PK
        string user_id FK
        string profile_id FK
        string summary
        string skills
        string suggestions
        datetime created_at
    }

    USER ||--o{ SESSION : has
    USER ||--o{ REPORT : owns
    PROFILE ||--o{ REPORT : analyzed_for
