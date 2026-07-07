"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body
        style={{
          fontFamily: "ui-monospace, 'Courier New', monospace",
          display: "flex",
          minHeight: "100dvh",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          background: "#ece3cf",
          color: "#2a2620",
        }}
      >
        {/* Standalone boundary: cannot use token classes, so dark mode is inlined. */}
        <style>{`@media (prefers-color-scheme: dark){
          body{background:#201d18 !important;color:#ede3cd !important}
          .ge-muted{color:#b7ab90 !important}
          .ge-btn{background:#cf6a2f !important;color:#201d18 !important;border-color:#6f6650 !important;box-shadow:3px 3px 0 #000 !important}
        }`}</style>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.01em" }}>
            Đã xảy ra lỗi nghiêm trọng
          </h1>
          <p className="ge-muted" style={{ marginTop: "0.5rem", color: "#6b5f48" }}>
            Vui lòng tải lại trang.
          </p>
          <button
            onClick={reset}
            className="ge-btn"
            style={{
              marginTop: "1.5rem",
              padding: "0.7rem 1.25rem",
              borderRadius: "4px",
              background: "#b23a1e",
              color: "#f7f1de",
              border: "2px solid #2a2620",
              boxShadow: "3px 3px 0 #2a2620",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Tải lại
          </button>
        </div>
      </body>
    </html>
  );
}
