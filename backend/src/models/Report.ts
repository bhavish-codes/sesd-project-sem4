export class Report {
  id: string;
  summary: string;
  skills: string[];
  suggestions: string[];

  constructor(id: string, summary: string, skills: string[], suggestions: string[]) {
    this.id = id;
    this.summary = summary;
    this.skills = skills;
    this.suggestions = suggestions;
  }

  download(): void {
    console.log(`Downloading report ${this.id}...`);
  }

  /** Create a Report instance from a Prisma record */
  static fromPrisma(data: {
    id: string;
    summary: string;
    skills: string[];
    suggestions: string[];
  }): Report {
    return new Report(data.id, data.summary, data.skills, data.suggestions);
  }
}
