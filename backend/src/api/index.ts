import "dotenv/config";

// Vercel production URLs
const FRONTEND_URL = "https://sesd-project-sem4-lszv.vercel.app";

// ─── Health check ───
export default async function handler(req: any, res: any) {
  const { url } = req;

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Cookie");
    return res.status(200).end();
  }

  try {
    // ─── Root ───
    if (url === "/") {
      return res.json({
        status: "ok",
        message: "Git Analyser API is running 🚀",
      });
    }

    // ─── GitHub Profile Data ───
    if (url?.startsWith("/api/github/")) {
      const username = url.split("/api/github/")[1];
      const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

      if (!GITHUB_TOKEN) {
        return res.status(500).json({ error: "GitHub token not configured" });
      }

      const headers = {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      };

      // Fetch user info + top 5 repos in parallel
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`, { headers }),
        fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`,
          { headers },
        ),
      ]);

      if (!userRes.ok) {
        return res.status(userRes.status).json({ error: "User not found" });
      }
      const userData = await userRes.json();
      const reposData = await reposRes.json();

      // Fetch languages in parallel
      const languageTotals: Record<string, number> = {};

      if (Array.isArray(reposData)) {
        const langPromises = reposData.map(async (repo: any) => {
          try {
            const langRes = await fetch(repo.languages_url, { headers });
            return await langRes.json();
          } catch {
            return {};
          }
        });

        const langResults = await Promise.all(langPromises);

        for (const langs of langResults) {
          for (const [lang, bytes] of Object.entries(langs)) {
            languageTotals[lang] =
              (languageTotals[lang] || 0) + (bytes as number);
          }
        }
      }

      // Get total contributions from GraphQL
      let totalCommits = 0;
      try {
        const graphqlQuery = {
          query: `
            query($username: String!) {
              user(login: $username) {
                contributionsCollection {
                  contributionCalendar {
                    totalContributions
                  }
                }
              }
            }
          `,
          variables: { username },
        };

        const graphqlRes = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(graphqlQuery),
        });

        if (graphqlRes.ok) {
          const graphqlData = await graphqlRes.json();
          totalCommits =
            graphqlData?.data?.user?.contributionsCollection
              ?.contributionCalendar?.totalContributions || 0;
        }
      } catch (graphqlErr) {
        console.error("GraphQL error:", graphqlErr);
      }

      // Language breakdown (top 3)
      const totalBytes = Object.values(languageTotals).reduce(
        (a, b) => a + b,
        0,
      );
      const languageBreakdown = Object.entries(languageTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([lang, bytes]) => ({
          lang,
          pct: totalBytes ? Math.round((bytes / totalBytes) * 100) : 0,
        }));

      return res.json({
        name: userData.name,
        login: userData.login,
        username: userData.login,
        avatar_url: userData.avatar_url,
        bio: userData.bio,
        location: userData.location,
        company: userData.company,
        repos: userData.public_repos,
        followers: userData.followers,
        commits: totalCommits,
        languages: languageBreakdown,
      });
    }

    // ─── Auth: OAuth login ───
    if (url === "/api/auth/github") {
      const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
      const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=user`;
      return res.redirect(authUrl);
    }

    // Default 404
    return res.status(404).json({ error: "Not found" });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: String(err) });
  }
}
