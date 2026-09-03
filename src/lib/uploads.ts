import path from "node:path";

// Locally-uploaded media lives here — a sibling of `public/`, NOT inside it, so
// `next dev`'s public-folder watcher does not reload and kill the upload
// request. Served to the browser through the /media/[name] route handler.
export const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export const CONTENT_TYPE: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};
