import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/hero";
import SectionEyebrow from "@/components/section-eyebrow";
import { Reveal } from "@/components/reveal";
import { Parallax, ParallaxHeroImage } from "@/components/parallax";
import { Icon, type IconName } from "@/components/icon";
import { getContent } from "@/lib/cms";

import heroImg from "@/app/assets/new/grounds-05.jpg";
import bandImg from "@/app/assets/new/about-band.jpg";

export const revalidate = 300;

type Copy = Record<string, string>;
const paras = (s = "") => s.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
import storyImg from "@/app/assets/new/community-01.jpg";
import craftImg from "@/app/assets/new/grounds-09.jpg";

export const metadata = {
  title: "About",
  description:
    "The story behind Vinyasa Earth — an art-residential space in Amer, Jaipur, founded by dancer Sankalp Sharma as a safe, non-judgemental home for artists to live, create, and belong.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES: Array<{ icon: IconName; title: string; body: string }> = [
  { icon: "home-outline", title: "Safe space", body: "Where you can create." },
  { icon: "sparkles-outline", title: "Non-judgemental", body: "Where you can express." },
  { icon: "leaf-outline", title: "Eco-conscious", body: "Where you can co-live with nature." },
  { icon: "people-outline", title: "Community living", body: "Where you collaborate." },
];

const FAMILY = [
  { name: "Sankalp Sharma", role: "Founder · dancer", photo: "/seed/family/sankalp.jpg" },
  { name: "Ankita Sharma", role: "Resident", photo: "/seed/family/ankita.jpg" },
  { name: "Abhishek Gore", role: "Resident", photo: "/seed/family/abhishek.jpg" },
  { name: "Coco", role: "Resident animal", photo: "/seed/family/coco.jpg" },
  { name: "Mojo", role: "Resident animal", photo: "/seed/family/mojo.jpg" },
  { name: "Diwan", role: "Resident", photo: "/seed/family/diwan.jpg" },
];

export default async function AboutPage() {
  const [hero, story, craft] = (await Promise.all([
    getContent<Copy>("about.hero"),
    getContent<Copy>("about.story"),
    getContent<Copy>("about.craft"),
  ])) as [Copy | null, Copy | null, Copy | null];

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow ?? "Our story"}
        title={hero?.title ?? "Start your journey inwards"}
        description={
          hero?.description ??
          "Vinyasa Earth is an art-residential space in Jaipur, Rajasthan — a safe and non-judgemental abode for everyone to free their inner defences and explore themselves."
        }
        image={heroImg}
      />

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left">
            <div className="relative aspect-[4/5] overflow-hidden border border-line">
              <Image
                src={storyImg}
                alt="Community gathering at Vinyasa Earth"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal variant="right" delay={100}>
            <SectionEyebrow icon="compass-outline">How it began</SectionEyebrow>
            <h2 className="mt-3 font-display italic text-4xl leading-tight">
              {story?.heading ?? "An artist village, imagined in lockdown"}
            </h2>
            {(paras(story?.body).length
              ? paras(story?.body)
              : [
                  "Sankalp Sharma, a professional dancer, was abroad on a dance scholarship when the 2020 pandemic was announced and sent him back to India. Out of that pause came Vinyasa Earth: a village built around the practical realities artists face — long commutes, cramped rooms, nowhere to perform, and the basic question of the next meal.",
                  "The idea was simple. Give artists quality sleep, nutritious food, and real support, and the creative work takes care of itself.",
                ]
            ).map((p, i) => (
              <p key={i} className={`${i === 0 ? "mt-4" : "mt-3"} leading-relaxed text-foreground-soft`}>
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="organic-section bg-clay-surface py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal variant="fade" className="mx-auto max-w-2xl text-center">
            <SectionEyebrow icon="leaf-outline" className="justify-center">
              What we stand on
            </SectionEyebrow>
            <h2 className="mt-3 font-display italic text-4xl leading-tight">Four principles</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
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
          <Image src={bandImg} alt="" fill sizes="100vw" className="object-cover" />
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
          <p className="font-display text-[1.9rem] leading-snug text-[#fbf3e8] sm:text-[2.6rem]">
            &ldquo;Everything at Vinyasa carries the goodness of mother earth — a blend of humanity
            and nature, held with gratitude.&rdquo;
          </p>
          <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f0d9be]/80">
            The Vinyasa Earth community
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left">
            <SectionEyebrow icon="home-outline">Built from the ground</SectionEyebrow>
            <h2 className="mt-3 font-display italic text-4xl leading-tight">
              {craft?.heading ?? "Rajasthan's own way of building"}
            </h2>
            {(paras(craft?.body).length
              ? paras(craft?.body)
              : [
                  "Mud plaster and jaali screens instead of concrete. Kitchen-garden meals instead of a restaurant menu. Block-print textiles and hand-painted mandalas on the cottage walls. It is a working example of the sustainable, earth-first living the community here practises every day.",
                  "Everything at Vinyasa carries the goodness of mother earth — a blend of humanity and nature, held with gratitude.",
                ]
            ).map((p, i) => (
              <p key={i} className={`${i === 0 ? "mt-4" : "mt-3"} leading-relaxed text-foreground-soft`}>
                {p}
              </p>
            ))}
          </Reveal>
          <Reveal variant="right" delay={100}>
            <Parallax speed={0.05}>
              <div className="relative aspect-[4/5] overflow-hidden border border-line">
                <Image
                  src={craftImg}
                  alt="Earthen architecture at Vinyasa Earth"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Parallax>
          </Reveal>
        </div>
      </section>

      <section className="organic-section bg-dusk-surface py-20">
        <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
          <Reveal variant="fade">
            <SectionEyebrow icon="people-outline" className="justify-center">
              The family
            </SectionEyebrow>
            <h2 className="mt-3 font-display italic text-4xl leading-tight">
              Vinyasa is not just a space, it is <span className="not-italic">HOME</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-foreground-soft">
              A collaborative journey with family members across the globe. Volunteering is the way
              in — and, for many, the path to full-time residency.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FAMILY.map((m, i) => (
              <Reveal key={m.name} variant="up" delay={(i % 3) * 80}>
                <div className="flex flex-col items-center border border-line bg-surface px-5 py-8 text-center">
                  <div className="relative h-28 w-28 overflow-hidden rounded-full border border-line">
                    <Image
                      src={m.photo}
                      alt={m.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-4 font-display italic text-xl leading-tight">{m.name}</p>
                  <p className="mt-1.5 text-xs uppercase tracking-[0.14em] text-muted">{m.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal variant="up" delay={200} className="mt-12">
            <Link href="/corporate" className="btn btn-accent inline-flex">
              Volunteer with us
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
