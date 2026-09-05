import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { requireAdminSession } from "@/lib/auth";
import { UPLOAD_DIR } from "@/lib/uploads";
import path from "node:path";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024; // Vercel functions reject bodies over ~4.5MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdminSession(req);
  if (unauthorized) return unauthorized;

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is still over 4MB after compression — please pick a smaller one." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }

  const stem = (file.name.replace(/\.[^.]+$/, "") || "image")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .toLowerCase()
    .slice(0, 60);
  const name = `${Date.now()}-${stem}.${EXT[file.type]}`;

  // On a serverless host the filesystem is read-only / per-instance, so a file
  // written to disk vanishes and /media/[name] 404s on the next request. Use
  // Vercel Blob when its token is set.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const blob = await put(`uploads/${name}`, file, {
        access: "public",
        addRandomSuffix: true,
      });
      return NextResponse.json({ url: blob.url });
    } catch (e) {
      return NextResponse.json(
        { error: `Blob upload failed: ${e instanceof Error ? e.message : String(e)}` },
        { status: 500 }
      );
    }
  }

  // Deployed (Vercel etc.) with no Blob store: local disk won't persist. Fail
  // loudly instead of "saving" an image that will 404.
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        error:
          "Image storage is not configured on the server. Add a Vercel Blob store to the project (Storage → Blob) so BLOB_READ_WRITE_TOKEN is set, then redeploy.",
      },
      { status: 501 }
    );
  }

  try {
    // NOTE: written outside `public/` on purpose. Writing into `public/` while
    // `next dev` is running makes its watcher reload and drops this request's
    // connection ("Connection closed."). Files here are served by /media/[name].
    await mkdir(UPLOAD_DIR, { recursive: true });
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(UPLOAD_DIR, name), buf);
    return NextResponse.json({ url: `/media/${name}` });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not save the file." },
      { status: 500 }
    );
  }
}
