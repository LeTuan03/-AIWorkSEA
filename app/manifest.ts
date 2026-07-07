import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AIWork SEA",
    short_name: "AIWork SEA",
    description: "Job board freelancer AI & Automation ở Đông Nam Á",
    start_url: "/",
    display: "standalone",
    background_color: "#ece3cf",
    theme_color: "#b23a1e",
    icons: [{ src: "/icon.jpg", sizes: "any", type: "image/svg+xml" }],
  };
}
