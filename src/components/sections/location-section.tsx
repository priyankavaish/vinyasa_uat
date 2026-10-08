
import FormattedText from "@/components/editorial/formatted-text";

import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_sections_location_section";
import { getEditorial } from "@/lib/editorial/server";
import { Reveal } from "../ui/reveal";
import { Icon, type IconName } from "../ui/icon";
import LeadForm from "../forms/lead-form";
import { ADDRESS, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, GOOGLE_MAPS_EMBED_SRC, GOOGLE_MAPS_LINK, GOOGLE_RATING } from "@/lib/site";

const CONTACT_ITEMS: Array<{ label: string; value: string; icon: IconName; href?: string }> = [
  { label: "Address", value: ADDRESS, icon: "home-outline" },
  { label: "Phone / WhatsApp", value: CONTACT_PHONE_DISPLAY, icon: "logo-whatsapp", href: `tel:${CONTACT_PHONE_DISPLAY.replace(/\s/g, "")}` },
  { label: "Email", value: CONTACT_EMAIL, icon: "ribbon-outline", href: `mailto:${CONTACT_EMAIL}` },
  { label: "Hours", value: `${GOOGLE_RATING.hours} (Google Business Profile)`, icon: "sunny-outline" },
];

async function LocationMap({ fullWidth = false }: { fullWidth?: boolean }) {
  const content = await getEditorial("components/sections/location-section", editorialDefaults);

  return (
    <div className={`relative overflow-hidden border border-line bg-surface p-2 shadow-[0_1.5rem_4rem_rgba(78,58,38,0.14)] sm:p-3 ${fullWidth ? "min-h-[460px] sm:min-h-[540px]" : "min-h-[460px] sm:min-h-[560px]"}`}>
      <div className="absolute left-6 right-6 top-6 z-10 hidden border border-line bg-surface p-5 text-foreground shadow-[0_1rem_2.5rem_rgba(41,31,22,0.16)] sm:block sm:max-w-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl italic"><FormattedText value={content.text_1} /></h3>
            <p className="mt-2 text-xs leading-relaxed text-foreground-soft"><FormattedText value={content.ADDRESS} /></p>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="font-semibold">{content.GOOGLE_RATING.score}</span>
              <Icon name="star" size={14} className="text-accent" />
              <span className="text-foreground-soft">({content.GOOGLE_RATING.count})</span>
            </div>
          </div>
          <a href={content.GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer" aria-label={content.aria_label_2} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-accent/30 text-[var(--accent)] transition-colors hover:bg-accent hover:text-white">
            <Icon name="arrow-forward-outline" size={15} />
          </a>
        </div>
      </div>
      <iframe
        title={content.title_3}
        src={content.GOOGLE_MAPS_EMBED_SRC}
        className={`h-full w-full ${fullWidth ? "min-h-[444px] sm:min-h-[516px]" : "min-h-[444px] sm:min-h-[536px]"}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export default async function LocationSection({ showContactForm = false }: { showContactForm?: boolean }) {
  const content = await getEditorial("components/sections/location-section", editorialDefaults);

  return (
    <section className="relative isolate overflow-hidden bg-clay-surface pb-14 pt-8 text-foreground sm:pb-20 sm:pt-10">
      <div className="relative z-10 mx-auto grid max-w-7xl items-start gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        {/* form first — visible on landing */}
        <Reveal variant="up">
          <div id="contact-form" className="scroll-mt-24 border border-line bg-surface p-6 shadow-[0_1.5rem_4rem_rgba(78,58,38,0.12)] sm:p-7">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent"><FormattedText value={content.text_4} /></p>
            <h2 className="mt-2 font-display text-3xl italic text-clay-ink sm:text-4xl"><FormattedText value={content.text_5} /></h2>
            <div className="mt-4">
              <LeadForm source="contact" title={content.title_6} />
            </div>
          </div>
        </Reveal>

        {/* location + details */}
        <Reveal variant="up" delay={100}>
          <p className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            <Icon name="location-outline" size={16} /><FormattedText value={content.text_7} /></p>
          <h2 className="mt-3 max-w-[18ch] font-display text-3xl italic leading-[1.1] text-clay-ink sm:text-4xl"><FormattedText value={content.text_8} /></h2>
          <dl className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {content.CONTACT_ITEMS.map((item) => (
              <div key={item.label} className="group flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center border border-accent/40 bg-surface text-[var(--accent)] transition-colors group-hover:bg-accent group-hover:text-white">
                  <Icon name={item.icon} size={18} />
                </span>
                <div className="min-w-0 border-l border-accent/20 pl-4">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                    <FormattedText value={item.label} />
                  </dt>
                  <dd className="mt-0.5 max-w-[34ch] text-sm leading-relaxed text-foreground-soft">
                    {item.href ? (
                      <a href={item.href} className="transition-colors hover:text-foreground">
                        <FormattedText value={item.value} links={false} />
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
          <a
            href={content.GOOGLE_MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent mt-7"
          ><span className="inline-flex flex-nowrap items-center gap-3"><span><FormattedText value={content.text_9} links={false} /></span><Icon name="arrow-forward-outline" size={15} className="shrink-0" /></span>
          </a>
        </Reveal>
      </div>

      <Reveal
        variant="up"
        delay={160}
        className="relative z-10 mx-auto mt-12 max-w-7xl px-5 sm:px-8"
      >
        <LocationMap fullWidth />
      </Reveal>
    </section>
  );
}