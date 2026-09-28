import "server-only";
import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { ValidationError } from "@/features/shared/server/errors";
import type { RateLimiter } from "@/features/shared/server/rate-limiter";
import type { PasswordHasher } from "./password";
import type { SessionService } from "./session.service";

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});

export class AuthService {
  constructor(
    private readonly db: PrismaClient,
    private readonly sessions: SessionService,
    private readonly hasher: PasswordHasher,
    private readonly failedLogins: RateLimiter,
  ) {}

  async signIn(input: { email?: unknown; password?: unknown }, ip: string) {
    // Only failures count, so a correct login is never blocked by earlier successes.
    if (await this.failedLogins.isLimited(ip)) {
      throw new ValidationError("Too many attempts. Please wait 15 minutes and try again.");
    }

    const parsed = credentialsSchema.safeParse(input);
    if (!parsed.success) throw new ValidationError("Enter a valid email and password.");

    const user = await this.db.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true, passwordHash: true, sessionVersion: true },
    });
    // Always run the hash check, so response time doesn't reveal whether the email exists.
    const passwordMatches = await this.hasher.verify(parsed.data.password, user?.passwordHash);
    if (!user || !passwordMatches) {
      await this.failedLogins.hit(ip);
      throw new ValidationError("Incorrect email or password.");
    }

    await this.failedLogins.clear(ip);
    await this.sessions.start(user.id, user.sessionVersion);
  }

  signOut() {
    return this.sessions.end();
  }
}
