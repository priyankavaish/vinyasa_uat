import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#8f3b31", color: "#fbf9f3", fontSize: 20, fontFamily: "serif", fontWeight: 700 }}>V</div>,
    size,
  );
}
