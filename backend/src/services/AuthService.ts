import { prisma } from "../../lib/prisma";
import { User } from "../models/User";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI!;

export class AuthService {
  /** Exchange OAuth code for an access token from GitHub */
  async exchangeCodeForToken(code: string): Promise<string> {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: GITHUB_REDIRECT_URI,
      }),
    });

    const data = (await response.json()) as any;
    if (data.error) {
      throw new Error(data.error_description || data.error);
    }
    return data.access_token as string;
  }

  /** Fetch the authenticated GitHub user's data using their access token */
  async fetchGitHubUser(accessToken: string): Promise<any> {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    return await response.json();
  }

  /**
   * Full OAuth flow:
   *  1. Exchange code → access token
   *  2. Fetch GitHub user data
   *  3. Upsert User in MongoDB (unique by githubId)
   *  Returns the DB User record + the access token + raw GitHub data
   */
  async loginWithOAuth(
    code: string
  ): Promise<{ user: User; accessToken: string; githubUserData: any }> {
    console.log("🔐 Exchanging OAuth code for access token...");
    const accessToken = await this.exchangeCodeForToken(code);

    console.log("👤 Fetching GitHub user data...");
    const ghUser = await this.fetchGitHubUser(accessToken);
    console.log(`   GitHub user: ${ghUser.login} (id: ${ghUser.id})`);

    const record = await prisma.user.upsert({
      where: { githubId: String(ghUser.id) },
      update: {
        name: ghUser.name || ghUser.login,
        login: ghUser.login,
        email: ghUser.email || null,
        avatarUrl: ghUser.avatar_url || null,
        bio: ghUser.bio || null,
      },
      create: {
        githubId: String(ghUser.id),
        name: ghUser.name || ghUser.login,
        login: ghUser.login,
        email: ghUser.email || null,
        avatarUrl: ghUser.avatar_url || null,
        bio: ghUser.bio || null,
      },
    });

    console.log(`✅ User upserted in DB: ${record.name} (${record.id})`);
    return { user: User.fromPrisma(record), accessToken, githubUserData: ghUser };
  }

  /** Placeholder — integrate JWT / express-session here */
  storeSession(user: User): void {
    console.log(`Storing session for user ID: ${user.id}`);
  }

  validateSession(): boolean {
    return true;
  }
}
