import { Icon, type IconName } from "@/components/ui/icon";
const KIND_META: Record<string, { icon: IconName; accent: string; label: string }> = {
  residency: { icon: "compass-outline", accent: "#8f3b31", label: "Residency" },
  retreat: { icon: "leaf-outline", accent: "#6b7a5e", label: "Retreat" },
  workshop: { icon: "sparkles-outline", accent: "#a06a2c", label: "Workshop" },
};

export type EventItem = {
  slug: string;
  name: string;
  kind: string;
  dateLabel: string;
  priceFrom: number;
  image: string;
  month: string;
  day: number;
};

export const defaults = {
"KIND_META": KIND_META,
"text_1": "What's coming up",
"text_2": "The next dates on the calendar",
"text_3": "Residencies, retreats and workshops — closest first.",
"text_4": "Small by design, so write early to hold a place.",


"href_7": "/events",
"text_8": "See the full calendar",
"text_9": "View programme",


"aria_label_12": "Upcoming events",


};
