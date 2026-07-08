import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og";

// Default social share card for every route that doesn't define its own.
// On-brand retro skin: aged paper, ink border, rust accent, Space Mono.

export const alt = "AIWORK SEA · Việc làm freelancer AI & Automation ở Đông Nam Á";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CARD_TEXT =
  "AIWORK SEA AIWORKSEA.com Việc làm freelancer AI & Automation Remote · Contract · Part-time ở Đông Nam Á LLM Data Computer Vision";

export default async function OgImage() {
  const fonts = await loadOgFonts(CARD_TEXT);
  const fontFamily = fonts.length ? "Space Mono" : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ece3cf",
          padding: 56,
          fontFamily,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "8px solid #2a2620",
            background: "#f7f1de",
            boxShadow: "16px 16px 0 #2a2620",
            padding: 64,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                background: "#b23a1e",
                color: "#f7f1de",
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: 2,
                padding: "8px 20px",
              }}
            >
              AIWORK SEA
            </div>
            <div style={{ display: "flex", color: "#6b5f48", fontSize: 26 }}>
              AIWORKSEA.com
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                color: "#2a2620",
                fontSize: 76,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: -1,
              }}
            >
              Việc làm freelancer
            </div>
            <div
              style={{
                display: "flex",
                color: "#a8331a",
                fontSize: 76,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: -1,
              }}
            >
              AI &amp; Automation
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 24,
                color: "#6b5f48",
                fontSize: 34,
              }}
            >
              Remote · Contract · Part-time ở Đông Nam Á
            </div>
          </div>

          <div style={{ display: "flex", gap: 14 }}>
            {["AI/ML", "LLM", "Automation", "Data", "Computer Vision"].map(
              (tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    border: "2px solid #2a2620",
                    color: "#2a2620",
                    fontSize: 24,
                    padding: "6px 16px",
                  }}
                >
                  {tag}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
