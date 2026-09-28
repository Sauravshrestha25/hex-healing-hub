import { SignJWT, jwtVerify } from "jose";

// Edge-safe (no Node APIs): used by proxy.ts for the optimistic check and by SessionService.
export const SESSION_COOKIE = "hex_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8;

export type SessionClaims = { userId: string; version: number };

export class SessionCodec {
  private readonly key: Uint8Array;

  constructor(secret: string | undefined) {
    if (!secret || secret.length < 32) throw new Error("SESSION_SECRET must be set to at least 32 characters.");
    this.key = new TextEncoder().encode(secret);
  }

  sign({ userId, version }: SessionClaims) {
    return new SignJWT({ v: version })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(userId)
      .setIssuedAt()
      .setExpirationTime(`${SESSION_MAX_AGE}s`)
      .sign(this.key);
  }

  async verify(token: string | undefined): Promise<SessionClaims | null> {
    if (!token) return null;
    try {
      const { payload } = await jwtVerify(token, this.key, { algorithms: ["HS256"] });
      if (!payload.sub || typeof payload.v !== "number") return null;
      return { userId: payload.sub, version: payload.v };
    } catch {
      return null;
    }
  }
}
