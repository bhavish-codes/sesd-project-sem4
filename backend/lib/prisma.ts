import "dotenv/config";
import { PrismaClient } from "@prisma/client";

// Lazy initialization for Vercel serverless
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

export { prisma };
