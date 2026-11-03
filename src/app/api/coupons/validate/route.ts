import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { applyCoupon } from "@/lib/coupon-store";

const body = z.object({ code: z.string().trim().min(1).max(40), baseAmount: z.number().positive().max(10_000_000) });

// Preview only: the booking API recomputes the discount itself.
export async function POST(req: NextRequest) {
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a coupon code." }, { status: 400 });
  try {
    const result = await applyCoupon(parsed.data.code, parsed.data.baseAmount);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 404 });
    return NextResponse.json({ code: result.coupon.code, discount: result.discount }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Could not check the coupon. Please try again." }, { status: 503 });
  }
}
