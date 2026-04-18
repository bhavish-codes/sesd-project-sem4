export class ProfileData {
  username: string;
  repositories: any[];
  languages: any[];
  activityStats: object;

  constructor(username: string, repositories: any[], languages: any[], activityStats: object) {
    this.username = username;
    this.repositories = repositories;
    this.languages = languages;
    this.activityStats = activityStats;
  }

  /** Create a ProfileData instance from a Prisma record */
  static fromPrisma(data: {
    username: string;
    repositories: any[];
    languages: any[];
    activityStats: any;
  }): ProfileData {
    return new ProfileData(
      data.username,
      data.repositories,
      data.languages,
      data.activityStats
    );
  }
}
