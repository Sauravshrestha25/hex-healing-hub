import "server-only";
import type { PrismaClient, Role } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_MAX_AGE, type SessionCodec } from "@/features/auth/lib/session-codec";
import { ForbiddenError, UnauthorizedError } from "@/features/shared/server/errors";

export type SessionUser = { id: string; email: string; name: string; role: Role; isVerified: boolean };

export class SessionService {
  constructor(
    private readonly db: PrismaClient,
    private readonly codec: SessionCodec,
  ) {}

  /** The signed-in user, re-checked against the database so removed users and old passwords lose access. */
  async current(): Promise<SessionUser | null> {
    const store = await cookies();
    const claims = await this.codec.verify(store.get(SESSION_COOKIE)?.value);
    if (!claims) return null;

    const user = await this.db.user.findUnique({
      where: { id: claims.userId },
      select: { id: true, email: true, name: true, role: true, isVerified: true, sessionVersion: true },
    });
    if (!user || user.sessionVersion !== claims.version) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.role === "SUPERADMIN" || user.isVerified,
    };
  }

  /** For server actions and route handlers: rendering guards are not a security boundary. */
  async require() {
    const user = await this.current();
    if (!user) throw new UnauthorizedError();
    return user;
  }

  /** For anything that changes data: signed in AND verified. */
  async requireEditor() {
    const user = await this.require();
    if (!user.isVerified) throw new ForbiddenError();
    return user;
  }

  /** For admin pages and layouts: sends signed-out visitors to /login. */
  async requirePage() {
    const user = await this.current();
    if (!user) redirect("/login");
    return user;
  }

  async start(userId: string, version: number) {
    const store = await cookies();
    store.set(SESSION_COOKIE, await this.codec.sign({ userId, version }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
  }

  async end() {
    const store = await cookies();
    store.delete(SESSION_COOKIE);
  }
}
