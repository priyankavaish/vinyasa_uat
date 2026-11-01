import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCottages } from "@/lib/cms";
import { unitsLeft } from "@/lib/stay-availability";

const query = z.object({ checkIn: z.string().date(), checkOut: z.string().date() }).refine(value => value.checkOut > value.checkIn);

// Units still free per stay for the requested nights. null = no stock limit set.
export async function GET(req: NextRequest) {
  const parsed = query.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Choose valid check-in and check-out dates." }, { status: 400 });
  try {
    const stays = await getCottages();
    return NextResponse.json({ left: await unitsLeft(stays, parsed.data.checkIn, parsed.data.checkOut) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Could not check availability. Please try again." }, { status: 503 });
  }
}
