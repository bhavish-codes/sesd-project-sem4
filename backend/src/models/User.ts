export class User {
  id: string;
  githubId: string;
  name: string;
  login: string | null;
  email: string | null;
  avatarUrl: string | null;
  bio: string | null;

  constructor(
    id: string,
    githubId: string,
    name: string,
    login: string | null,
    email: string | null,
    avatarUrl: string | null,
    bio: string | null
  ) {
    this.id = id;
    this.githubId = githubId;
    this.name = name;
    this.login = login;
    this.email = email;
    this.avatarUrl = avatarUrl;
    this.bio = bio;
  }

  login_action(): void {
    console.log(`User ${this.name} logged in`);
  }

  logout(): void {
    console.log(`User ${this.name} logged out`);
  }

  /** Create a User instance from a Prisma record */
  static fromPrisma(data: {
    id: string;
    githubId: string;
    name: string;
    login?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
  }): User {
    return new User(
      data.id,
      data.githubId,
      data.name,
      data.login ?? null,
      data.email ?? null,
      data.avatarUrl ?? null,
      data.bio ?? null
    );
  }
}
