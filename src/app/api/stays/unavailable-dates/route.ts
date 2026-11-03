import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { nightlyAvailability } from "@/lib/stay-availability";

const query = z.object({ slug: z.string().regex(/^[a-z0-9-]{1,80}$/) });
const DAYS = 366;

// Nights on which the stay has no free unit (fully booked, held, closed by the admin, or stock 0).
export async function GET(req: NextRequest) {
  const parsed = query.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Choose a stay." }, { status: 400 });
  try {
    const today = new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);
    const end = new Date(Date.parse(today) + DAYS * 86_400_000).toISOString().slice(0, 10);
    const nights = (await nightlyAvailability([parsed.data.slug], today, end))[parsed.data.slug] ?? {};
    const dates = Object.entries(nights).filter(([, free]) => free === 0).map(([date]) => date);
    return NextResponse.json({ dates }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Could not load availability." }, { status: 503 });
  }
}
