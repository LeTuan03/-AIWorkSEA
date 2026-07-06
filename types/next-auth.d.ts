import type { DefaultSession } from "next-auth";

// Augment Auth.js types so `session.user.id` and `session.user.role` are typed.
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
