import { NextRequest, NextResponse } from "next/server";
import { getDb, hasDb } from "@/lib/db";
import { pageViews } from "@/lib/db/schema";
import { hmac } from "@/lib/auth";

export const runtime = "nodejs";

// Fire-and-forget page-view logger. Called by <PageViewTracker> on every
// route change. Never blocks the client and never throws upward.
export async function POST(req: NextRequest) {
  if (!hasDb()) return NextResponse.json({ ok: false });

  try {
    const { path } = (await req.json()) as { path?: string };
    if (!path || typeof path !== "string" || path.startsWith("/admin")) {
      return NextResponse.json({ ok: false });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "";
    const ipHash = ip ? (await hmac(ip)).slice(0, 32) : null;

    await getDb()
      .insert(pageViews)
      .values({
        path: path.slice(0, 512),
        referer: req.headers.get("referer")?.slice(0, 512) ?? null,
        ua: req.headers.get("user-agent")?.slice(0, 512) ?? null,
        ipHash,
      });
  } catch (err) {
    console.warn("[api/track] skipped", err);
  }
  return NextResponse.json({ ok: true });
}
