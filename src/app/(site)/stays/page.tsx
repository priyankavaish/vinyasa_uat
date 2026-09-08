import Image from "next/image";
import Link from "next/link";
import SectionEyebrow from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Parallax } from "@/components/ui/parallax";
import { Icon, type IconName } from "@/components/ui/icon";

import { PageHero } from "@/components/sections/hero";
import galleryA from "@/app/assets/new/grounds-01.jpg";
import galleryB from "@/app/assets/new/community-03.jpg";
import galleryC from "@/app/assets/new/room-prithvi-2.jpg";
import galleryD from "@/app/assets/new/grounds-04.jpg";
import vine3 from "@/app/assets/vine3.png";
import vine4 from "@/app/assets/vine4.png";
import expA from "@/app/assets/new/community-06.jpg";
import expB from "@/app/assets/new/grounds-07.jpg";
import expC from "@/app/assets/new/community-05.jpg";
import expD from "@/app/assets/new/grounds-08.jpg";
import expE from "@/app/assets/new/community-07.jpg";
import expF from "@/app/assets/new/grounds-09.jpg";

import { getCottages, getVisitOptions, getPartners } from "@/lib/cms";

export const revalidate = 300;

export const metadata = {
  title: "Stays at Vinyasa Earth in Jaipur",
  description:
    "Hand-built rooms named for the elements — Agni, Jal, Chandrama, Prithvi, Vayu, Shunya, and a shared dorm — at Vinyasa Earth in Jaipur.",
  alternates: { canonical: "/stays" },
};

const EXPERIENCE_PHOTOS = [expA, expB, expC, expD, expE, expF];

export default async function StaysPage() {
  const [rooms, visitOptions, partners] = await Promise.all([
    getCottages(),
    getVisitOptions(),
    getPartners(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Cottages &middot; Dorm &middot; Tents"
        title="Hand-built earth stays in Jaipur"
        description="Disconnect from the noise, reconnect with what matters &mdash; mud-plastered rooms rooted in nature and crafted for rest."
        image="/images/Vinyasa data (Space)/IMG_9259.jpg"
        imageAlt="A handcrafted earth room with a canopy bed at Vinyasa Earth"
        imagePosition="50% 55%"
        mobileImagePosition="60% 50%"
      >
        <Link href="/book" className="btn btn-accent">Make a reservation</Link>
        <a href="#rooms" className="btn btn-outline-light">Explore rooms</a>
      </PageHero>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <Reveal variant="fade" className="mx-auto max-w-3xl text-center">
          <p className="leading-relaxed text-foreground-soft">
            We give our guests a unique perspective on the beauty of nature — a chance to disconnect
            from the outside world and immerse in the wonders that surround us. Our cottages are a
            comfortable, relaxing place to unwind after a day exploring the surrounding countryside.
          </p>
        </Reveal>

        <Reveal variant="fade" delay={120}>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[galleryA, galleryB, galleryC, galleryD].map((img, i) => (
              <div
                key={i}
                className={`relative aspect-[3/4] overflow-hidden border border-line ${
                  i % 2 === 1 ? "sm:mt-6" : ""
                }`}
              >
                <Image src={img} alt="" fill sizes="25vw" placeholder="blur" className="object-cover transition-transform duration-500 hover:scale-105" />
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section id="rooms" className="organic-section relative overflow-hidden bg-clay-surface py-14 sm:py-16">
        <Parallax speed={-0.03} className="pointer-events-none absolute -left-16 -top-10 w-[13rem] opacity-[0.15] sm:w-[17rem]" aria-hidden="true">
          <Image src={vine3} alt="" className="w-full -rotate-[100deg]" />
        </Parallax>
        <Parallax speed={0.03} className="pointer-events-none absolute -bottom-16 -right-16 w-[13rem] opacity-[0.15] sm:w-[17rem]" aria-hidden="true">
          <Image src={vine4} alt="" className="w-full rotate-[165deg]" />
        </Parallax>

        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal variant="fade" className="mx-auto max-w-2xl text-center">
            <SectionEyebrow icon="home-outline">Choose a stay experience</SectionEyebrow>
            <h2 className="mt-2 font-display italic text-3xl leading-tight sm:text-4xl">
              Rooms named for the elements
            </h2>
            <p className="mt-3 text-sm text-foreground-soft leading-relaxed">
              Every room at Vinyasa is hand-plastered and one of a kind. Pick the element that suits
              your stay, or book the dorm and meet everyone at once.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {rooms.map((room, i) => (
              <Reveal
                key={room.slug}
                variant="up"
                delay={(i % 3) * 90}
                className={i % 3 === 1 ? "lg:mt-12" : ""}
              >
                <Link
                  href={`/stays/${room.slug}`}
                  className="group flex h-full flex-col overflow-hidden border border-line bg-surface shadow-[0_10px_30px_rgba(45,35,25,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(45,35,25,0.16)]"
                >
                  <div className="relative aspect-[4/3] shrink-0 overflow-hidden">
                    <Image
                      src={room.image}
                      alt={`${room.name} at Vinyasa Earth`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                    <span
                      className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.18em] text-white shadow-[0_2px_12px_rgba(0,0,0,0.35)] backdrop-blur-sm"
                      style={{ backgroundColor: `${room.accent}e6` }}
                    >
                      <Icon name={room.icon as IconName} size={13} />
                      {room.element}
                    </span>
                    <h3 className="absolute bottom-3 left-4 right-4 font-display italic text-3xl leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
                      {room.name}
                    </h3>
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="flex-1 text-sm leading-relaxed text-foreground-soft">
                      {room.description}
                    </p>
                    <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
                      <span className="text-sm">
                        <span className="block text-[12px] font-bold uppercase tracking-[0.14em] text-muted">
                          From
                        </span>
                        <span className="font-display text-2xl text-foreground">
                          ₹{room.pricePerNight.toLocaleString("en-IN")}
                        </span>
                        <span className="ml-1 text-xs text-foreground-soft">/ night</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-accent">
                        View
                        <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <Reveal variant="fade" className="mx-auto max-w-2xl text-center">
          <SectionEyebrow icon="sparkles-outline">Experiences</SectionEyebrow>
          <h2 className="mt-3 font-display italic text-4xl leading-tight">Days built around making things</h2>
          <p className="mt-4 text-foreground-soft leading-relaxed">
            Vinyasa is a space for self-engaging activities — nature walks, hikes, and one-on-one
            sessions with an artist in residence — woven into our daily life. Experiences are
            seasonal; write to{" "}
            <a href="mailto:vinyasa.ashram@gmail.com" className="text-accent underline">
              vinyasa.ashram@gmail.com
            </a>{" "}
            to enquire.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {EXPERIENCE_PHOTOS.map((img, i) => (
            <Reveal key={i} variant="clip" delay={(i % 3) * 80} className={i % 3 === 1 ? "sm:mt-8" : ""}>
              <Parallax speed={i % 2 === 0 ? 0.05 : -0.05}>
                <div className="relative aspect-square overflow-hidden border border-line">
                  <Image src={img} alt="" fill sizes="33vw" className="object-cover transition-transform duration-500 hover:scale-105" />
                </div>
              </Parallax>
            </Reveal>
          ))}
        </div>
      </section>

      {visitOptions.length > 0 && (
        <section className="organic-section relative overflow-hidden bg-dusk-surface py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal variant="fade" className="mx-auto max-w-2xl text-center">
              <SectionEyebrow icon="calendar-outline">More ways to visit</SectionEyebrow>
              <h2 className="mt-3 font-display italic text-4xl leading-tight">
                You don&apos;t have to stay the night
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {visitOptions.map((option, i) => (
                <Reveal key={option.title} variant="up" delay={i * 90}>
                  <div className="group flex gap-4 border border-line bg-surface p-4 transition-shadow hover:shadow-lg sm:p-5">
                    {option.image && (
                      <div className="relative h-28 w-28 shrink-0 overflow-hidden sm:h-32 sm:w-32">
                        <Image src={option.image} alt="" fill sizes="150px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-display italic text-xl leading-tight">{option.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-foreground-soft">{option.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {partners.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <Reveal variant="fade" className="text-center">
            <SectionEyebrow>Accessory partners</SectionEyebrow>
            <h2 className="mt-3 font-display italic text-3xl leading-tight">
              Brands that align with how we build
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {partners.map((partner, i) => (
              <Reveal key={partner.name} variant="up" delay={i * 90}>
                <div className="flex h-full flex-col items-center justify-between gap-4 border border-line bg-surface px-6 py-8 text-center">
                  {partner.logo && (
                    <div className="relative h-14 w-full">
                      <Image src={partner.logo} alt={partner.name} fill className="object-contain" />
                    </div>
                  )}
                  <p className="text-sm text-foreground-soft">{partner.description}</p>
                  <Link href={partner.link} className="text-xs font-semibold uppercase tracking-[0.14em] text-accent underline">
                    Enquire
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
