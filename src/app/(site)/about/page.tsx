
import FormattedText from "@/components/editorial/formatted-text";
import { pageSeoMetadata } from "@/lib/editorial/seo";
import { mudhouseText } from "@/lib/mudhouse-wording";
import Link from "next/link";
import { defaults as editorialDefaults, previousConstructionParagraphs, previousValues, previousFounderParagraphs, previousFounderPullquote } from "@/lib/editorial/defaults/app__site__about_page";
import { getEditorial } from "@/lib/editorial/server";
import Image from "@/components/editorial/image";
import { PageHero } from "@/components/sections/hero";
import SectionWave from "@/components/ui/section-wave";
import AnimateInView from "@/components/ui/animate-in-view";
import FamilyBookshelf from "@/components/sections/family-bookshelf";
import PrincipleRow from "@/components/sections/principle-row";
import SectionEyebrow from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { ParallaxHeroImage } from "@/components/ui/parallax";
import GalleryCarouselGrid from "@/components/ui/gallery-carousel-grid";
import ConstructionStory from "@/components/sections/construction-story";
import FounderStory from "@/components/sections/founder-story";

export const revalidate = 300;

export async function generateMetadata(): Promise<import("next").Metadata> {
  return pageSeoMetadata((await getEditorial("app/(site)/about/page", editorialDefaults)).seo, editorialDefaults.seo);
}

export default async function AboutPage() {
  const content = await getEditorial("app/(site)/about/page", editorialDefaults);
  const constructionParagraphs = content.construction_paragraphs.map((paragraph) => {
    const previous = previousConstructionParagraphs.find((item) => item.label === paragraph.label);
    const updated = editorialDefaults.construction_paragraphs.find((item) => item.label === paragraph.label);
    return updated && (previous?.body === paragraph.body || mudhouseText(updated.body) === paragraph.body) ? { ...paragraph, body: updated.body } : paragraph;
  });
  const founderParagraphs = JSON.stringify(content.founder_paragraphs) === JSON.stringify(previousFounderParagraphs)
    ? editorialDefaults.founder_paragraphs : content.founder_paragraphs;
  const founderRole = content.founder_role === "Dancer, builder, founder of Vinyasa"
    ? editorialDefaults.founder_role : content.founder_role;
  const founderPullquote = content.founder_pullquote === previousFounderPullquote
    ? editorialDefaults.founder_pullquote : content.founder_pullquote;
  const values = content.values.map((value) => {
    const previous = previousValues.find((item) => item.title === value.title);
    const updated = editorialDefaults.values.find((item) => item.title === value.title);
    return previous?.body === value.body && updated ? { ...value, body: updated.body } : value;
  });
  const family = content.FAMILY.map((member) => {
    const legacyAnkitaBio = "Sankalp's partner, and the quiet rhythm behind Vinyasa's every day.";
    if (member.name === "Ankita Sharma" && member.blurb.trim() === legacyAnkitaBio) {
      return { ...member, blurb: editorialDefaults.FAMILY[0].blurb };
    }
    return member;
  });

  return (
    <div>
      <PageHero
        eyebrow={content.hero_eyebrow}
        title={content.hero_title}
        description={content.hero_description}
        image={content.hero_image}
        imageAlt={content.hero_image_alt}
        contain imagePosition="50% 42%"
      >
        <Link href="#founder" className="btn btn-outline-light">
          About the Founder
        </Link>
        <Link href="#family" className="btn btn-accent">
          Meet Our Family
        </Link>
      </PageHero>

      {/* Construction — how Vinyasa was built */}
      <AnimateInView delay={60}>
        <section className="texture-linen mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <ConstructionStory
            eyebrow={<SectionEyebrow icon="compass-outline"><FormattedText value={content.construction_eyebrow} /></SectionEyebrow>}
            title={<h2 className="mt-3 font-display italic text-4xl leading-tight"><FormattedText value={content.construction_title} /></h2>}
            paragraphs={constructionParagraphs}
            image={content.construction_image}
            imageAlt={content.construction_image_alt}
            accentImage={content.construction_accent_image}
          />
        </section>
      </AnimateInView>

      <SectionWave from="#f3f1ea" to="#e7ebdd" variant="wave" className="h-8 sm:h-12" />

      {/* Photo gallery */}
      <AnimateInView delay={60}>
        <section className="bg-dusk-surface py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal variant="fade" className="mx-auto max-w-2xl text-center">
              <SectionEyebrow icon="images-outline" className="justify-center"><FormattedText value={content.gallery_eyebrow} /></SectionEyebrow>
              <h2 className="mt-3 font-display italic text-4xl leading-tight"><FormattedText value={content.gallery_title} /></h2>
            </Reveal>

            <div className="mt-10">
              <GalleryCarouselGrid
                images={content.gallery_photos.map((photo) => photo.image)}
                alt="Vinyasa Earth built with earth, walls and open studios"
                perSlide={6}
                rounded
                threeCol
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
              <SectionEyebrow icon="leaf-outline" className="justify-center"><FormattedText value={content.values_eyebrow} /></SectionEyebrow>
              <h2 className="mt-3 font-display italic text-4xl leading-tight"><FormattedText value={content.values_title} /></h2>
            </Reveal>

            <div className="mt-14">
              {values.map((v, i) => (
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
        <section id="founder" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <FounderStory
            eyebrow={<SectionEyebrow icon="star-outline"><FormattedText value={content.founder_eyebrow} /></SectionEyebrow>}
            title={<h2 className="mt-3 font-display italic text-4xl leading-tight"><FormattedText value={content.founder_title} /></h2>}
            role={<p className="mt-1 text-sm font-semibold uppercase tracking-[0.2em] text-accent"><FormattedText value={founderRole} /></p>}
            paragraphs={founderParagraphs}
            pullquote={founderPullquote}
            image={content.founder_image}
            imageAlt={content.founder_image_alt}
          />
        </section>
      </AnimateInView>

      <SectionWave from="#f3f1ea" to="#fbf9f3" variant="wave" className="h-8 sm:h-12" />

      {/* Community bookshelf */}
      <AnimateInView delay={60}><FamilyBookshelf members={family} /></AnimateInView>

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
            <p className="font-display text-[2.1rem] leading-snug text-[#fbf3e8] sm:text-[2.9rem]"><FormattedText value={content.quote_text} /></p>
            <p className="mt-7 text-[13px] font-semibold uppercase tracking-[0.3em] text-[#f0d9be]/80"><FormattedText value={content.quote_caption} /></p>
          </Reveal>
        </section>
      </AnimateInView>
    </div>
  );
}
