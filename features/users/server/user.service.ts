import "server-only";
import { Prisma, type PrismaClient } from "@prisma/client";
import { z } from "zod";
import { MIN_PASSWORD_LENGTH, type PasswordHasher } from "@/features/auth/server/password";
import type { SessionUser } from "@/features/auth/server/session.service";
import { ConflictError, NotFoundError, ValidationError } from "@/features/shared/server/errors";

export type UserListItem = { id: string; name: string; email: string; createdAt: Date; isSelf: boolean };

const passwordField = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Use at least ${MIN_PASSWORD_LENGTH} characters for the password.`)
  .max(200);

const newUserSchema = z.object({
  name: z.string().trim().min(1, "Add a name.").max(120),
  email: z.string().trim().toLowerCase().email("Add a valid email address.").max(200),
  password: passwordField,
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: passwordField,
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, { message: "The new passwords don't match." });

/**
 * Accounts and their visibility rules:
 * - The superadmin is created only by `pnpm db:seed` from env vars, never through the UI.
 * - Admins never see, find or delete the superadmin; it is excluded from every query they reach.
 * - Anyone signed in can create users, and new users are always ADMIN.
 */
export class UserService {
  constructor(
    private readonly db: PrismaClient,
    private readonly hasher: PasswordHasher,
  ) {}

  /** Users the actor may see. Admins get admin accounts only. */
  private visibleTo(actor: SessionUser): Prisma.UserWhereInput {
    return actor.role === "SUPERADMIN" ? {} : { role: "ADMIN" };
  }

  async list(actor: SessionUser): Promise<UserListItem[]> {
    const users = await this.db.user.findMany({
      where: this.visibleTo(actor),
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    return users.map((user) => ({ ...user, isSelf: user.id === actor.id }));
  }

  async create(_actor: SessionUser, input: Record<string, unknown>) {
    const parsed = newUserSchema.safeParse(input);
    if (!parsed.success) throw new ValidationError(parsed.error.issues[0]?.message ?? "Check the form.");

    try {
      await this.db.user.create({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          passwordHash: await this.hasher.hash(parsed.data.password),
          role: "ADMIN",
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictError("That email is already in use.");
      }
      throw error;
    }
  }

  async remove(actor: SessionUser, id: string) {
    if (id === actor.id) throw new ValidationError("You can't remove your own account.");
    // Only ADMIN accounts are removable, by anyone. The superadmin is never matched, so it reads as "not found".
    const { count } = await this.db.user.deleteMany({ where: { id, role: "ADMIN" } });
    if (count === 0) throw new NotFoundError("That user doesn't exist.");
  }

  /** Returns the new session version so the caller can keep the current session alive. */
  async changeOwnPassword(actor: SessionUser, input: Record<string, unknown>) {
    const parsed = changePasswordSchema.safeParse(input);
    if (!parsed.success) throw new ValidationError(parsed.error.issues[0]?.message ?? "Check the form.");

    const user = await this.db.user.findUniqueOrThrow({ where: { id: actor.id }, select: { passwordHash: true } });
    if (!(await this.hasher.verify(parsed.data.currentPassword, user.passwordHash))) {
      throw new ValidationError("Your current password is incorrect.");
    }

    const updated = await this.db.user.update({
      where: { id: actor.id },
      // Bumping the version signs out every other session using the old password.
      data: { passwordHash: await this.hasher.hash(parsed.data.newPassword), sessionVersion: { increment: 1 } },
      select: { sessionVersion: true },
    });
    return updated.sessionVersion;
  }

}
