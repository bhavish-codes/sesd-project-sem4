import { prisma } from "../../lib/prisma";
import { ProfileData } from "../models/ProfileData";

export class GitHubService {
  /**
   * Fetch real GitHub profile data using the authenticated user's access token.
   * Stores/updates the profile in MongoDB.
   */
  async fetchAndStoreProfile(
    accessToken: string,
    userId: string,
    githubUserData: any
  ): Promise<ProfileData> {
    const { login, public_repos, followers, following } = githubUserData;

    console.log(`📦 Fetching repositories for ${login}...`);

    // Fetch repos (up to 30, sorted by most recently updated)
    const reposRes = await fetch(
      `https://api.github.com/user/repos?per_page=30&sort=updated&type=owner`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const repos: any[] = reposRes.ok ? await reposRes.json() : [];

    // Build a simplified repositories list
    const repositories = repos.map((r: any) => ({
      name: r.name,
      language: r.language || "Unknown",
      stars: r.stargazers_count ?? 0,
      description: r.description || "",
      url: r.html_url,
    }));

    // Aggregate language usage from primary language per repo
    const langCount: Record<string, number> = {};
    for (const r of repos) {
      if (r.language) {
        langCount[r.language] = (langCount[r.language] ?? 0) + 1;
      }
    }

    const totalWithLang = Object.values(langCount).reduce((a, b) => a + b, 0);
    const languages = Object.entries(langCount)
      .map(([name, count]) => ({
        name,
        percentage: totalWithLang > 0 ? Math.round((count / totalWithLang) * 100) : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 6); // top 6 languages

    const activityStats = {
      publicRepos: public_repos ?? 0,
      followers: followers ?? 0,
      following: following ?? 0,
    };

    console.log(
      `✅ Profile built: ${repositories.length} repos, ${languages.length} langs`
    );

    // Upsert profile in MongoDB
    const record = await prisma.profileData.upsert({
      where: { userId },
      update: {
        username: login,
        repositories,
        languages,
        activityStats,
      },
      create: {
        username: login,
        repositories,
        languages,
        activityStats,
        userId,
      },
    });

    console.log(`💾 Profile stored for ${record.username} (id: ${record.id})`);
    return ProfileData.fromPrisma(record);
  }

  /** Fetch repositories for a username (cached from DB first) */
  async fetchRepositories(username: string): Promise<any[]> {
    const profile = await prisma.profileData.findUnique({
      where: { username },
    });

    if (profile) {
      return profile.repositories as any[];
    }

    return [];
  }
}
