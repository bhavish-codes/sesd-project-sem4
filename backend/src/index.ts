import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "../lib/prisma.js";
import { AuthService } from "./services/AuthService.js";
import { GitHubService } from "./services/GitHubService.js";
import jwt from "jsonwebtoken";

const isProd = process.env.NODE_ENV === "production";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || ""
const app = express();


interface JwtUserPayload {
  userId: string;
}
// Robust CORS for Vercel cross-domain cookies
const allowedOrigins = [FRONTEND_URL, "https://sesd-project-sem4-lszv.vercel.app"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || isProd) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

const authSvc = new AuthService();
const githubSvc = new GitHubService();

const router = express.Router();

// ─── Health check ───
router.get("/", (_req, res) => res.json({ status: "ok", message: "API is running 🚀" }));

// ─── Auth ───
router.get("/auth/github", (_req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return res.status(500).json({ 
      error: "OAUTH_CONFIG_MISSING", 
      message: "GitHub Client ID or Redirect URI not configured in Vercel environment variables." 
    });
  }

  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user`;
  res.redirect(url);
});

router.get("/auth/callback", async (req, res) => {
  try {
    const code = req.query.code as string;
    if (!code) return res.status(400).send("No code provided");

    const { user, accessToken, githubUserData } = await authSvc.loginWithOAuth(code);
    await githubSvc.fetchAndStoreProfile(accessToken, user.id, githubUserData);
    
    const jwtToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "24h" });
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/", // Explicitly set path to root
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.redirect(FRONTEND_URL);
  } catch (error) {
    console.error("Auth error:", error);
    res.redirect(`${FRONTEND_URL}/error`);
  }
});

router.get("/me", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ loggedIn: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtUserPayload;

    // 👇 extract userId from token
    const userId = decoded.userId;

    // 👇 fetch correct user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.json({ loggedIn: false });
    }

    res.json({
      loggedIn: true,
      user,
    });
  } catch (err) {
    return res.json({ loggedIn: false });
  }
});

// ─── Users & Profiles ───
router.get("/users", async (_req, res) => {
  res.json(await prisma.user.findMany());
});

router.post("/profile/:userId", async (req, res) => {
  try {
    const profile = await githubSvc.fetchPublicProfile(req.body.githubUrl || "", req.params.userId);
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ─── Reports ───
router.get("/reports/:userId", async (req, res) => {
  res.json(await prisma.report.findMany({ where: { userId: req.params.userId } }));
});

router.post("/reports/:userId", async (req, res) => {
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

// ─── Search History (Targets) ───
router.get("/targets", async (_req, res) => {
  try {
    const targets = await prisma.searchHistory.findMany({
      orderBy: { searchedAt: "desc" },
    });
    res.json(targets);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// ─── GitHub Data ───
router.get("/github/:username", async (req, res) => {
  try {
    const profile = await githubSvc.fetchPublicProfile(`https://github.com/${req.params.username}`);
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Mount router on both /api and root to avoid Vercel routing confusion
app.use("/api", router);
app.use("/", router);

// Final 404 handler for debugging
app.use((req, res) => {
  res.status(404).json({ 
    error: "NOT_FOUND", 
    message: `Route ${req.method} ${req.url} not matched in Express.`,
    debugPath: req.path
  });
});

// ─── Start server ───
if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
}

export default app;
