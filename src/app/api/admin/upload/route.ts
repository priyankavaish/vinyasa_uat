import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdminSession(req);
  if (unauthorized) return unauthorized;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Image uploads are not configured (BLOB_READ_WRITE_TOKEN missing)." },
      { status: 500 }
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is larger than 8MB." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const key = `uploads/${Date.now()}-${safeName}`;
  const blob = await put(key, file, { access: "public", addRandomSuffix: false });

  return NextResponse.json({ url: blob.url });
}
