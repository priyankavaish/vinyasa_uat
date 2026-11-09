import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR, CONTENT_TYPE } from "@/lib/uploads";
import { uploadsBucket } from "@/lib/r2-uploads";

export const runtime = "nodejs";

// Serves files saved by /api/admin/upload from the top-level `uploads/` dir.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;

  // Only a plain filename — no traversal, no subpaths.
  if (!/^[a-zA-Z0-9._-]+$/.test(name) || name.includes("..")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const type = CONTENT_TYPE[ext];
  if (!type) return new NextResponse("Not found", { status: 404 });

  // Cloudflare R2 first (production on Workers); local disk otherwise.
  const bucket = await uploadsBucket();
  if (bucket) {
    const object = await bucket.get(name);
    if (!object) return new NextResponse("Not found", { status: 404 });
    return new NextResponse(await object.arrayBuffer(), {
      headers: {
        "Content-Type": object.httpMetadata?.contentType || type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  try {
    const buf = await readFile(path.join(UPLOAD_DIR, name));
    return new NextResponse(buf as unknown as BodyInit, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
