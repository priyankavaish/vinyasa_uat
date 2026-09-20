"use server";
import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { getDb } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/auth";
import { editorialCatalog } from "./catalog";
function validate(value: unknown, shape: unknown, path = "content"): void {
  if (typeof shape === "string") {
    if (typeof value !== "string" || value.length > 30000) throw new Error(`${path}: enter text (maximum 30,000 characters).`);
    if (!path.endsWith(".blurDataURL") && /^\s*(javascript|vbscript|data):/i.test(value)) throw new Error(`${path}: use a website or uploaded-media URL.`);
  } else if (typeof shape === "number") {
    if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`${path}: enter a number.`);
  } else if (typeof shape === "boolean") {
    if (typeof value !== "boolean") throw new Error(`${path}: choose true or false.`);
  } else if (Array.isArray(shape)) {
    if (!Array.isArray(value) || value.length > 200) throw new Error(`${path}: invalid list.`);
    value.forEach((entry, index) => { if (shape.length) validate(entry, shape[index] ?? shape[0], `${path}.${index + 1}`); });
  } else if (shape && typeof shape === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${path}: invalid content group.`);
    for (const [key, fallback] of Object.entries(shape)) {
      if (!(key in value)) throw new Error(`${path}.${key}: missing field.`);
      validate((value as Record<string, unknown>)[key], fallback, `${path}.${key}`);
    }
  }
}
export async function saveEditorial(key: string, value: unknown) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!await isValidSessionToken(token)) throw new Error("Unauthorized");
  if (!Object.prototype.hasOwnProperty.call(editorialCatalog, key)) throw new Error("Unknown content section");
  if (JSON.stringify(value).length > 600000) throw new Error("Content is too large.");
  validate(value, editorialCatalog[key as keyof typeof editorialCatalog]);
  try {
    await getDb().insert(siteContent).values({ key: `editorial:${key}`, value, updatedAt: new Date() }).onConflictDoUpdate({ target: siteContent.key, set: { value, updatedAt: new Date() } });
  } catch (error) {
    const cause = (error as { cause?: { code?: string; message?: string } }).cause;
    console.error("Editorial save failed", { code: cause?.code, message: cause?.message });
    throw new Error("Could not save because the database is unavailable. Your edits are still in this form. Please retry once the connection is restored.");
  }
  revalidateTag("content");
  revalidatePath("/", "layout");
}
