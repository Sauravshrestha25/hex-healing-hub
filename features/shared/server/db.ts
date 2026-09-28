import "server-only";
import { PrismaClient } from "@prisma/client";
import { databaseUrl } from "@/prisma/database-url";

// One client per process (also across dev hot reloads). Created on first use, not at import:
// `next build` imports server modules without any database env available.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function getDb() {
  globalForPrisma.prisma ??= new PrismaClient({ datasourceUrl: databaseUrl() });
  return globalForPrisma.prisma;
}
