import type { NextAuthConfig } from "next-auth";

// Edge-safe base config (no Node-only deps like bcrypt/Prisma). Imported by
// middleware.ts so route protection can run on the edge. The Credentials
// provider (which needs Prisma + bcrypt) is added in auth.ts for the Node
// runtime only.
export const authConfig = {
  // 30-day sessions; without maxAge the JWT default would apply implicitly.
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/login" },
  trustHost: true,
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: string }).role ?? "USER";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? session.user.id;
        session.user.role = (token.role as string) ?? "USER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
