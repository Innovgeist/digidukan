import type { NextAuthConfig } from "next-auth";

// Edge-safe auth config — no Node.js-only modules (no bcryptjs, no Prisma)
// Used only in middleware for session reading
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // This is handled manually in middleware.ts
      return true;
    },
  },
};
