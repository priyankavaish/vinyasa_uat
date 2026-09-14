import type { IconName } from "@/components/ui/icon";

export type EventSlide = {
  slug: string;
  name: string;
  date: string;
  image: string;
  label: string;
  icon: IconName;
  accent: string;
};

export const defaults = {
"aria_label_1": "Upcoming events",


"text_4": "View programme",


"aria_label_7": "Previous event",
"aria_label_8": "Next event",


};
