import "dotenv/config";
import express from "express";
import { prisma } from "../lib/prisma";
import { Database } from "./services/Database";
import { AuthService } from "./services/AuthService";
import { GitHubService } from "./services/GitHubService";
import { Report } from "./models/Report";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

const database = new Database();
const authService = new AuthService();
const githubService = new GitHubService();

// ─── Health check ───
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Git Analyser API is running 🚀" });
});

// ─── Auth: OAuth login ───
app.post("/api/auth/login", async (req, res) => {
  try {
    const { code } = req.body;
    const user = await authService.loginWithOAuth(code || "mock-code");
    authService.storeSession(user);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// ─── Users ───
app.get("/api/users", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { profile: true, reports: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await database.findUserById(req.params.id);
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
    const profile = await githubService.fetchPublicProfile(
      githubUrl || "https://github.com/unknown",
      req.params.userId
    );
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ─── Reports ───
app.get("/api/reports/:userId", async (req, res) => {
  try {
    const reports = await database.getUserReports(req.params.userId);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.post("/api/reports/:userId", async (req, res) => {
  try {
    const { summary, skills, suggestions } = req.body;
    const report = new Report("", summary, skills || [], suggestions || []);
    const saved = await database.saveReport(req.params.userId, report);
    res.status(201).json({ success: true, report: saved });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ─── Start server ───
app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`   Routes:`);
  console.log(`   GET  /                     - Health check`);
  console.log(`   POST /api/auth/login       - OAuth login`);
  console.log(`   GET  /api/users            - List all users`);
  console.log(`   GET  /api/users/:id        - Get user by ID`);
  console.log(`   POST /api/profile/:userId  - Fetch & store GitHub profile`);
  console.log(`   GET  /api/reports/:userId  - Get user reports`);
  console.log(`   POST /api/reports/:userId  - Create a report\n`);
});
