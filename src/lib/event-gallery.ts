import { z } from "zod";

const photoUrl = z.string().trim().max(2000).refine(value => {
  if (/^\/(?!\/)/.test(value)) return !/[\\\s]/.test(value);
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password; }
  catch { return false; }
}, "Use an uploaded image or a full http(s) image URL.");
export const eventGallerySchema = z.object({
  enabled: z.boolean().default(true),
  images: z.array(photoUrl).max(30).transform(images => [...new Set(images)]),
});
export type EventGallerySettings = z.infer<typeof eventGallerySchema>;
export type EventGalleryPhoto = { src: string; alt: string };
export const eventVenuePhotos: EventGalleryPhoto[] = [
  { src: "/seed/grounds-01.jpg", alt: "The farm and bamboo walkway at Vinyasa Earth" },
  { src: "/seed/grounds-04.jpg", alt: "Earth-built courtyard and gathering space at Vinyasa" },
  { src: "/seed/grounds-06.jpg", alt: "Mudhouses and green spaces at Vinyasa Earth" },
  { src: "/seed/grounds-02.jpg", alt: "Grounds and gardens at Vinyasa Earth" },
  { src: "/seed/grounds-03.jpg", alt: "Grounds and gardens at Vinyasa Earth" },
  { src: "/seed/grounds-05.jpg", alt: "Grounds and gardens at Vinyasa Earth" },
  { src: "/seed/grounds-07.jpg", alt: "Grounds and gardens at Vinyasa Earth" },
  { src: "/seed/grounds-08.jpg", alt: "Grounds and gardens at Vinyasa Earth" },
  { src: "/seed/grounds-09.jpg", alt: "Grounds and gardens at Vinyasa Earth" },
  { src: "/seed/grounds-10.jpg", alt: "Grounds and gardens at Vinyasa Earth" },
  { src: "/seed/community-01.jpg", alt: "Community and gatherings at Vinyasa Earth" },
  { src: "/seed/community-02.jpg", alt: "Community and gatherings at Vinyasa Earth" },
  { src: "/seed/community-03.jpg", alt: "Community and gatherings at Vinyasa Earth" },
  { src: "/seed/community-04.jpg", alt: "Community and gatherings at Vinyasa Earth" },
  { src: "/seed/community-05.jpg", alt: "Community and gatherings at Vinyasa Earth" },
  { src: "/seed/community-06.jpg", alt: "Community and gatherings at Vinyasa Earth" },
];
export const eventGalleryKey = (slug: string) => "event-gallery:" + slug;
export function eventGallerySettings(value: unknown): EventGallerySettings {
  const parsed = eventGallerySchema.safeParse(value);
  return parsed.success ? parsed.data : { enabled: true, images: [] };
}
export function eventGalleryFromForm(form: FormData): EventGallerySettings | null {
  if (!form.has("eventGallery")) return null;
  return eventGallerySchema.parse({
    enabled: form.get("eventGalleryEnabled") === "on",
    images: String(form.get("eventGallery")).split(/\r?\n/).map(value => value.trim()).filter(Boolean),
  });
}
export function eventGalleryPhotos(settings: EventGallerySettings, name: string, venuePhotos: EventGalleryPhoto[]): EventGalleryPhoto[] {
  if (!settings.enabled) return [];
  if (settings.images.length) return settings.images.map((src, index) => ({ src, alt: name + " — gallery photo " + (index + 1) }));
  return venuePhotos.filter(photo => photoUrl.safeParse(photo.src).success).filter((photo, index, all) => all.findIndex(item => item.src === photo.src) === index).slice(0, 30);
}
