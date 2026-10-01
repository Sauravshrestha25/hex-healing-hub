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

/** "12 minutes", "1 minute"; rounds up so a lockout never reads as "0 minutes". */
function minutesText(ms: number) {
  const minutes = Math.max(1, Math.ceil(ms / 60_000));
  return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
}

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
      const { resetInMs } = await this.failedLogins.status(ip);
      throw new ValidationError(`Too many attempts. Try again in ${minutesText(resetInMs)}.`);
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
      const { used, resetInMs } = await this.failedLogins.status(ip);
      const left = this.failedLogins.limit - used;
      throw new ValidationError(
        left > 0
          ? `Incorrect email or password. ${left} ${left === 1 ? "attempt" : "attempts"} left before a ${Math.max(1, Math.ceil(resetInMs / 60_000))}-minute pause.`
          : `Incorrect email or password. Too many attempts. Try again in ${minutesText(resetInMs)}.`,
      );
    }

    await this.failedLogins.clear(ip);
    await this.sessions.start(user.id, user.sessionVersion);
  }

  signOut() {
    return this.sessions.end();
  }
}
