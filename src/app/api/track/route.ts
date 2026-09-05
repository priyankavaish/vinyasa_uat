import { NextRequest, NextResponse } from "next/server";
import { getDb, hasDb } from "@/lib/db";
import { pageViews } from "@/lib/db/schema";
import { hmac } from "@/lib/auth";

export const runtime = "nodejs";

const ok = () => NextResponse.json({ ok: true });

// Circuit breaker: a broken DB (e.g. a corrupt local PGlite file) must not make
// every page view hang on a doomed write or spam the logs. After a few
// consecutive failures, stop writing for a while.
let consecutiveFailures = 0;
let mutedUntil = 0;
const MAX_FAILURES = 3;
const MUTE_MS = 5 * 60_000;
const WRITE_TIMEOUT_MS = 2_000;

// Fire-and-forget page-view logger. Called by <PageViewTracker> on every route
// change. Never blocks the client for long and never throws upward.
export async function POST(req: NextRequest) {
  if (!hasDb() || Date.now() < mutedUntil) return ok();

  try {
    const { path } = (await req.json()) as { path?: string };
    if (!path || typeof path !== "string" || path.startsWith("/admin")) return ok();

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "";
    const ipHash = ip ? (await hmac(ip)).slice(0, 32) : null;

    const write = getDb()
      .insert(pageViews)
      .values({
        path: path.slice(0, 512),
        referer: req.headers.get("referer")?.slice(0, 512) ?? null,
        ua: req.headers.get("user-agent")?.slice(0, 512) ?? null,
        ipHash,
      });

    await Promise.race([
      write,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("page-view write timed out")), WRITE_TIMEOUT_MS),
      ),
    ]);
    consecutiveFailures = 0;
  } catch (err) {
    if (++consecutiveFailures >= MAX_FAILURES) {
      mutedUntil = Date.now() + MUTE_MS;
      consecutiveFailures = 0;
      console.warn("[api/track] page-view logging paused for 5m after repeated write failures");
    } else {
      console.warn("[api/track] skipped:", err instanceof Error ? err.message : err);
    }
  }
  return ok();
}
