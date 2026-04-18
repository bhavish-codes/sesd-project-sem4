import { prisma } from "../../lib/prisma";
import { ProfileData } from "../models/ProfileData";

export class GitHubService {
  /** Fetch a public GitHub profile and store it in DB linked to a user */
  async fetchPublicProfile(url: string, userId: string): Promise<ProfileData> {
    console.log(`Fetching public profile from URL: ${url}`);

    // Simulated data — replace with actual GitHub API call
    const mockRepos = [{ name: "repo1" }, { name: "repo2" }];
    const mockLangs = [
      { name: "TypeScript", percentage: 80 },
      { name: "CSS", percentage: 20 },
    ];
    const mockStats = { commits: 14000, followers: 203000 };
    const username = url.split("/").pop() || "unknown";

    // Upsert profile data in MongoDB
    const record = await prisma.profileData.upsert({
      where: { userId: userId },
      update: {
        username: username,
        repositories: mockRepos,
        languages: mockLangs,
        activityStats: mockStats,
      },
      create: {
        username: username,
        repositories: mockRepos,
        languages: mockLangs,
        activityStats: mockStats,
        userId: userId,
      },
    });

    console.log(`Stored profile for ${record.username} (id: ${record.id})`);
    return ProfileData.fromPrisma(record);
  }

  /** Fetch repositories for a username */
  async fetchRepositories(username: string): Promise<any[]> {
    console.log(`Fetching repositories for username: ${username}`);

    // Check if we have cached profile data
    const profile = await prisma.profileData.findUnique({
      where: { username: username },
    });

    if (profile) {
      console.log(`Found cached profile data for ${username}`);
      return profile.repositories as any[];
    }

    // Fallback mock — replace with GitHub API call
    return [{ name: "repo1" }, { name: "repo2" }, { name: "repo3" }];
  }
}
