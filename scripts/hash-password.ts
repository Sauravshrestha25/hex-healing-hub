import { hash } from "bcryptjs";

// Usage: pnpm admin:hash "your-password"  → prints the line to paste into .env
async function main() {
  const password = process.argv[2];
  if (!password || password.length < 12) {
    console.error("Provide a password of at least 12 characters.");
    process.exit(1);
  }
  const hashed = await hash(password, 12);
  // Next.js expands $VAR in env files, so every $ in the bcrypt hash must be escaped.
  console.log(`SUPERADMIN_PASSWORD_HASH="${hashed.replace(/\$/g, "\\$")}"`);
}

main();
