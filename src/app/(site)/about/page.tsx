import { defaults as editorialDefaults } from "@/lib/editorial/defaults/app__site__about_page";
import { getEditorial } from "@/lib/editorial/server";
import Image from "@/components/editorial/image";
import { PageHero } from "@/components/sections/hero";

import SectionWave from "@/components/ui/section-wave";
import FamilyBookshelf from "@/components/sections/family-bookshelf";
import SectionEyebrow from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Parallax, ParallaxHeroImage } from "@/components/ui/parallax";
import { Icon, type IconName } from "@/components/ui/icon";
import { getContent } from "@/lib/cms";

import bandImg from "@/app/assets/new/about-band.jpg";
import storyImg from "@/app/assets/new/community-01.jpg";

export const revalidate = 300;

type Copy = Record<string, string>;



export async function generateMetadata(): Promise<import("next").Metadata> {
  return (await getEditorial("app/(site)/about/page", editorialDefaults)).seo;
}

const PRINCIPLES: Array<{ icon: IconName; title: string; body: string }> = [
  { icon: "home-outline", title: "Safe space", body: "Where you can create." },
  { icon: "sparkles-outline", title: "Non-judgemental", body: "Where you can express." },
  { icon: "leaf-outline", title: "Eco-conscious", body: "Where you can co-live with nature." },
  { icon: "people-outline", title: "Community living", body: "Where you collaborate." },
];

// Placeholder portraits + copy for now — swap `photo`, `blurb`, `since` for
// real bios later. Using hi-res community shots so the leaves don't look blurry.
const FAMILY = [
  {
    name: "Sankalp Sharma",
    role: "Founder",
    photo: "/seed/community-01.jpg",
    position: "50% 35%",
    blurb:
      "A dancer who traded the stage for the soil. Sankalp started Vinyasa as a home where artists could live, make, and belong without asking permission.",
    since: "2018",
  },
  {
    name: "Ankita Sharma",
    role: "Resident",
    photo: "/seed/community-05.jpg",
    position: "50% 40%",
    blurb:
      "Came for a week of quiet, stayed for the mornings. Now keeps the kitchen garden and the residency calendar running in step.",
    since: "2020",
  },
  {
    name: "Abhishek Gore",
    role: "Resident",
    photo: "/seed/community-06.jpg",
    position: "50% 40%",
    blurb:
      "Builder, tinkerer, night-owl. If a wall is drying or a light needs fixing, it is usually his hands on it.",
    since: "2021",
  },
  {
    name: "Coco",
    role: "Resident animal",
    photo: "/seed/community-04.jpg",
    position: "50% 45%",
    blurb:
      "Chief greeter. Escorts every new guest from the gate to the courtyard and expects a scratch as payment.",
    since: "2019",
  },
  {
    name: "Mojo",
    role: "Resident animal",
    photo: "/seed/grounds-03.jpg",
    position: "50% 50%",
    blurb:
      "Sun-spot specialist. Can be found wherever the light lands warmest, supervising from a respectful distance.",
    since: "2019",
  },
  {
    name: "Diwan",
    role: "Resident",
    photo: "/seed/community-07.jpg",
    position: "50% 40%",
    blurb:
      "Holds the long view — logistics, land, and the slow work of keeping a shared home actually shared.",
    since: "2020",
  },
];

export default async function AboutPage() {
  const content = await getEditorial("app/(site)/about/page", editorialDefaults);



  return (
    <>
      <PageHero
        eyebrow={content.text_1}
        title={content.text_2}
        description={content.text_3}
        image={content.image_4}
        imageAlt={content.imageAlt_5}
        contain imagePosition="50% 42%"
      />

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left">
            <div className="group relative aspect-[4/5] overflow-hidden border border-line">
              <Parallax enabled speed={-0.06} className="absolute inset-[-9%]">
                <Image
                  src={content.storyImg}
                  alt={content.alt_6}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Parallax>
            </div>
          </Reveal>
          <Reveal variant="right" delay={100}>
            <SectionEyebrow icon="compass-outline">{content.text_7}</SectionEyebrow>
            <h2 className="mt-3 font-display italic text-4xl leading-tight">
              {content.text_8}
            </h2>
            {content.list_1.map((p, i) => (
              <p key={i} className={`${i === 0 ? "mt-4" : "mt-3"} leading-relaxed text-foreground-soft`}>
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      <SectionWave from="#f3f1ea" to="#ece0c9" variant="wave" className="h-8 sm:h-12" />
      <FamilyBookshelf members={content.FAMILY} />

      <SectionWave from="#d4bd96" to="#f3e6d8" variant="hill" className="h-8 sm:h-12" />
      <section className="organic-section bg-clay-surface py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal variant="fade" className="mx-auto max-w-2xl text-center">
            <SectionEyebrow icon="leaf-outline" className="justify-center">{content.text_11}</SectionEyebrow>
            <h2 className="mt-3 font-display italic text-4xl leading-tight">{content.text_12}</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {content.PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} variant="up" delay={(i % 4) * 80}>
                <div className="flex h-full flex-col items-center border border-line bg-surface px-6 py-8 text-center">
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-accent/40 text-accent">
                    <Icon name={p.icon} size={20} />
                  </span>
                  <h3 className="mt-5 font-display italic text-xl">{p.title}</h3>
                  <p className="mt-2 text-sm text-foreground-soft">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative flex min-h-[62vh] items-center overflow-hidden bg-[#241a12] text-background">
        <ParallaxHeroImage>
          <Image src={content.bandImg} alt="" fill sizes="100vw" className="object-cover" />
        </ParallaxHeroImage>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 100% at 50% 40%, rgba(20,12,6,0.28) 0%, rgba(20,12,6,0.62) 70%, rgba(20,12,6,0.78) 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-[var(--background)]" />

        <Reveal
          variant="fade"
          className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center sm:px-8"
        >
          <span className="mx-auto mb-7 block h-10 w-px bg-[#d88b50]/70" aria-hidden />
          <p className="font-display text-[1.9rem] leading-snug text-[#fbf3e8] sm:text-[2.6rem]">{content.text_13}</p>
          <p className="mt-7 text-[13px] font-semibold uppercase tracking-[0.3em] text-[#f0d9be]/80">{content.text_14}</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left">
            <SectionEyebrow icon="home-outline">{content.text_15}</SectionEyebrow>
            <h2 className="mt-3 font-display italic text-4xl leading-tight">
              {content.text_16}
            </h2>
            {content.list_2.map((p, i) => (
              <p key={i} className={`${i === 0 ? "mt-4" : "mt-3"} leading-relaxed text-foreground-soft`}>
                {p}
              </p>
            ))}
          </Reveal>
          <Reveal variant="right" delay={100} className="h-full">
            <div className="group relative aspect-[4/5] h-full overflow-hidden border border-line lg:aspect-auto">
              <Parallax enabled speed={0.06} className="absolute inset-[-9%]">
                <Image
                  src={content.src_19}
                  alt={content.alt_20}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Parallax>
            </div>
          </Reveal>
        </div>
      </section>



    </>
  );
}
