import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vinyasa Earth",
    short_name: "Vinyasa Earth",
    description: "Mudhouse stays, artist residencies and retreats in Jaipur.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f1ea",
    theme_color: "#6b7a5e",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
