import type { NextAuthConfig } from "next-auth";

// Edge-safe auth config — no Node.js-only modules (no bcryptjs, no Prisma)
// Used only in middleware for session reading.
// MUST include jwt/session callbacks so that role is available in middleware via req.auth.
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [],
  callbacks: {
    authorized() {
      // Route protection is handled manually in middleware.ts
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
