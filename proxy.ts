import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, SessionCodec } from "@/features/auth/lib/session-codec";

// Optimistic check only (signature + expiry). SessionService re-validates against the database
// in every admin page, action and route, so deleted users and changed passwords lose access there.
export async function proxy(request: NextRequest) {
  const codec = new SessionCodec(process.env.SESSION_SECRET);
  const session = await codec.verify(request.cookies.get(SESSION_COOKIE)?.value);
  if (session) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL("/login", request.url);
  url.searchParams.set("next", pathname + search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
