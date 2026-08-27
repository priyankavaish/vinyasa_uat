/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep development and production artifacts separate. Running `next build`
  // while the dev server is open must not replace chunks that dev is serving.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};

export default nextConfig;
