import { z } from "zod";

export const bookingRequestSchema = z.object({
  type: z.enum(["stay", "event"]),
  itemSlug: z.string().min(1).max(80),
  checkIn: z.string().date().optional(),
  checkOut: z.string().date().optional(),
  eventDate: z.string().date().optional(),
  guests: z.coerce.number().int().min(1).max(20),
  guestName: z.string().trim().min(2).max(100),
  guestEmail: z.string().trim().email().max(150),
  guestPhone: z
    .string()
    .trim()
    .min(7)
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number"),
});
export type BookingRequest = z.infer<typeof bookingRequestSchema>;

export const leadSchema = z.object({
  source: z.enum(["contact", "corporate", "newsletter", "volunteer", "artist-escape"]),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(150),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9+\-\s()]*$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});
export type LeadRequest = z.infer<typeof leadSchema>;

export const razorpayVerifySchema = z.object({
  bookingId: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});
