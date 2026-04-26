import { prisma } from "../../lib/prisma.js";

export class GitHubService {
  /**
   * Fetch real GitHub profile data.
   * If accessToken is provided, it fetches from /user/repos (private + public).
   * If not, it expects repos to be passed in (from public fetch).
   */
  public async fetchAndStoreProfile(
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

  /**
   * Fetch profile data for a public GitHub URL.
   */
  public async fetchPublicProfile(githubUrl: string, userId?: string): Promise<any> {
    const username = githubUrl.replace(/\/$/, "").split("/").pop() || "unknown";
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };

    if (GITHUB_TOKEN) {
      headers["Authorization"] = `token ${GITHUB_TOKEN}`;
    }

    // 🔹 1. USER DATA
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers,
    });
    const userData = userRes.ok ? await userRes.json() : {};

    // 🔹 2. EXTERNAL LANGUAGE AGGREGATION (github-readme-stats)
    let langPercent: Record<string, number> = {};
    try {
      const svgRes = await fetch(`https://github-readme-stats.vercel.app/api/top-langs/?username=${username}`);
      if (svgRes.ok) {
        const svgText = await svgRes.text();
        const regex = /data-testid="lang-name"[\s\S]*?>([^<]+)<\/text>[\s\S]*?class="lang-name">([^<]+)%<\/text>/g;
        let match;
        while ((match = regex.exec(svgText)) !== null) {
          langPercent[match[1]] = parseFloat(match[2]);
        }
      }
    } catch (error) {
      console.error("[GitHubService] Failed to fetch language stats:", error);
    }

    // 🔹 4. GRAPHQL (commits + heatmap)
    let contributions = null;

    if (GITHUB_TOKEN) {
      const graphRes = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
        {
          user(login: "${username}") {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                  }
                }
              }
            }
          }
        }
      `,
        }),
      });

      const graphData = await graphRes.json();
      contributions =
        graphData?.data?.user?.contributionsCollection?.contributionCalendar ||
        null;
    }

    // 🔹 FINAL STRUCTURED DATA
    const result = {
      profile: {
        name: userData.name,
        login: userData.login,
        avatar: userData.avatar_url,
        bio: userData.bio,
        followers: userData.followers,
        following: userData.following,
        public_repos: userData.public_repos,
        location: userData.location,
      },
      stats: {
        totalRepos: userData.public_repos || 0,
        totalFollowers: userData.followers,
        totalFollowing: userData.following,
      },
      languages: langPercent,
      contributions,
      repos: [],
    };

    // 🔹 5. PERSIST TO SEARCH HISTORY (New feature)
    try {
      if (userData.login) {
        const topLanguage = Object.entries(langPercent).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown";
        await prisma.searchHistory.upsert({
          where: { username: userData.login },
          update: {
            name: userData.name,
            avatarUrl: userData.avatar_url,
            location: userData.location,
            totalCommits: contributions?.totalContributions || 0,
            topLanguage,
            searchedAt: new Date(),
          },
          create: {
            username: userData.login,
            name: userData.name,
            avatarUrl: userData.avatar_url,
            location: userData.location,
            totalCommits: contributions?.totalContributions || 0,
            topLanguage,
          },
        });
      }
    } catch (err) {
      console.error("[GitHubService] Failed to save search history:", err);
    }

    return result;
  }
}
