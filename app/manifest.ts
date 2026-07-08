import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AIWORK SEA",
    short_name: "AIWORK SEA",
    description: "Job board freelancer AI & Automation ở Đông Nam Á",
    start_url: "/",
    display: "standalone",
    background_color: "#ece3cf",
    theme_color: "#b23a1e",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
