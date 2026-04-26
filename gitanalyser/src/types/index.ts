export type Screen = "AUTH" | "LOADING" | "RESULT" | "MULTI_RESULT";

export interface LanguageData {
  [key: string]: number;
}

export interface ContributionDay {
  date: string;
  contributionCount: number;
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: {
    contributionDays: ContributionDay[];
  }[];
}

export interface ProfileData {
  name: string | null;
  login: string;
  avatarUrl: string | null;
  bio: string | null;
  followers: number | string;
  following: number | string;
  public_repos: number;
  location: string | null;
  company?: string | null;
  username: string;
  commits: number | string;
  repos: number | string;
  languages: LanguageData;
  contributions: ContributionCalendar;
}

export type AppData = ProfileData | { login: string } | null;
