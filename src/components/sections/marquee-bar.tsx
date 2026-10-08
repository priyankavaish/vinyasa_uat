
import FormattedText from "@/components/editorial/formatted-text";

import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_sections_marquee_bar";
import { getEditorial } from "@/lib/editorial/server";
import { Icon } from "@/components/ui/icon";

const ITEMS = [
  "Six hand-built mudhouses",
  "Artist Escape applications open",
  "Corporate offsites and team retreats",
];

export default async function MarqueeBar() {
  const content = await getEditorial("components/sections/marquee-bar", editorialDefaults);

  const loop = [...ITEMS, ...ITEMS];

  return (
    <aside
      aria-label={content.aria_label_1}
      className="marquee-strip relative z-10 overflow-hidden border-y border-clay-ink/15 bg-clay-surface text-clay-ink"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-clay-surface to-transparent sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-clay-surface to-transparent sm:w-20" />

      <div className="marquee-track relative flex w-max items-center py-2 sm:py-2.5">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="flex shrink-0 items-center">
            <span className="px-5 font-display text-sm uppercase tracking-[0.14em] text-clay-ink whitespace-nowrap sm:px-7 sm:text-base">
              <FormattedText value={item} />
            </span>
            <span aria-hidden="true" className="grid place-items-center text-accent">
              <Icon name="leaf-outline" size={13} className="-rotate-45" />
            </span>
          </span>
        ))}
      </div>
    </aside>
  );
}
