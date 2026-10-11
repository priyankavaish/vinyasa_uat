import type { editorialCatalog } from "./catalog";
type Scope = keyof typeof editorialCatalog;
export type ManagedPage = { id: string; title: string; path: string; sections: Scope[] };
const section = (name: string) => ("components/sections/" + name) as Scope;
const page = (name: string) => ("app/(site)/" + (name ? name + "/" : "") + "page") as Scope;
export const managedPages: ManagedPage[] = [
  { id: "home", title: "Home", path: "/", sections: [page(""), ...["hero", "next-event-ribbon", "cottages-interactive", "connect-section", "work-from-farm-section", "community-section", "upcoming-events-interactive", "testimonials-section", "photo-masonry", "gallery-section"].map(section)] },
  { id: "about", title: "About / The Vinyasa Way", path: "/about", sections: [page("about"), section("family-bookshelf")] },
  { id: "artist-escape", title: "For the Artists", path: "/artist-escape", sections: [page("artist-escape")] },
  { id: "stays", title: "Stays", path: "/stays", sections: [page("stays"), section("stays-hero-gallery"), section("stay-collection"), section("partner-cards")] },
  { id: "events", title: "Events & Retreats", path: "/events", sections: [page("events"), section("stays-hero-gallery")] },
  { id: "volunteer", title: "Volunteering", path: "/volunteering", sections: [page("corporate"), "components/forms/lead-form"] },
  { id: "contact", title: "Contact", path: "/contact", sections: [page("contact"), section("location-section"), "components/forms/lead-form"] },
  { id: "work-from-farm", title: "Work from Farm", path: "/work-from-farm", sections: [page("work-from-farm")] },
  { id: "book", title: "Book Your Stay", path: "/book", sections: [page("book"), "components/forms/booking-form"] },
  { id: "blogs", title: "Blogs", path: "/blogs", sections: [page("blogs")] },
  { id: "useful-links", title: "Useful Links", path: "/useful-links", sections: [page("useful-links"), "app/(site)/useful-links/copy-field"] },
  { id: "stay-template", title: "Stay details - shared text", path: "/stays/[slug]", sections: [page("stays/[slug]"), section("stay-gallery")] },
  { id: "shared", title: "Header, Footer & WhatsApp", path: "All pages", sections: ["components/layout/site-header", "components/layout/site-footer", "shared/whatsapp", "components/layout/payment-return-dialog"] },
];
export function sectionLabel(key: string) {
  if (key in SECTION_TITLES) return SECTION_TITLES[key];
  if (key.endsWith("/page")) return "Page content & SEO";
  return key.split("/").pop()!.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export function sectionHint(key: string): string | undefined {
  return SECTION_HINTS[key];
}

// Friendlier names for sections whose raw component name (e.g.
// "cottages-interactive") wouldn't mean much to someone editing content.
const SECTION_TITLES: Record<string, string> = {
  "components/layout/payment-return-dialog": "Payment success popup",
  "components/sections/hero": "Top banner (video + headline)",
  "components/sections/next-event-ribbon": "\"Next event\" strip",
  "components/sections/cottages-interactive": "Stays showcase",
  "components/sections/connect-section": "\"Stay connected\" section",
  "components/sections/work-from-farm-section": "\"Work from the farm\" section",
  "components/sections/community-section": "Community section",
  "components/sections/upcoming-events-interactive": "Upcoming events showcase",
  "components/sections/testimonials-section": "Testimonials",
  "components/sections/photo-masonry": "Photo grid",
  "components/sections/gallery-section": "Photo gallery",
};

const SECTION_HINTS: Record<string, string> = {
  "components/sections/hero": "The full-screen video and headline visitors see first.",
  "components/sections/next-event-ribbon": "The small banner announcing the next upcoming event.",
  "components/sections/cottages-interactive": "The stays/mudhouses carousel.",
  "components/sections/testimonials-section": "Guest quotes.",
  "components/sections/photo-masonry": "The grid of photos further down the page.",
  "components/sections/gallery-section": "A gallery of photos.",
};
