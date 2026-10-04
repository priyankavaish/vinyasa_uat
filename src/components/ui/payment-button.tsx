import Link from "next/link";
import type { ReactNode } from "react";
import { getContent } from "@/lib/cms";
import { paymentButtonSchema, paymentKey, paymentStyle } from "@/lib/payment-buttons";

export default async function PaymentButton({ target, href, className, children, unavailable = false }: {
  target: string; href: string; className?: string; children: ReactNode; unavailable?: boolean;
}) {
  if (unavailable) return <button type="button" disabled className={`${className ?? ""} !cursor-not-allowed !border-line !bg-line !text-muted hover:!transform-none`}>Sold out</button>;
  const parsed = paymentButtonSchema.safeParse(await getContent(paymentKey(target)));
  const settings = parsed.success ? parsed.data : null;
  if (!settings) return <Link href={href} className={className}>{children}</Link>;
  const label = settings.label || children;
  const style = paymentStyle(settings);
  return settings.url
    ? <a href={settings.url} className={`${className ?? ""} payment-button`} style={style}>{label}</a>
    : <Link href={href} className={`${className ?? ""} payment-button`} style={style}>{label}</Link>;
}
