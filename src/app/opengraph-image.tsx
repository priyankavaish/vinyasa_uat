import { ImageResponse } from "next/og";

export const alt = "Vinyasa Earth — Stay, Create, Connect in Amer, Jaipur";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", flexDirection: "column", justifyContent: "center", padding: "78px", overflow: "hidden", background: "linear-gradient(135deg, #243326, #6b7a5e 55%, #8f3b31)", color: "#fbf9f3" }}>
      <div style={{ position: "absolute", width: 520, height: 520, right: -80, top: -120, border: "2px solid rgba(251,249,243,.2)", borderRadius: "50%" }} />
      <div style={{ fontSize: 22, letterSpacing: 8, textTransform: "uppercase", color: "#edb678" }}>Amer · Jaipur</div>
      <div style={{ marginTop: 36, fontFamily: "serif", fontSize: 112, lineHeight: .9, letterSpacing: -5 }}>Vinyasa Earth</div>
      <div style={{ width: 390, height: 2, marginTop: 40, background: "#edb678" }} />
      <div style={{ marginTop: 28, fontSize: 24, letterSpacing: 7, textTransform: "uppercase" }}>Stay · Create · Connect</div>
      <div style={{ marginTop: 62, fontSize: 24, color: "rgba(251,249,243,.78)" }}>Mud cottages · Artist residencies · Thoughtful retreats</div>
    </div>,
    size,
  );
}
