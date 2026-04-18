import { prisma } from "../../lib/prisma";
import { User } from "../models/User";

export class AuthService {
  /** Authenticate via OAuth code — finds or creates user in DB */
  async loginWithOAuth(code: string): Promise<User> {
    console.log(`Authenticating with OAuth code: ${code}`);

    // In a real app, exchange the code with GitHub for an access token,
    // then fetch user info. Here we simulate the result.
    const oauthEmail = "oauth@github.com";
    const oauthName = "OAuth User";

    const record = await prisma.user.upsert({
      where: { email: oauthEmail },
      update: { name: oauthName },
      create: { name: oauthName, email: oauthEmail },
    });

    console.log(`User authenticated: ${record.name} (${record.id})`);
    return User.fromPrisma(record);
  }

  /** Store session info (placeholder — integrate with express-session / JWT) */
  storeSession(user: User): void {
    console.log(`Storing session for user ID: ${user.id}`);
  }

  /** Validate current session (placeholder) */
  validateSession(): boolean {
    console.log("Validating current session...");
    return true;
  }
}
