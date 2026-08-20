import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 36, background: "#b5643b", color: "#fbf9f3", fontSize: 108, fontFamily: "serif", fontWeight: 700 }}>V</div>,
    size,
  );
}
