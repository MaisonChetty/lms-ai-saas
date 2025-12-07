import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/lessons(.*)"]);

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // per IP per window
const ipRequestLog = new Map<string, number[]>();

function getClientIp(req: Request & { ip?: string }): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.ip || "unknown";
}

function isOriginAllowed(req: Request & { nextUrl?: URL }): boolean {
  const originHeader = req.headers.get("origin");
  if (!originHeader) return false;
  const requestOrigin =
    req instanceof Request && "nextUrl" in req
      ? `${(req as any).nextUrl.protocol}//${(req as any).nextUrl.host}`
      : "";
  const allowedFromEnv = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : [];
  return originHeader === requestOrigin || allowedFromEnv.includes(originHeader);
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = ipRequestLog.get(ip) || [];
  const recent = timestamps.filter((ts) => ts > windowStart);
  recent.push(now);
  ipRequestLog.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

export default clerkMiddleware(async (auth, req) => {
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");

  if (isApiRoute) {
    if (!isOriginAllowed(req)) {
      return NextResponse.json(
        { error: "Forbidden: unknown origin" },
        { status: 403 },
      );
    }

    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests, please slow down." },
        { status: 429 },
      );
    }
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
