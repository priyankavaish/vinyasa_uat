import "server-only";
import { randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import { and, eq, sql } from "drizzle-orm";
import { getDb, isLocalDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { isHostedArtistEscapeUat } from "./artist-escape-environment";

const state = globalThis as typeof globalThis & { vinyasaStayWrite?: Promise<unknown> };
const lockKey = "stay-booking:write-lock";

export class StayBookingBusyError extends Error {
  constructor() {
    super("Another booking or review is being saved. Please try again.");
  }
}

// The two-minute lease exceeds the 60-second limit of the Vercel routes using it.
export async function withDatabaseStayBookingLock<T>(run: () => Promise<T>): Promise<T> {
  const db = getDb();
  const owner = randomUUID();
  const deadline = Date.now() + 5000;

  while (Date.now() < deadline) {
    const [acquired] = await db.insert(siteContent)
      .values({ key: lockKey, value: owner })
      .onConflictDoUpdate({
        target: siteContent.key,
        set: { value: owner, updatedAt: sql.raw("now()") },
        setWhere: sql.raw("site_content.updated_at < now() - interval '2 minutes'"),
      })
      .returning({ key: siteContent.key });

    if (acquired) {
      try {
        return await run();
      } finally {
        await db.delete(siteContent).where(and(
          eq(siteContent.key, lockKey),
          eq(siteContent.value, owner),
        )).catch(() => {
          console.error("Unable to release the stay booking lock.");
        });
      }
    }

    await delay(150 + Math.random() * 100);
  }

  throw new StayBookingBusyError();
}

export function withStayBookingLock<T>(run: () => Promise<T>): Promise<T> {
  if (isLocalDb()) {
    const next = (state.vinyasaStayWrite || Promise.resolve()).then(run, run);
    state.vinyasaStayWrite = next.catch(() => {});
    return next;
  }
  return isHostedArtistEscapeUat() ? withDatabaseStayBookingLock(run) : run();
}
