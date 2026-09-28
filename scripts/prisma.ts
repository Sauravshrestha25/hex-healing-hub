import { spawnSync } from "node:child_process";
import { loadEnvConfig } from "@next/env";
import { requireDatabaseUrl } from "../prisma/database-url";

// Runs the Prisma CLI with DATABASE_URL derived from the DB_* variables.
// Usage: tsx scripts/prisma.ts migrate deploy
loadEnvConfig(process.cwd());
const result = spawnSync("prisma", process.argv.slice(2), {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: { ...process.env, DATABASE_URL: requireDatabaseUrl() },
});
process.exit(result.status ?? 1);
