import { ImageResponse } from "next/og";
import { getJob, formatBudget } from "@/lib/jobs";
import { LOCATION_LABELS } from "@/lib/constants";
import { loadOgFonts } from "@/lib/og";

// Per-job social share card. Shared job links are the money page for a job
// board, so the card carries the concrete title / company / budget.

export const alt = "Việc làm trên AIWORK SEA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function JobOgImage({
  params,
}: {
  // params may be a Promise (Next 15) or a plain object; await handles both.
  params: Promise<{ id: string }> | { id: string };
}) {
  const { id } = await params;
  const job = await getJob(id);

  const title = job?.status === "PUBLISHED" ? job.title : "AIWORK SEA";
  const company = job?.company ?? "Việc làm freelancer AI & Automation";
  const location = job ? LOCATION_LABELS[job.location] ?? job.location : "";
  const budget = job ? formatBudget(job) : "";

  const fonts = await loadOgFonts(
    `AIWORK SEA ${job?.category ?? ""} ${title} ${company} ${location} ${budget}`,
  );
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
            {job?.category ? (
              <div
                style={{
                  display: "flex",
                  background: "#f0dcc4",
                  color: "#8f2a12",
                  border: "2px solid #8f2a12",
                  fontSize: 26,
                  padding: "6px 18px",
                }}
              >
                {job.category}
              </div>
            ) : null}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                color: "#2a2620",
                fontSize: title.length > 48 ? 58 : 72,
                fontWeight: 800,
                lineHeight: 1.06,
                letterSpacing: -1,
              }}
            >
              {title.length > 90 ? `${title.slice(0, 90)}…` : title}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 22,
                color: "#6b5f48",
                fontSize: 34,
              }}
            >
              {[company, location].filter(Boolean).join(" · ")}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {budget ? (
              <div
                style={{
                  display: "flex",
                  background: "#b23a1e",
                  color: "#f7f1de",
                  fontSize: 38,
                  fontWeight: 700,
                  padding: "10px 24px",
                }}
              >
                {budget}
              </div>
            ) : (
              <div style={{ display: "flex" }} />
            )}
            <div
              style={{
                display: "flex",
                color: "#2a2620",
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              AIWORK SEA
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
