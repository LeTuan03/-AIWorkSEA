import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Edge middleware: only decodes the JWT session (no providers needed here).
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const isLoggedIn = Boolean(req.auth);
  const role = req.auth?.user?.role;

  const needsAdmin = path.startsWith("/admin");
  const needsAuth =
    needsAdmin ||
    path.startsWith("/post") ||
    path.startsWith("/dashboard") ||
    path.startsWith("/tracker") ||
    path.startsWith("/freelancer/edit");

  if (needsAuth && !isLoggedIn) {
    const url = new URL("/login", nextUrl);
    url.searchParams.set("callbackUrl", path);
    return Response.redirect(url);
  }

  if (needsAdmin && role !== "ADMIN") {
    return Response.redirect(new URL("/", nextUrl));
  }

  return undefined;
});

export const config = {
  matcher: [
    "/post/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/tracker/:path*",
    "/freelancer/edit",
  ],
};
