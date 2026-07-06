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
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100dvh",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          background: "#fafafa",
          color: "#18181b",
        }}
      >
        {/* Standalone boundary: cannot use token classes, so dark mode is inlined. */}
        <style>{`@media (prefers-color-scheme: dark){
          body{background:#09090b !important;color:#fafafa !important}
          .ge-muted{color:#a1a1aa !important}
          .ge-btn{background:#7c3aed !important}
        }`}</style>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Đã xảy ra lỗi nghiêm trọng
          </h1>
          <p className="ge-muted" style={{ marginTop: "0.5rem", color: "#52525b" }}>
            Vui lòng tải lại trang.
          </p>
          <button
            onClick={reset}
            className="ge-btn"
            style={{
              marginTop: "1.5rem",
              padding: "0.625rem 1.25rem",
              borderRadius: "0.75rem",
              background: "#6d28d9",
              color: "#fff",
              border: "none",
              fontWeight: 600,
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
