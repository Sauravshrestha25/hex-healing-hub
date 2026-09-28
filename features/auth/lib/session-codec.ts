import { SignJWT, jwtVerify } from "jose";

// Edge-safe (no Node APIs): used by proxy.ts for the optimistic check and by SessionService.
export const SESSION_COOKIE = "hex_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8;

export type SessionClaims = { userId: string; version: number };

export class SessionCodec {
  constructor(private readonly secret: string | undefined) {}

  // Checked on use, not construction: `next build` sets up services without runtime env.
  private get key() {
    if (!this.secret || this.secret.length < 32) throw new Error("SESSION_SECRET must be set to at least 32 characters.");
    return new TextEncoder().encode(this.secret);
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
    const key = this.key; // outside the try: a missing secret is a config error, not "signed out"
    try {
      const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
      if (!payload.sub || typeof payload.v !== "number") return null;
      return { userId: payload.sub, version: payload.v };
    } catch {
      return null;
    }
  }
}
