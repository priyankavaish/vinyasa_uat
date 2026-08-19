import SectionEyebrow from "./section-eyebrow";
import { Reveal } from "./reveal";
import { ADDRESS, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, GOOGLE_MAPS_EMBED_SRC, GOOGLE_MAPS_LINK, GOOGLE_RATING } from "@/lib/site";

export default function LocationSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <div className="grid gap-10 sm:grid-cols-2">
        <Reveal variant="left">
          <SectionEyebrow icon="location-outline">Find us</SectionEyebrow>
          <h2 className="mt-3 max-w-[20ch] font-display italic text-4xl leading-tight">
            In the folds of Amer, minutes from the fort
          </h2>
          <dl className="mt-8 space-y-5 text-sm">
            <div>
              <dt className="text-xs tracking-[0.08em] uppercase text-foreground-soft">Address</dt>
              <dd className="mt-1 text-foreground-soft">{ADDRESS}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.08em] uppercase text-foreground-soft">Phone / WhatsApp</dt>
              <dd className="mt-1">
                <a href={`tel:${CONTACT_PHONE_DISPLAY.replace(/\s/g, "")}`}>{CONTACT_PHONE_DISPLAY}</a>
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.08em] uppercase text-foreground-soft">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.08em] uppercase text-foreground-soft">Hours</dt>
              <dd className="mt-1 text-foreground-soft">{GOOGLE_RATING.hours} (per Google Business Profile)</dd>
            </div>
          </dl>
          <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-8 inline-block">
            Get Directions
          </a>
        </Reveal>
        <Reveal variant="right" delay={100} className="min-h-[360px] border border-line">
          <iframe
            title="Vinyasa Earth location"
            src={GOOGLE_MAPS_EMBED_SRC}
            className="h-full min-h-[360px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </div>
    </section>
  );
}
