import { prisma } from "../../lib/prisma";
import { User } from "../models/User";
import { Report } from "../models/Report";

export class Database {
  /** Save a user to MongoDB via Prisma (upsert by email) */
  async saveUser(user: User): Promise<User> {
    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name },
      create: { name: user.name, email: user.email },
    });
    console.log(`Saved user ${record.name} to database (id: ${record.id})`);
    return User.fromPrisma(record);
  }

  /** Save a report linked to a user */
  async saveReport(userId: string, report: Report): Promise<Report> {
    const record = await prisma.report.create({
      data: {
        summary: report.summary,
        skills: report.skills,
        suggestions: report.suggestions,
        userId: userId,
      },
    });
    console.log(`Saved report ${record.id} to database`);
    return Report.fromPrisma(record);
  }

  /** Get all reports for a user */
  async getUserReports(userId: string): Promise<Report[]> {
    const records = await prisma.report.findMany({
      where: { userId: userId },
    });
    console.log(`Fetched ${records.length} reports for user ${userId}`);
    return records.map((r) => Report.fromPrisma(r));
  }

  /** Find a user by email */
  async findUserByEmail(email: string): Promise<User | null> {
    const record = await prisma.user.findUnique({
      where: { email },
    });
    return record ? User.fromPrisma(record) : null;
  }

  /** Find a user by ID */
  async findUserById(id: string): Promise<User | null> {
    const record = await prisma.user.findUnique({
      where: { id },
    });
    return record ? User.fromPrisma(record) : null;
  }

  /** Get all users */
  async getAllUsers(): Promise<User[]> {
    const records = await prisma.user.findMany();
    return records.map((r) => User.fromPrisma(r));
  }
}
