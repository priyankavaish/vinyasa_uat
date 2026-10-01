import { defaults as editorialDefaults } from "@/lib/editorial/defaults/app__site__artist_escape_page";
import { getEditorial } from "@/lib/editorial/server";
import SectionWave from "@/components/ui/section-wave";
import AnimateInView from "@/components/ui/animate-in-view";
import SectionEyebrow from "@/components/ui/section-eyebrow";
import SectionHeading from "@/components/ui/section-heading";
import { Icon, type IconName } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { ParallaxHeroImage } from "@/components/ui/parallax";
import Image from "@/components/editorial/image";
import PrincipleRow from "@/components/sections/principle-row";
import ArtistEscapeVideoHero from "@/components/sections/artist-escape-video-hero";
import ArtistEscapeShort from "@/components/sections/artist-escape-short";
import ArtistEscapeApplicationForm from "@/components/forms/artist-escape-application-form";

import ArtistOfferings from "@/components/sections/artist-offerings";
import ArtistInResidenceSection from "@/components/sections/artist-in-residence-section";

export const revalidate = 300;

const PROCESS_ICONS: IconName[] = ["sparkles-outline", "people-outline", "ribbon-outline"];

export async function generateMetadata(): Promise<import("next").Metadata> {
  const { seo } = await getEditorial("app/(site)/artist-escape/page", editorialDefaults);
  return { ...seo, title: editorialDefaults.seo.title, description: "Explore Artist Escape and Artist in Residence at Vinyasa Earth, Jaipur. Two offerings for creative practice, community and research." };
}

export default async function ArtistEscapePage() {
  const content = await getEditorial("app/(site)/artist-escape/page", editorialDefaults);

  return (
    <div>
      {/* Full-bleed video hero */}
      <ArtistEscapeVideoHero
        youtubeId={content.hero_youtube_id}
        eyebrow={editorialDefaults.hero_eyebrow}
        title={editorialDefaults.hero_title}
        description={content.hero_description}
      />

      <ArtistOfferings escapeImage={content.vision_image} />

      {/* Vision — with the vertical short as its visual */}
      <AnimateInView delay={60}>
        <section id="artist-escape" className="texture-linen scroll-mt-24 py-14 sm:py-16">
          <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal variant="left" className="order-2 lg:order-1">
              <SectionEyebrow icon="sparkles-outline">Space to Create &middot; Artist Escape</SectionEyebrow>
              <h2 className="mt-3 font-display italic text-4xl leading-tight">{content.vision_title}</h2>
              <div className="mt-5 space-y-5">
                {content.vision_paragraphs.map((p) => (
                  <div key={p.label} className="border-l-2 border-accent/30 pl-5">
                    <span className="font-display italic text-2xl leading-tight">{p.label}</span>
                    <p className="mt-2 leading-relaxed text-foreground-soft">{p.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal variant="right" delay={100} className="order-1 lg:order-2">
              <ArtistEscapeShort youtubeId={content.short_youtube_id} />
            </Reveal>
          </div>
        </section>
      </AnimateInView>

      <SectionWave from="#f3f1ea" to="#eef0e4" variant="slant" className="h-8 sm:h-12" />

      {/* A moment at Artist Escape — vertical short */}
      <AnimateInView delay={60}>
        <section className="bg-secondary-surface py-12 sm:py-14">
          <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal variant="left" className="order-1">
              <div className="relative aspect-[4/3] w-full">
                <div aria-hidden className="absolute -bottom-4 -left-4 h-full w-full border border-clay-ink/15 bg-clay-surface" />
                <div aria-hidden className="absolute -bottom-2 -left-2 h-full w-full bg-accent/10" />
                <div className="group relative h-full w-full overflow-hidden shadow-[0_30px_60px_-28px_rgba(30,20,12,0.4)]">
                  <Image
                    src={content.vision_image}
                    alt={content.vision_image_alt}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </Reveal>
            <Reveal variant="right" delay={100} className="order-2">
              <SectionEyebrow icon="camera-outline">{content.short_eyebrow}</SectionEyebrow>
              <h2 className="mt-3 font-display italic text-4xl leading-tight">{content.short_title}</h2>
              <p className="mt-4 max-w-md leading-relaxed text-foreground-soft">{content.short_body}</p>
            </Reveal>
          </div>
        </section>
      </AnimateInView>

      {/* Pull-quote */}
      <AnimateInView delay={60}>
        <section className="relative flex min-h-[38vh] items-center overflow-hidden bg-[#241a12] text-background">
          <ParallaxHeroImage>
            <Image src={content.pullquote_image} alt="" fill sizes="100vw" className="object-cover" />
          </ParallaxHeroImage>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-[#d4bd96] via-[#d4bd96]/40 to-transparent sm:h-32"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 100% at 50% 40%, rgba(20,12,6,0.28) 0%, rgba(20,12,6,0.62) 70%, rgba(20,12,6,0.78) 100%)",
            }}
          />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#241a12]" />
          <Reveal variant="fade" className="relative z-10 mx-auto max-w-3xl px-6 py-12 text-center sm:px-8">
            <span
              aria-hidden
              className="pointer-events-none block font-display text-[5rem] leading-none text-[#d4bd96]/40 sm:text-[6.5rem]"
            >
              &ldquo;
            </span>
            <p className="-mt-8 font-display text-[2.3rem] italic leading-snug text-[#fbf3e8] sm:-mt-10 sm:text-[3.1rem]">
              {content.pullquote_text}
            </p>
            <span className="mx-auto mt-7 block h-px w-14 bg-[#d88b50]/70" aria-hidden />
            <p className="mt-5 text-[13px] font-semibold uppercase tracking-[0.3em] text-[#f0d9be]/80">
              {content.pullquote_caption}
            </p>
          </Reveal>
        </section>
      </AnimateInView>

      <SectionWave from="#241a12" to="#eef0e4" variant="wave" className="h-8 sm:h-12" />

      {/* Eligibility — three pillars */}
      <AnimateInView delay={80}>
        <section className="organic-section texture-linen bg-secondary-surface py-12 sm:py-14">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <SectionHeading icon="ribbon-outline" eyebrow={content.eligibility_eyebrow} title={content.eligibility_title} />

            <div className="mt-10">
              {content.eligibility.map((v, i) => (
                <PrincipleRow
                  key={v.title}
                  index={i + 1}
                  icon={v.icon}
                  title={v.title}
                  body={v.body}
                  image={v.image}
                  imageAlt={v.imageAlt}
                  reverse={i % 2 === 1}
                />
              ))}
            </div>
          </div>
        </section>
      </AnimateInView>

      <SectionWave from="#eef0e4" to="#f3e6d8" variant="hill" className="h-8 sm:h-12" />

      {/* Application process */}
      <AnimateInView delay={60}>
        <section className="bg-clay-surface py-12 sm:py-14">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <SectionHeading icon="compass-outline" eyebrow="Artist Escape" title={content.process_title} />

            <div className="relative mt-12 grid gap-8 sm:grid-cols-3">
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-8 hidden border-t border-dashed border-accent/25 sm:block" />
              {content.process_steps.map((step, i) => (
                <Reveal key={step.title} variant="fade" delay={i * 80} className="relative">
                  <div className="relative overflow-hidden rounded-tl-2xl rounded-br-2xl border border-clay-ink/15 bg-surface p-7 text-center shadow-[0_18px_40px_-26px_rgba(30,20,12,0.35)] transition-transform duration-300 hover:-translate-y-1">
                    <span className="relative mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent/10 text-accent ring-4 ring-surface">
                      <Icon name={PROCESS_ICONS[i] ?? "sparkles-outline"} size={20} />
                    </span>
                    <h3 className="relative mt-4 font-display italic text-2xl leading-tight">{step.title}</h3>
                    <p className="relative mt-2 text-sm leading-relaxed text-foreground-soft">{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal variant="fade" delay={200} className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-tl-2xl rounded-br-2xl border border-accent/20 bg-surface text-center shadow-[0_18px_40px_-26px_rgba(30,20,12,0.3)]">
              <div className="border-b border-accent/15 bg-accent/5 px-8 py-6">
                <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-accent/10 text-accent">
                  <Icon name="calendar-outline" size={18} />
                </span>
                <h3 className="mt-3 font-display italic text-2xl">{content.pricing_title}</h3>
              </div>
              <div className="p-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  {content.pricing_tiers.map((tier, i) => (
                    <div
                      key={tier.label}
                      className={`rounded-tl-xl rounded-br-xl border p-5 ${i === 0 ? "border-accent/30 bg-accent/5" : "border-line"}`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{tier.label}</p>
                      <p className="mt-2 font-display italic text-3xl">{tier.price}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-sm text-foreground-soft">{content.pricing_note}</p>
              </div>
            </Reveal>
          </div>
        </section>
      </AnimateInView>


      {/* Apply — intro + application form */}
      <AnimateInView delay={80}>
        <section id="apply" className="scroll-mt-24 bg-clay-surface py-14 sm:py-16">
          <div className="mx-auto grid max-w-5xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <Reveal variant="left">
              <SectionEyebrow icon="sparkles-outline">Apply for Artist Escape</SectionEyebrow>
              <h2 className="mt-3 font-display italic text-4xl leading-tight">{content.cta_title}</h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-foreground-soft">
                {content.cta_paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="mt-6 space-y-2 text-sm">
                <a href={`mailto:${content.cta_email}`} className="flex w-fit items-center gap-2 text-accent hover:underline">
                  {content.cta_email}
                </a>
                <a href={`tel:${content.cta_phone}`} className="flex w-fit items-center gap-2 text-accent hover:underline">
                  {content.cta_phone}
                </a>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground-soft/80">{content.cta_location}</p>
              </div>
            </Reveal>

            <Reveal variant="right" delay={100}>
              <ArtistEscapeApplicationForm />
            </Reveal>
          </div>
        </section>
      </AnimateInView>

      <ArtistInResidenceSection />

      <SectionWave from="#eef0e4" to="#f3f1ea" variant="wave" className="h-8 sm:h-12" />

      {/* Artists gallery */}
      <AnimateInView delay={60}>
        <section id="artists" className="scroll-mt-24 py-12 sm:py-14">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <SectionHeading
              icon="images-outline"
              eyebrow={content.artists_eyebrow}
              title={content.artists_title}
              description={content.artists_description}
            />

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {content.artist_photos.map((artist, i) => (
                <Reveal key={artist.name + i} variant="fade" delay={(i % 6) * 40} className="group relative aspect-[3/4] overflow-hidden rounded-tl-[1.5rem] rounded-br-[1.5rem] border border-line">
                  <Image
                    src={artist.image}
                    alt={`${artist.name} — ${artist.skill}`}
                    fill
                    sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 45vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3 text-left text-background">
                    <p className="font-display italic text-base leading-tight sm:text-lg">{artist.name}</p>
                    <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-background/80">
                      {artist.skill}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </AnimateInView>

      <style>{`:root { --wave-lead: #f3f1ea; }`}</style>
    </div>
  );
}
