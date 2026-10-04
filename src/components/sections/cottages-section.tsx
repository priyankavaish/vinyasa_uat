import { getCottages } from "@/lib/cms";
import CottagesInteractive, { type RoomItem } from "./cottages-interactive";

const FALLBACK = "/images/property-cottages-day.jpg";

export default async function CottagesSection() {
  const cottages = await getCottages();
  if (!cottages.length) return null;

  const rooms: RoomItem[] = cottages.map((c) => ({
    slug: c.slug,
    name: c.name,
    element: c.element,
    tagline: c.tagline,
    icon: c.icon,
    accent: c.accent,
    pricePerNight: c.pricePerNight,
    quantity: c.quantity,
    image: c.image || FALLBACK,
    gallery: (c.gallery?.length ? c.gallery : [c.image]).filter(Boolean).slice(0, 6),
  }));

  return <CottagesInteractive rooms={rooms} />;
}
