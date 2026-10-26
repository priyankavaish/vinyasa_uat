import { z } from "zod";

const webUrl = (value: string) => {
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password; }
  catch { return false; }
};
const imageUrl = z.string().trim().max(2000).refine(value => !value || (/^\/(?!\/)/.test(value) && !/[\\\\\s]/.test(value)) || webUrl(value), "Use an uploaded image or an http(s) image URL.");

export const eventHostSchema = z.object({
  name: z.string().trim().min(1, "Enter the host or artist's name.").max(160),
  role: z.string().trim().max(160).default(""),
  image: imageUrl.default(""),
  bio: z.string().trim().max(6000).default(""),
  socials: z.array(z.object({
    label: z.string().trim().min(1, "Enter the profile name, such as Instagram.").max(60),
    url: z.string().trim().max(2000).refine(webUrl, "Use a full http(s) profile URL."),
  })).max(8).default([]),
});
export const eventHostsSchema = z.array(eventHostSchema).max(30);
export type EventHost = z.infer<typeof eventHostSchema>;
export const eventHostHeadingSchema = z.enum(["Host", "Artist"]);
export type EventHostHeading = z.infer<typeof eventHostHeadingSchema>;
const eventHostSettingsSchema = z.object({ heading: eventHostHeadingSchema.default("Host"), hosts: eventHostsSchema });

/** Read existing people arrays as well as settings saved by the heading selector. */
export function eventHostSettings(value: unknown, fallback: EventHost[] = []) {
  const parsed = eventHostSettingsSchema.safeParse(Array.isArray(value) ? { hosts: value } : value);
  return parsed.success ? parsed.data : { heading: "Host" as const, hosts: fallback };
}
export const eventHostsKey = (slug: string) => `event-hosts:${slug}`;

export function isLegacyHostSection(value: unknown): boolean {
  if (!value || typeof value !== "object" || !("title" in value)) return false;
  if (!("portraits" in value) || !Array.isArray(value.portraits)) return false;
  const title = String(value.title).replace(/<[^>]*>/g, "").toLowerCase().replace(/[^a-z]/g, "");
  return ["yourhosts", "yourhostsartists", "meetthehosts", "meettheartists"].includes(title);
}

/** Missing field preserves existing settings; an explicit [] hides the section. */
export function eventHostsFromForm(form: FormData): EventHost[] | null {
  if (!form.has("eventHosts")) return null;
  const value = String(form.get("eventHosts"));
  if (value.length > 250000) throw new Error("Hosts content is too large.");
  return eventHostsSchema.parse(JSON.parse(value));
}
