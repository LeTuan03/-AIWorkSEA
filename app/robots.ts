import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/dashboard",
        "/login",
        "/signup",
        "/post",
        "/api/",
        "/tracker",
        "/freelancer/edit",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
