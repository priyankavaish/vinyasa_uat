import { NextRequest, NextResponse, after } from "next/server";
import { hasDb } from "@/lib/db";
import { createLead } from "@/lib/store";
import { notifyEntry } from "@/lib/email-notifications";
import { nightlyAvailability } from "@/lib/stay-availability";
import { addArtistDays, artistApplicationSchema, STAY_WEEKS } from "@/lib/artist-escape-programme";
import { getArtistProgramme } from "@/lib/artist-escape-programme-store";

export const runtime = "nodejs";
const headers = { "Cache-Control": "no-store" };

async function getAvailableArrivals() {
  const { programme, arrivals } = await getArtistProgramme();
  if (!hasDb()) return { programme, arrivals: { 1: [], 2: [], 4: [] } };
  const { dorm } = await nightlyAvailability(["dorm"], programme.start, addArtistDays(programme.lastNight, 1));
  for (const length of STAY_WEEKS) {
    arrivals[length] = arrivals[length].filter(arrival =>
      Array.from({ length: length * 7 }, (_, night) => dorm?.[addArtistDays(arrival, night)]).every(left => (left ?? 0) > 0)
    );
  }
  return { programme, arrivals };
}

export async function GET() {
  try {
    return NextResponse.json(await getAvailableArrivals(), { headers });
  } catch {
    return NextResponse.json({ error: "Availability is temporarily unavailable." }, { status: 503, headers });
  }
}

export async function POST(request: NextRequest) {
  if (!hasDb()) return NextResponse.json({ error: "Applications are temporarily unavailable." }, { status: 503 });
  const parsed = artistApplicationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { name, phone, email, weeks, arrival, intent, portfolio } = parsed.data;
  const { arrivals } = await getAvailableArrivals();
  if (!arrivals[weeks].includes(arrival)) {
    return NextResponse.json({ error: "That arrival is no longer available. Choose another Monday.", arrivals }, { status: 409, headers });
  }
  const message = [
    "Stay length: " + weeks + (weeks === 1 ? " week" : " weeks"),
    "Arrival Monday: " + arrival,
    "Portfolio: " + portfolio,
    "",
    "What they would like to work on or explore:",
    intent,
  ].join("\n");
  const lead = await createLead({ source: "artist-escape", name, email, phone, message });
  after(() => notifyEntry("lead", lead));
  return NextResponse.json({ ok: true }, { status: 201, headers });
}
