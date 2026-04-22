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

    // 🔹 2. GET ALL REPOS (pagination)
    let page = 1;
    let allRepos: any[] = [];

    while (true) {
      const res = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&page=${page}`,
        { headers },
      );

      const repos = res.ok ? await res.json() : [];

      if (!repos.length) break;

      allRepos = [...allRepos, ...repos];
      page++;
    }

    // 🔹 3. LANGUAGE AGGREGATION
    const langStats: Record<string, number> = {};

    for (const repo of allRepos) {
      const langRes = await fetch(repo.languages_url, { headers });
      const langs = langRes.ok ? await langRes.json() : {};

      for (const lang in langs) {
        langStats[lang] = (langStats[lang] || 0) + langs[lang];
      }
    }

    // Convert to percentage
    const total = Object.values(langStats).reduce((a, b) => a + b, 0);
    const langPercent: Record<string, number> = {};

    for (const lang in langStats) {
      langPercent[lang] = total ? (langStats[lang] / total) * 100 : 0;
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
        totalRepos: allRepos.length,
        totalFollowers: userData.followers,
        totalFollowing: userData.following,
      },
      languages: langPercent,
      contributions,
      repos: allRepos,
    };

    // 🔐 OPTIONAL: store in DB
    // if (userId) {
    //   await this.fetchAndStoreProfile("", userId, result.profile, allRepos);
    // }

    return result;
  }
}
