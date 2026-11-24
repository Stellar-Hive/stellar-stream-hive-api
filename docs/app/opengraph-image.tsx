import { ImageResponse } from "next/og";

// Route segment config: the image is generated once at build time and cached.
export const alt = "Stellar Stream Hive Docs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SITE_NAME = "Stellar Stream Hive Docs";
const TAGLINE = "Real-time, on-chain payment streaming on Stellar and Soroban.";

// Only system-default fonts are used (no font files are fetched), so the build
// needs no network access.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#f8fafc",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#38bdf8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            S
          </div>
          <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: -0.5 }}>{SITE_NAME}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1.5 }}>
            {SITE_NAME}
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.35, color: "#cbd5e1" }}>{TAGLINE}</div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#94a3b8" }}>Documentation</div>
      </div>
    ),
    { ...size },
  );
}
