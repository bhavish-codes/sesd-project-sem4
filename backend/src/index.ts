import "dotenv/config";
import express from "express";
import { Database } from "./services/Database.js";
import { AuthService } from "./services/AuthService.js";
import { GitHubService } from "./services/GitHubService.js";
import { Report } from "./models/Report.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// Vercel production URLs
const FRONTEND_URL = "https://sesd-project-sem4-lszv.vercel.app";
const BACKEND_URL = "https://sesd-project-sem4.vercel.app";

const app = express();
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

const PORT = 3001;

// Lazy load services to avoid cold start errors
const getDatabase = () => new Database();
const getAuthService = () => new AuthService();
const getGitHubService = () => new GitHubService();

// Vercel serverless export
export default app;

// ─── Health check ───
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Git Analyser API is running 🚀" });
});

// ─── Auth: OAuth login ───
app.get("/api/auth/github", (req, res) => {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;
  const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=user`;
  res.redirect(url);
});

app.get("/api/auth/callback", async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).send("No code provided");

    const authSvc = getAuthService();
    const githubSvc = getGitHubService();

    const { user, accessToken, githubUserData } = await authSvc.loginWithOAuth(
      code as string,
    );

    await githubSvc.fetchAndStoreProfile(accessToken, user.id, githubUserData);

    // ✅ secure session
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.redirect(`${FRONTEND_URL}`);
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.redirect(`${FRONTEND_URL}/error`);
  }
});

// ─── Users ───
app.get("/api/me", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    // No token = not logged in, return empty user (not an error)
    return res.json({ loggedIn: false });
  }

  try {
    // Try to get user from database first (stored during OAuth)
    const db = getDatabase();
    const users = await db.getAllUsers();
    if (users.length > 0) {
      // Return the most recent user
      const user = users[users.length - 1];
      return res.json({
        loggedIn: true,
        ...user,
        // Mock commit count for demo
        commits: Math.floor(Math.random() * 100) + 10,
      });
    }

    // Fallback: try GitHub API
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!userRes.ok) {
      return res.json({ loggedIn: false });
    }

    const user = await userRes.json();
    res.json({ loggedIn: true, ...user, commits: 0 });
  } catch (err) {
    console.error("/api/me error:", err);
    // Return empty user instead of 500 to prevent frontend errors
    res.json({ loggedIn: false });
  }
});

app.get("/api/users", async (_req, res) => {
  try {
    const db = getDatabase();
    const users = await db.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const db = getDatabase();
    const user = await db.findUserById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ─── Profile ───
app.post("/api/profile/:userId", async (req, res) => {
  try {
    const { githubUrl } = req.body;
    const githubSvc = getGitHubService();
    const profile = await githubSvc.fetchPublicProfile(
      githubUrl || "https://github.com/unknown",
      req.params.userId,
    );
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ─── Reports ───
app.get("/api/reports/:userId", async (req, res) => {
  try {
    const db = getDatabase();
    const reports = await db.getUserReports(req.params.userId);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.post("/api/reports/:userId", async (req, res) => {
  try {
    const { summary, skills, suggestions } = req.body;
    const report = new Report("", summary, skills || [], suggestions || []);
    const db = getDatabase();
    const saved = await db.saveReport(req.params.userId, report);
    res.status(201).json({ success: true, report: saved });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ─── GitHub Profile Data ───
app.get("/api/github/:username", async (req, res) => {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: "GitHub token not configured" });
  }

  const { username } = req.params;
  const headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  };

  try {
    // 1. Fetch user info + top 5 repos in parallel
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

    // 2. Fetch languages in parallel for top 5 repos
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

    // 3. Get total contributions from GitHub GraphQL API (like streak stats)
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
          graphqlData?.data?.user?.contributionsCollection?.contributionCalendar
            ?.totalContributions || 0;
      }
    } catch (graphqlErr) {
      console.error("GraphQL error:", graphqlErr);
    }

    // Language breakdown (top 3)
    const totalBytes = Object.values(languageTotals).reduce((a, b) => a + b, 0);
    const languageBreakdown = Object.entries(languageTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([lang, bytes]) => ({
        lang,
        pct: totalBytes ? Math.round((bytes / totalBytes) * 100) : 0,
      }));

    res.json({
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
  } catch (err) {
    console.error("/api/github/:username error:", err);
    res.status(500).json({ error: String(err) });
  }
});

// ─── Start server ───
app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`   Routes:`);
  console.log(`   GET  /                     - Health check`);
  console.log(`   GET  /api/auth/github      - Start GitHub OAuth`);
  console.log(`   GET  /api/auth/callback    - GitHub OAuth callback`);
  console.log(`   GET  /api/users            - List all users`);
  console.log(`   GET  /api/users/:id        - Get user by ID`);
  console.log(`   POST /api/profile/:userId  - Fetch & store GitHub profile`);
  console.log(`   GET  /api/reports/:userId  - Get user reports`);
  console.log(`   POST /api/reports/:userId  - Create a report`);
  console.log(`   GET  /api/github/:username - Get GitHub profile data\n`);
});
