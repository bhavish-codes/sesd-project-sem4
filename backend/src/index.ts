import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "../lib/prisma.js";
import { AuthService } from "./services/AuthService.js";
import { GitHubService } from "./services/GitHubService.js";

// Mode detection
const isProd = process.env.NODE_ENV === "production";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Service singletons
const authSvc = new AuthService();
const githubSvc = new GitHubService();

// ─── Health check ───
app.get("/", (_req, res) => res.json({ status: "ok", message: "API is running 🚀" }));

// ─── Auth ───
app.get("/api/auth/github", (_req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=user`;
  res.redirect(url);
});

app.get("/api/auth/callback", async (req, res) => {
  try {
    const code = req.query.code as string;
    if (!code) return res.status(400).send("No code provided");

    const { user, accessToken, githubUserData } = await authSvc.loginWithOAuth(code);
    await githubSvc.fetchAndStoreProfile(accessToken, user.id, githubUserData);

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });

    res.redirect(FRONTEND_URL);
  } catch (error) {
    console.error("Auth error:", error);
    res.redirect(`${FRONTEND_URL}/error`);
  }
});

app.get("/api/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ loggedIn: false });

  try {
    const users = await prisma.user.findMany({ take: 1, orderBy: { id: "desc" } });
    if (users.length > 0) {
      return res.json({ loggedIn: true, ...users[0], commits: Math.floor(Math.random() * 100) + 10 });
    }
    res.json({ loggedIn: false });
  } catch (err) {
    res.json({ loggedIn: false });
  }
});

// ─── Users & Profiles ───
app.get("/api/users", async (_req, res) => {
  res.json(await prisma.user.findMany());
});

app.post("/api/profile/:userId", async (req, res) => {
  try {
    const profile = await githubSvc.fetchPublicProfile(req.body.githubUrl || "", req.params.userId);
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ─── Reports ───
app.get("/api/reports/:userId", async (req, res) => {
  res.json(await prisma.report.findMany({ where: { userId: req.params.userId } }));
});

app.post("/api/reports/:userId", async (req, res) => {
  try {
    const { summary, skills, suggestions } = req.body;
    const report = await prisma.report.create({
      data: { summary, skills: skills || [], suggestions: suggestions || [], userId: req.params.userId }
    });
    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ─── GitHub Data ───
app.get("/api/github/:username", async (req, res) => {
  try {
    const profile = await githubSvc.fetchPublicProfile(`https://github.com/${req.params.username}`, "temp");
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// ─── Start server ───
if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
}

export default app;
