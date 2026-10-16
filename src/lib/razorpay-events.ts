import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
export const capturedPaymentSchema = z.object({ id:z.string().regex(/^pay_[a-zA-Z0-9]+$/), order_id:z.string().nullable().optional(), status:z.literal("captured"), amount:z.number().int().positive(), currency:z.literal("INR"), email:z.string().nullable().optional(), notes:z.union([z.record(z.string(),z.unknown()),z.array(z.unknown())]).optional(), created_at:z.number().optional() });
export type CapturedPayment = z.infer<typeof capturedPaymentSchema>;
export function validWebhookSignature(body: string, signature: string, secret?: string) {
  if (!secret || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  return timingSafeEqual(createHmac("sha256",secret).update(body).digest(),Buffer.from(signature,"hex"));
}
