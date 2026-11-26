import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { programmeSchema } from "@/lib/artist-escape-programme";
import { getArtistProgramme, saveArtistProgramme } from "@/lib/artist-escape-programme-store";
import { StayBookingBusyError, withStayBookingLock } from "@/lib/stay-booking-lock";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminSession(request);
  if (unauthorized) return unauthorized;
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const parsed = programmeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  try {
    return await withStayBookingLock(async () => {
      await saveArtistProgramme(parsed.data);
      return NextResponse.json(await getArtistProgramme(), { headers: { "Cache-Control": "no-store" } });
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save settings." }, { status: error instanceof StayBookingBusyError ? 503 : 400 });
  }
}
