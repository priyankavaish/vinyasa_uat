import { hasDb } from "@/lib/db";
import { listCoupons } from "@/lib/coupon-store";
import { CouponManager } from "@/components/admin/offers-manager";

export const dynamic = "force-dynamic";

export default async function OffersPage() {
  if (!hasDb()) return <p className="text-sm text-foreground-soft">Database not configured.</p>;
  const coupons = await listCoupons().catch(() => []);
  return <div>
    <h1 className="font-display text-3xl italic">Coupons</h1>
    <div className="mt-6 space-y-6">
      <CouponManager coupons={coupons} />
    </div>
  </div>;
}
