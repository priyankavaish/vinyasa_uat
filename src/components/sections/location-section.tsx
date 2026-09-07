import Image from "next/image";
import flowerPotBackground from "@/app/assets/bg_flower_pot.png";
import { Reveal } from "../ui/reveal";
import { Icon, type IconName } from "../ui/icon";
import { ParallaxHeroImage } from "../ui/parallax";
import LeadForm from "../forms/lead-form";
import { ADDRESS, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, GOOGLE_MAPS_EMBED_SRC, GOOGLE_MAPS_LINK, GOOGLE_RATING } from "@/lib/site";

const CONTACT_ITEMS: Array<{ label: string; value: string; icon: IconName; href?: string }> = [
  { label: "Address", value: ADDRESS, icon: "home-outline" },
  { label: "Phone / WhatsApp", value: CONTACT_PHONE_DISPLAY, icon: "logo-whatsapp", href: `tel:${CONTACT_PHONE_DISPLAY.replace(/\s/g, "")}` },
  { label: "Email", value: CONTACT_EMAIL, icon: "ribbon-outline", href: `mailto:${CONTACT_EMAIL}` },
  { label: "Hours", value: `${GOOGLE_RATING.hours} (Google Business Profile)`, icon: "sunny-outline" },
];

function LocationMap({ fullWidth = false }: { fullWidth?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-[2rem] border border-white/90 bg-[#f3eadc]/85 p-2 shadow-[0_2rem_5rem_rgba(78,58,38,0.16)] sm:p-3 ${fullWidth ? "min-h-[460px] sm:min-h-[540px]" : "min-h-[460px] sm:min-h-[560px]"}`}>
      <div className="absolute left-6 right-6 top-6 z-10 hidden rounded-2xl border border-[#d9cbb6] bg-[#fbf7ef]/95 p-5 text-[#2b2620] shadow-[0_1rem_2.5rem_rgba(41,31,22,0.18)] backdrop-blur-md sm:block sm:max-w-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl italic">Vinyasa Earth</h3>
            <p className="mt-2 text-xs leading-relaxed text-foreground-soft">{ADDRESS}</p>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="font-semibold">{GOOGLE_RATING.score}</span>
              <Icon name="star" size={14} className="text-accent" />
              <span className="text-foreground-soft">({GOOGLE_RATING.count})</span>
            </div>
          </div>
          <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer" aria-label="Open Vinyasa Earth in Google Maps" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-accent/30 text-accent transition-colors hover:bg-accent hover:text-white">
            <Icon name="arrow-forward-outline" size={15} />
          </a>
        </div>
      </div>
      <iframe
        title="Vinyasa Earth location"
        src={GOOGLE_MAPS_EMBED_SRC}
        className={`h-full w-full rounded-[1.5rem] ${fullWidth ? "min-h-[444px] sm:min-h-[516px]" : "min-h-[444px] sm:min-h-[536px]"}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export default function LocationSection({ showContactForm = false }: { showContactForm?: boolean }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#f7f1e7] py-20 text-foreground sm:py-24">
      <ParallaxHeroImage className="pointer-events-none">
        <Image src={flowerPotBackground} alt="" fill sizes="100vw" className="object-cover object-center opacity-[0.48]" aria-hidden="true" />
      </ParallaxHeroImage>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(247,241,231,0.48)_0%,rgba(247,241,231,0.64)_44%,rgba(247,241,231,0.30)_100%)]" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <Reveal variant="left">
          <p className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.22em] text-[#a84f32]">
            <Icon name="location-outline" size={17} /> Find us
          </p>
          <h2 className="mt-5 max-w-[18ch] font-display text-5xl italic leading-[1.06] text-[#342d24] sm:text-6xl">In the folds of Amer, minutes from the fort</h2>
          <div className="mt-7 flex items-center gap-3 text-[#a84f32]/70" aria-hidden="true">
            <span className="h-px w-32 bg-gradient-to-r from-[#a84f32]/70 to-transparent" />
            <Icon name="leaf-outline" size={18} />
          </div>
          <dl className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {CONTACT_ITEMS.map((item) => (
              <div key={item.label} className="group flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#a84f32]/45 bg-[#fbf7ef]/80 text-[#a84f32] shadow-sm backdrop-blur-sm transition-colors group-hover:bg-[#8f3b31] group-hover:text-white"><Icon name={item.icon} size={20} /></span>
                <div className="min-w-0 border-l border-[#a84f32]/20 pl-4">
                  <dt className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#a84f32]">{item.label}</dt>
                  <dd className="mt-1 max-w-[34ch] text-sm leading-relaxed text-foreground-soft">{item.href ? <a href={item.href} className="transition-colors hover:text-foreground">{item.value}</a> : item.value}</dd>
                </div>
              </div>
            ))}
          </dl>
          <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex items-center gap-3 border border-[#a84f32]/70 bg-[#fbf7ef]/55 px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#8f3b31] transition-all hover:-translate-y-0.5 hover:border-[#8f3b31] hover:bg-[#8f3b31] hover:text-white">
            Get directions <Icon name="arrow-forward-outline" size={15} />
          </a>
        </Reveal>

        {showContactForm ? (
          <Reveal variant="right" delay={100}>
            <div className="rounded-[1.25rem_4rem_1.25rem_4rem] border border-[#d9cbb6] bg-[#fbf7ef]/95 p-6 shadow-[0_1.5rem_4rem_rgba(78,58,38,0.14)] backdrop-blur-md sm:p-9">
              <div className="mb-7 text-center">
                <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#a84f32]">Write to us</p>
                <h2 className="mt-2 font-display text-3xl italic text-foreground sm:text-4xl">Start a conversation</h2>
              </div>
              <LeadForm source="contact" title="Send a message" />
            </div>
          </Reveal>
        ) : (
          <Reveal variant="right" delay={100}><LocationMap /></Reveal>
        )}
      </div>

      {showContactForm && (
        <Reveal variant="up" delay={180} className="relative z-10 mx-auto mt-14 max-w-7xl px-5 sm:px-8">
          <LocationMap fullWidth />
        </Reveal>
      )}
    </section>
  );
}