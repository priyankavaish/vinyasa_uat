import { z } from "zod";

export const stayQuantitySchema = z.preprocess(
  (value) => value === "" || value === null || value === undefined ? null : value,
  z.coerce.number().int("Enter a whole number.").min(0, "Quantity cannot be negative.").max(100000).nullable(),
);
export const stayStockKey = (slug: string) => `stay-stock:${slug}`;
export const isStaySoldOut = (stay: { quantity?: number | null } | undefined) => stay?.quantity === 0;
