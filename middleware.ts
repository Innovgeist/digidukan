import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const AUTH_PATHS = ["/login", "/signup", "/forgot-password"];
const OWNER_PATHS = ["/dashboard", "/onboarding", "/shops"];
const ADMIN_PATHS = ["/admin"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Always allow public storefront, marketing pages, API routes
  if (
    pathname.startsWith("/s/") ||
    pathname === "/" ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/features") ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  // Auth pages: redirect logged-in users to dashboard
  if (AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    if (session?.user) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Admin routes: require SUPER_ADMIN role
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }
    return NextResponse.next();
  }

  // Owner routes: require authenticated OWNER session
  if (OWNER_PATHS.some((p) => pathname.startsWith(p))) {
    if (!session?.user) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // SUPER_ADMIN has no owner profile — send them to admin panel
    if (session.user.role === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
