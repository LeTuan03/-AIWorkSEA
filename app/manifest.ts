import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AIWork SEA",
    short_name: "AIWork SEA",
    description: "Job board freelancer AI & Automation ở Đông Nam Á",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#6d28d9",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
