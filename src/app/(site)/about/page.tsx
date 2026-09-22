import { defaults as editorialDefaults } from "@/lib/editorial/defaults/app__site__about_page";
import { getEditorial } from "@/lib/editorial/server";
import Image from "@/components/editorial/image";
import { PageHero } from "@/components/sections/hero";
import SectionWave from "@/components/ui/section-wave";
import AnimateInView from "@/components/ui/animate-in-view";
import FamilyBookshelf from "@/components/sections/family-bookshelf";
import PrincipleRow from "@/components/sections/principle-row";
import SectionEyebrow from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Parallax, ParallaxHeroImage } from "@/components/ui/parallax";
import GalleryCarouselGrid from "@/components/ui/gallery-carousel-grid";

export const revalidate = 300;

export async function generateMetadata(): Promise<import("next").Metadata> {
  return (await getEditorial("app/(site)/about/page", editorialDefaults)).seo;
}

export default async function AboutPage() {
  const content = await getEditorial("app/(site)/about/page", editorialDefaults);

  return (
    <div>
      <PageHero
        eyebrow={content.hero_eyebrow}
        title={content.hero_title}
        description={content.hero_description}
        image={content.hero_image}
        imageAlt={content.hero_image_alt}
        contain imagePosition="50% 42%"
      />

      {/* Construction — how Vinyasa was built */}
      <AnimateInView delay={60}>
        <section className="texture-linen mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <Reveal variant="left">
              <SectionEyebrow icon="compass-outline">{content.construction_eyebrow}</SectionEyebrow>
              <h2 className="mt-3 font-display italic text-4xl leading-tight">{content.construction_title}</h2>

              <div className="mt-8 space-y-8">
                {content.construction_paragraphs.map((p, i) => (
                  <Reveal key={p.label} variant="up" delay={i * 60}>
                    <div className="border-l-2 border-accent/30 pl-5">
                      <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">{p.label}</span>
                      <p className="mt-2 leading-relaxed text-foreground-soft">{p.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>

            <Reveal variant="right" delay={100} className="lg:sticky lg:top-28">
              <div className="relative aspect-[4/5]">
                <div aria-hidden className="absolute -bottom-4 -left-4 h-full w-full border border-clay-ink/15 bg-clay-surface" />
                <div aria-hidden className="absolute -bottom-2 -left-2 h-full w-full bg-accent/10" />
                <div className="group relative h-full w-full overflow-hidden shadow-[0_30px_60px_-28px_rgba(30,20,12,0.4)]">
                  <Parallax enabled speed={-0.06} className="absolute inset-[-9%]">
                    <Image
                      src={content.construction_image}
                      alt={content.construction_image_alt}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Parallax>
                </div>
                <div className="absolute -right-6 -top-6 hidden h-28 w-28 overflow-hidden rounded-tl-[2.5rem] rounded-br-[2.5rem] border-4 border-background shadow-lg sm:block">
                  <Image
                    src={content.construction_accent_image}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </AnimateInView>

      <SectionWave from="#f3f1ea" to="#e7ebdd" variant="wave" className="h-8 sm:h-12" />

      {/* Photo gallery */}
      <AnimateInView delay={60}>
        <section className="bg-dusk-surface py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal variant="fade" className="mx-auto max-w-2xl text-center">
              <SectionEyebrow icon="images-outline" className="justify-center">{content.gallery_eyebrow}</SectionEyebrow>
              <h2 className="mt-3 font-display italic text-4xl leading-tight">{content.gallery_title}</h2>
            </Reveal>

            <div className="mt-10">
              <GalleryCarouselGrid
                images={content.gallery_photos.map((photo) => photo.image)}
                alt="Vinyasa Earth built with earth, walls and open studios"
                perSlide={6}
                rounded
              />
            </div>
          </div>
        </section>
      </AnimateInView>

      <SectionWave from="#e7ebdd" to="#f3e6d8" variant="hill" className="h-8 sm:h-12" />

      {/* Principles — the Vinyasa way */}
      <AnimateInView delay={80}>
        <section className="organic-section bg-clay-surface py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <Reveal variant="fade" className="mx-auto max-w-2xl text-center">
              <SectionEyebrow icon="leaf-outline" className="justify-center">{content.values_eyebrow}</SectionEyebrow>
              <h2 className="mt-3 font-display italic text-4xl leading-tight">{content.values_title}</h2>
            </Reveal>

            <div className="mt-14">
              {content.values.map((v, i) => (
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

      <SectionWave from="#f3e6d8" to="#f3f1ea" variant="wave" className="h-8 sm:h-12" />

      {/* About the founder */}
      <AnimateInView delay={100}>
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <Reveal variant="left">
              <SectionEyebrow icon="star-outline">{content.founder_eyebrow}</SectionEyebrow>
              <h2 className="mt-3 font-display italic text-4xl leading-tight">{content.founder_title}</h2>
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.2em] text-accent">{content.founder_role}</p>

              <div className="mt-6 space-y-4">
                {content.founder_paragraphs.map((p, i) => (
                  <p key={i} className="leading-relaxed text-foreground-soft">{p}</p>
                ))}
              </div>

              <blockquote className="mt-8 border-l-2 border-accent/40 pl-5 font-display italic text-xl leading-snug text-clay-ink">
                {content.founder_pullquote}
              </blockquote>
            </Reveal>

            <Reveal variant="right" delay={100} className="lg:sticky lg:top-28">
              <div className="relative aspect-[4/5]">
                <div aria-hidden className="absolute -bottom-4 -left-4 h-full w-full border border-clay-ink/15 bg-clay-surface" />
                <div aria-hidden className="absolute -bottom-2 -left-2 h-full w-full bg-accent/10" />
                <div className="group relative h-full w-full overflow-hidden shadow-[0_30px_60px_-28px_rgba(30,20,12,0.4)]">
                  <Parallax enabled speed={0.06} className="absolute inset-[-9%]">
                    <Image
                      src={content.founder_image}
                      alt={content.founder_image_alt}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Parallax>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </AnimateInView>

      <SectionWave from="#f3f1ea" to="#ece0c9" variant="wave" className="h-8 sm:h-12" />

      {/* Community bookshelf */}
      <AnimateInView delay={60}><FamilyBookshelf members={content.FAMILY} /></AnimateInView>

      <style>{`:root { --wave-lead: #241a12; }`}</style>

      {/* Closing quote band */}
      <AnimateInView delay={80}>
        <section className="relative flex min-h-[62vh] items-center overflow-hidden bg-[#241a12] text-background">
          <ParallaxHeroImage>
            <Image src={content.bandImg} alt="" fill sizes="100vw" className="object-cover" />
          </ParallaxHeroImage>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-[#d4bd96] via-[#d4bd96]/40 to-transparent sm:h-32"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 100% at 50% 40%, rgba(20,12,6,0.28) 0%, rgba(20,12,6,0.62) 70%, rgba(20,12,6,0.78) 100%)",
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#241a12]" />

          <Reveal
            variant="fade"
            className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center sm:px-8"
          >
            <span className="mx-auto mb-7 block h-10 w-px bg-[#d88b50]/70" aria-hidden />
            <p className="font-display text-[2.1rem] leading-snug text-[#fbf3e8] sm:text-[2.9rem]">{content.quote_text}</p>
            <p className="mt-7 text-[13px] font-semibold uppercase tracking-[0.3em] text-[#f0d9be]/80">{content.quote_caption}</p>
          </Reveal>
        </section>
      </AnimateInView>
    </div>
  );
}
