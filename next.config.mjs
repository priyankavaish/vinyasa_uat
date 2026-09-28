/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep development and production artifacts separate. Running `next build`
  // while the dev server is open must not replace chunks that dev is serving.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  // PGlite ships a wasm + data blob that Next's bundler must not inline.
  serverExternalPackages: ["@electric-sql/pglite"],
  images: {
    qualities: [75, 80, 90, 95],
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "*.blob.vercel-storage.com" },
      { protocol: "https", hostname: "www.vinyasa.earth" },
      { protocol: "https", hostname: "vinyasa.earth" },
    ],
  },
  async redirects() {
    // /corporate was renamed to /volunteering — keep old links/bookmarks working.
    return [{ source: "/corporate", destination: "/volunteering", permanent: true }];
  },
};

export default nextConfig;
