import type { CSSProperties } from "react";
import { z } from "zod";

export const PAYMENT_COLORS = [
  { value: "accent", label: "Terracotta" },
  { value: "accent-ink", label: "Warm white" },
  { value: "secondary", label: "Sage green" },
  { value: "secondary-ink", label: "Deep olive" },
  { value: "background", label: "Cream" },
  { value: "surface", label: "Ivory" },
  { value: "foreground", label: "Earth brown" },
  { value: "clay-surface", label: "Light clay" },
  { value: "clay-ink", label: "Clay brown" },
] as const;
const color = z.enum(["accent", "accent-ink", "secondary", "secondary-ink", "background", "surface", "foreground", "clay-surface", "clay-ink"]);

export function isRazorpayLink(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.port &&
      ["rzp.io", "rzp.to", "razorpay.me", "pages.razorpay.com", "payments.razorpay.com"].includes(url.hostname) &&
      url.pathname !== "/";
  } catch { return false; }
}

export const paymentButtonSchema = z.object({
  url: z.string().trim().max(1000).refine((v) => !v || isRazorpayLink(v), "Paste a valid HTTPS Razorpay payment link."),
  label: z.string().trim().max(60, "Keep button text under 60 characters."),
  background: color,
  foreground: color,
}).refine((v) => v.background !== v.foreground, {
  message: "Choose different button and text colors.", path: ["foreground"],
});
export type PaymentButtonSettings = z.infer<typeof paymentButtonSchema>;
export const DEFAULT_PAYMENT_BUTTON: PaymentButtonSettings = {
  url: "", label: "", background: "accent", foreground: "accent-ink",
};
export const paymentKey = (target: string) => `payment-button:${target}`;
export function paymentStyle(settings: PaymentButtonSettings): CSSProperties {
  return {
    "--payment-background": `var(--${settings.background})`,
    "--payment-foreground": `var(--${settings.foreground})`,
  } as CSSProperties;
}
