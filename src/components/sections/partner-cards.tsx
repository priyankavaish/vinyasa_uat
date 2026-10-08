"use client";
import FormattedText from "@/components/editorial/formatted-text";

import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_sections_partner_cards";
import { useEditorial } from "@/components/editorial/provider";


import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";

export type PartnerCard = {
  name: string;
  logo: string;
  blurb: string;
  about: readonly string[];
};

export default function PartnerCards({ partners }: { partners: readonly PartnerCard[] }) {
  const content = useEditorial("components/sections/partner-cards", editorialDefaults);

  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (active !== null && !dlg.open) dlg.showModal();
    if (active === null && dlg.open) dlg.close();
  }, [active]);

  const current = active !== null ? partners[active] : null;

  return (
    <>
      <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
        {partners.map((partner, i) => (
          <article
            key={partner.name}
            className="flex h-full flex-col border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_56px_-30px_rgba(45,35,25,0.35)] sm:p-8"
          >
            <div className="flex h-16 items-center justify-center border-b border-line pb-5">
              <img
                src={partner.logo}
                alt={partner.name}
                loading="lazy"
                className="max-h-14 w-auto max-w-full object-contain"
              />
            </div>
            <h3 className="mt-5 font-display text-xl italic text-foreground"><FormattedText value={partner.name} /></h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground-soft">
              <FormattedText value={partner.blurb} />
            </p>
            <button
              type="button"
              onClick={() => setActive(i)}
              className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-accent transition-[gap] duration-300 hover:gap-3.5"
            ><FormattedText value={content.text_1} links={false} /><Icon name="arrow-forward-outline" size={13} />
            </button>
          </article>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setActive(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setActive(null);
        }}
        className="m-auto w-[min(92vw,42rem)] border border-line bg-surface p-0 text-foreground shadow-[0_40px_100px_-30px_rgba(35,25,15,0.5)] backdrop:bg-black/55 backdrop:backdrop-blur-sm"
      >
        {current && (
          <div className="max-h-[85vh] overflow-y-auto p-7 sm:p-10">
            <div className="flex items-start justify-between gap-6 border-b border-line pb-6">
              <img
                src={current.logo}
                alt={current.name}
                className="max-h-12 w-auto max-w-[55%] object-contain"
              />
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label={content.aria_label_2}
                className="grid h-9 w-9 shrink-0 place-items-center border border-line text-foreground-soft transition-colors hover:border-accent hover:text-accent"
              >
                <Icon name="close-outline" size={18} />
              </button>
            </div>

            <h3 className="mt-6 font-display text-2xl italic text-clay-ink sm:text-3xl"><FormattedText value={content.text_3} /><FormattedText value={current.name} />
            </h3>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground-soft">
              {current.about.map((para, p) => (
                <p key={p}><FormattedText value={para} /></p>
              ))}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
