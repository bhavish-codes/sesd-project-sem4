import { prisma } from "../../lib/prisma.js";

export class GitHubService {
  /**
   * Fetch real GitHub profile data.
   * If accessToken is provided, it fetches from /user/repos (private + public).
   * If not, it expects repos to be passed in (from public fetch).
   */
  async fetchAndStoreProfile(
    accessToken: string,
    userId: string,
    githubUserData: any,
    providedRepos?: any[],
  ): Promise<any> {
    const { login, public_repos, followers, following } = githubUserData;

    let repos = providedRepos;

    if (!repos && accessToken) {
      console.log(`📦 Fetching authenticated repositories for ${login}...`);
      const reposRes = await fetch(
        `https://api.github.com/user/repos?per_page=30&sort=updated&type=owner`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        },
      );
      repos = reposRes.ok ? await reposRes.json() : [];
    }

    if (!repos) repos = [];

    console.log(`🔨 Processing ${repos.length} repositories for ${login}...`);

    // Build a simplified repositories list
    const repositories = repos.map((r: any) => ({
      name: r.name,
      language: r.language || "Unknown",
      stars: r.stargazers_count ?? 0,
      description: r.description || "",
      url: r.html_url,
    }));

    // Aggregate language usage
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
        percentage:
          totalWithLang > 0 ? Math.round((count / totalWithLang) * 100) : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 6);

    const activityStats = {
      publicRepos: public_repos ?? 0,
      followers: followers ?? 0,
      following: following ?? 0,
    };

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

    console.log(`✅ Profile synced for ${record.username}`);
    return record;
  }

  /** Fetch repositories from DB */
  async fetchRepositories(username: string): Promise<any[]> {
    const profile = await prisma.profileData.findUnique({ where: { username } });
    return (profile?.repositories as any[]) || [];
  }

  /**
   * Fetch profile data for a public GitHub URL.
   */
  async fetchPublicProfile(githubUrl: string, userId: string): Promise<any> {
    const username = githubUrl.split("/").pop() || "unknown";
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };
    if (GITHUB_TOKEN) {
      headers["Authorization"] = `token ${GITHUB_TOKEN}`;
    }

    // 1. Fetch user data
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    const userData = userRes.ok ? await userRes.json() : {};

    // 2. Fetch repos (Public endpoint)
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=30&sort=updated`,
      { headers },
    );
    const repos: any[] = reposRes.ok ? await reposRes.json() : [];

    // Pass the already fetched repos to avoid the token-less /user/repos call
    return this.fetchAndStoreProfile("", userId, {
      ...userData,
      login: username,
      public_repos: userData.public_repos || 0,
      followers: userData.followers || 0,
      following: userData.following || 0,
    }, repos);
  }
}
