import "server-only";
import { createHash, randomBytes } from "node:crypto";
import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { ValidationError } from "@/features/shared/server/errors";
import type { Mailer } from "@/features/shared/server/mailer";
import type { RateLimiter } from "@/features/shared/server/rate-limiter";
import { MIN_PASSWORD_LENGTH, type PasswordHasher } from "./password";

const TOKEN_TTL_MINUTES = 30;

const emailSchema = z.string().trim().toLowerCase().email().max(200);

const resetSchema = z
  .object({
    token: z.string().min(20).max(200),
    newPassword: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `Use at least ${MIN_PASSWORD_LENGTH} characters for the password.`)
      .max(200),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, { message: "The passwords don't match." });

const INVALID_LINK = "This reset link is invalid or has expired. Request a new one.";

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

/**
 * "Forgot password" by email. The response never reveals whether an account exists,
 * links are single-use and short-lived, and only a hash of the token is stored.
 */
export class PasswordResetService {
  constructor(
    private readonly db: PrismaClient,
    private readonly hasher: PasswordHasher,
    private readonly mailer: Mailer,
    private readonly requests: RateLimiter,
    private readonly siteUrl: string,
  ) {}

  async request(emailInput: unknown, ip: string) {
    const parsed = emailSchema.safeParse(emailInput);
    if (!parsed.success) throw new ValidationError("Enter a valid email address.");
    const email = parsed.data;

    if ((await this.requests.isLimited(`ip:${ip}`)) || (await this.requests.isLimited(`email:${email}`))) {
      throw new ValidationError("Too many reset requests. Please wait a while and try again.");
    }
    await this.requests.hit(`ip:${ip}`);
    await this.requests.hit(`email:${email}`);

    const user = await this.db.user.findUnique({ where: { email }, select: { id: true, name: true } });
    if (!user) return; // Same outcome as success: nothing to learn here.

    const token = randomBytes(32).toString("base64url");
    await this.db.$transaction([
      // Only the newest link works.
      this.db.passwordResetToken.deleteMany({ where: { userId: user.id } }),
      this.db.passwordResetToken.create({
        data: { userId: user.id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + TOKEN_TTL_MINUTES * 60_000) },
      }),
    ]);

    const link = `${this.siteUrl}/reset-password?token=${token}`;
    // Not awaited: sending time would otherwise reveal that the account exists.
    this.mailer
      .send({
        to: email,
        subject: "Reset your HEX Healing Hub dashboard password",
        text: [
          `Hi ${user.name},`,
          "",
          "Someone (hopefully you) asked to reset the password for your HEX Healing Hub dashboard account.",
          "",
          `Choose a new password here (the link works once, for ${TOKEN_TTL_MINUTES} minutes):`,
          link,
          "",
          "If you didn't ask for this, you can ignore this email. Your password stays the same.",
        ].join("\n"),
      })
      .catch((error) => console.error("Password reset email failed", error));
  }

  async isValid(token: unknown) {
    if (typeof token !== "string" || token.length < 20) return false;
    const row = await this.db.passwordResetToken.findUnique({ where: { tokenHash: hashToken(token) }, select: { expiresAt: true } });
    return Boolean(row && row.expiresAt > new Date());
  }

  async reset(input: Record<string, unknown>) {
    const parsed = resetSchema.safeParse(input);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      throw new ValidationError(issue?.path[0] === "token" ? INVALID_LINK : (issue?.message ?? "Check the form."));
    }

    const row = await this.db.passwordResetToken.findUnique({ where: { tokenHash: hashToken(parsed.data.token) } });
    if (!row || row.expiresAt <= new Date()) throw new ValidationError(INVALID_LINK);

    const passwordHash = await this.hasher.hash(parsed.data.newPassword);
    await this.db.$transaction([
      // Bumping the version signs the account out everywhere.
      this.db.user.update({ where: { id: row.userId }, data: { passwordHash, sessionVersion: { increment: 1 } } }),
      this.db.passwordResetToken.deleteMany({ where: { userId: row.userId } }),
    ]);
  }
}
