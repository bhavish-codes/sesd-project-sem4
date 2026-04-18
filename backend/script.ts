import { prisma } from "./lib/prisma";
import { AuthService } from "./src/services/AuthService";
import { Database } from "./src/services/Database";
import { GitHubService } from "./src/services/GitHubService";
import { Report } from "./src/models/Report";

async function main() {
  const authService = new AuthService();
  const database = new Database();
  const githubService = new GitHubService();

  // 1. Authenticate user (creates/finds in MongoDB)
  console.log("=== Step 1: OAuth Login ===");
  const user = await authService.loginWithOAuth("mock-oauth-code-123");
  console.log("Logged in user:", user);

  // 2. Save / update user in DB
  console.log("\n=== Step 2: Save User ===");
  const savedUser = await database.saveUser(user);
  console.log("Saved user:", savedUser);

  // 3. Fetch GitHub profile and store it
  console.log("\n=== Step 3: Fetch & Store GitHub Profile ===");
  const profile = await githubService.fetchPublicProfile(
    "https://github.com/bhavish-dhar",
    savedUser.id
  );
  console.log("Profile data:", profile);

  // 4. Fetch repositories (reads from DB cache)
  console.log("\n=== Step 4: Fetch Repositories ===");
  const repos = await githubService.fetchRepositories(profile.username);
  console.log("Repositories:", repos);

  // 5. Create and save a report
  console.log("\n=== Step 5: Save Report ===");
  const report = new Report(
    "", // ID will be assigned by MongoDB
    "Strong full-stack profile with TypeScript focus",
    ["TypeScript", "React", "Node.js", "MongoDB"],
    ["Explore Rust for systems programming", "Add CI/CD to projects"]
  );
  const savedReport = await database.saveReport(savedUser.id, report);
  console.log("Saved report:", savedReport);

  // 6. Fetch all reports for the user
  console.log("\n=== Step 6: Get User Reports ===");
  const reports = await database.getUserReports(savedUser.id);
  console.log("User reports:", JSON.stringify(reports, null, 2));

  // 7. Verify full data with relations
  console.log("\n=== Step 7: Full User with Relations ===");
  const fullUser = await prisma.user.findUnique({
    where: { id: savedUser.id },
    include: {
      profile: true,
      reports: true,
    },
  });
  console.log("Full user data:", JSON.stringify(fullUser, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("\n✅ All done! Prisma client disconnected.");
  })
  .catch(async (e) => {
    console.error("❌ Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
