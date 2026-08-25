import Image from "next/image";
import Link from "next/link";
import SectionEyebrow from "@/components/section-eyebrow";
import { Reveal } from "@/components/reveal";
import { Parallax, ParallaxHeroImage } from "@/components/parallax";
import { Icon, type IconName } from "@/components/icon";
import { whatsappLink } from "@/lib/site";

import vine3 from "@/app/assets/vine3.png";
import vine4 from "@/app/assets/vine4.png";

import heroAerial from "@/app/assets/banner_bg_sunset.png";
import heroCardCottage from "@/app/assets/03_cottage_flowers.jpg";
import heroCardFountain from "@/app/assets/04_pavilion_seating.jpg";
import heroCardDome from "@/app/assets/05_night_pavilion.jpg";
import nightGazebos from "@/app/assets/stays/WhatsApp-Image-2023-09-30-at-9.31.50-PM-1-768x1024.jpeg";
import amphitheatre from "@/app/assets/stays/vinyasa-ampitheatre-1024x768.jpg";
import studioDome from "@/app/assets/stays/mohitXvinyasa-1-of-5-1-scaled.jpg";
import eveningLounge from "@/app/assets/stays/IMG_7534-768x1024.jpg";

import roomAgni from "@/app/assets/stays/IMG_8624-scaled.jpg";
import roomJal from "@/app/assets/stays/IMG_9254-1-scaled.jpg";
import roomChandrama from "@/app/assets/stays/chandrama-2.jpeg";
import roomPrithvi from "@/app/assets/stays/IMG_2962-scaled.jpg";
import roomVayu from "@/app/assets/stays/vayu1-1.jpeg";
import roomShunya from "@/app/assets/stays/2N0A9816-Enhanced-NR-2-2.jpg";
import roomDorm from "@/app/assets/stays/IMG_0204-scaled.jpg";

import expGuitar from "@/app/assets/stays/Arthur-1024x683.jpeg";
import expWorkshop from "@/app/assets/stays/IMG_3151photo-576x1024.jpg";
import expPool from "@/app/assets/stays/BM9A8765-1024x682.jpg";
import expTree from "@/app/assets/stays/IMG_9730-768x1024.jpg";
import expMudWalk from "@/app/assets/stays/image0-1-1024x768.jpg";
import expDrumCircle from "@/app/assets/stays/IMG_8428-768x1024.jpg";

import visitBrandShoot from "@/app/assets/stays/IMG_3323.jpg";
import visitGathering from "@/app/assets/stays/IMG_1545-scaled.jpg";

import logoTexaura from "@/app/assets/stays/IMG_1554-600x112.png";
import logoCarpetLive from "@/app/assets/stays/carpetlive-trimmed.png";
import logoDheerRugs from "@/app/assets/stays/DHEER-LOGO.png";

export const metadata = {
  title: "Stays at Vinyasa Earth in Jaipur",
  description: "Seven hand-built rooms named for the elements — Agni, Jal, Chandrama, Prithvi, Vayu, Shunya, and a shared dorm — at Vinyasa Earth in Amer, Jaipur.",
  alternates: { canonical: "/stays" },
};

type Room = {
  name: string;
  element: string;
  image: typeof roomAgni;
  description: string;
  icon: IconName;
  accent: string;
};

const ROOMS: Room[] = [
  {
    name: "Agni",
    element: "Fire",
    image: roomAgni,
    description: "A sunset-red room with its own open-air wash pit, carved straight into the earthen wall.",
    icon: "flame-outline",
    accent: "#b5643b",
  },
  {
    name: "Jal",
    element: "Water",
    image: roomJal,
    description: "A cobalt skylight over the bed pulls the colour of the sky straight into the room.",
    icon: "water-outline",
    accent: "#6b7a9e",
  },
  {
    name: "Chandrama",
    element: "Moon",
    image: roomChandrama,
    description: "A trail of moon phases circles the wall of this round, quiet mud room.",
    icon: "moon-outline",
    accent: "#3f3f5c",
  },
  {
    name: "Prithvi",
    element: "Earth",
    image: roomPrithvi,
    description: "A cave-like nook pressed by hand from raw earth, with a built-in chulha seat by the window.",
    icon: "leaf-outline",
    accent: "#66783f",
  },
  {
    name: "Vayu",
    element: "Air",
    image: roomVayu,
    description: "Wide shutters and high thatch keep this room catching every breeze that passes.",
    icon: "wind-outline",
    accent: "#7c8f5a",
  },
  {
    name: "Shunya",
    element: "Stillness",
    image: roomShunya,
    description: "Nothing but a bed, a net, and a window — built for doing absolutely nothing.",
    icon: "circle-outline",
    accent: "#a49a86",
  },
  {
    name: "Dorm",
    element: "Shared",
    image: roomDorm,
    description: "Bunk beds under one shared thatched roof, for travelling light and meeting everyone.",
    icon: "people-outline",
    accent: "#6b7a5e",
  },
];

const EXPERIENCE_PHOTOS = [expGuitar, expWorkshop, expPool, expTree, expMudWalk, expDrumCircle];

const VISIT_OPTIONS = [
  {
    title: "Brand Video & Photoshoot",
    image: visitBrandShoot,
    description: "Want a photoshoot at Vinyasa for a few hours or a day? Let's discuss the idea.",
  },
  {
    title: "Day Pass",
    image: eveningLounge,
    description: "Want to know more about Vinyasa Earth? Get a tour, have meals with the team, and live our slow day.",
  },
  {
    title: "Studio Pass",
    image: studioDome,
    description: "Perfect for artists seeking a studio in a setting close to nature — no walls, open to the horizon.",
  },
  {
    title: "Gatherings & Residency",
    image: visitGathering,
    description: "Want to organise a mindful gathering or a residency? We'd love to host you.",
  },
];

const PARTNERS = [
  { name: "Texaura", logo: logoTexaura, description: "Modern bed, bath, and living brand" },
  { name: "CarpetLive", logo: logoCarpetLive, description: "Crafted. Curated. Enduring." },
  { name: "Dheer Rugs", logo: logoDheerRugs, description: "Rugs & carpets" },
];

export default function StaysPage() {
  return (
    <>
      <section className="relative min-h-[650px] overflow-hidden bg-[#1c160f] text-background lg:min-h-[720px]">
        <div className="absolute inset-0">
          <ParallaxHeroImage>
            <Image src={heroAerial} alt="" fill priority sizes="100vw" className="object-cover" />
          </ParallaxHeroImage>
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(15,10,5,.88) 0%, rgba(15,10,5,.6) 32%, rgba(15,10,5,.28) 58%, rgba(15,10,5,.12) 100%), linear-gradient(180deg, rgba(10,7,4,.4) 0%, rgba(10,7,4,0) 22%, rgba(10,7,4,0) 68%, rgba(10,7,4,.5) 100%)",
          }}
        />

        {/* fade into the section below */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#1c160f]/40" />

        <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-12 px-5 pb-16 pt-32 sm:px-8 sm:pt-40 lg:grid-cols-[48%_52%] lg:pb-20">
          <Parallax speed={-0.03}>
            <Reveal variant="up">
              <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-background/75">
                <span className="h-px w-8 bg-accent" aria-hidden />
                Twin-sharing cottages, dorm &amp; tents
              </p>
            </Reveal>
            <Reveal variant="up" delay={90}>
              <h1
                className="text-balance font-display italic leading-[1.02] text-[#f7efe4]"
                style={{ maxWidth: "540px", fontSize: "clamp(2.625rem, 2.09rem + 2.68vw, 4.5rem)" }}
              >
                Stays at Vinyasa Earth in Jaipur
              </h1>
            </Reveal>
            <Reveal variant="up" delay={180}>
              <p className="mt-6 leading-relaxed text-background/80" style={{ maxWidth: "460px" }}>
                Disconnect from the noise, reconnect with what matters — hand built earth spaces,
                rooted in nature and crafted for rest.
              </p>
            </Reveal>
            <Reveal variant="up" delay={270}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center bg-accent text-accent-ink font-semibold uppercase tracking-[0.08em] text-xs transition-all hover:-translate-y-0.5 hover:brightness-110"
                  style={{ width: "190px", height: "52px" }}
                >
                  Make a reservation
                </Link>
                <a
                  href="#rooms"
                  className="inline-flex items-center justify-center border border-background/60 bg-transparent font-semibold uppercase tracking-[0.08em] text-xs text-background transition-all hover:-translate-y-0.5 hover:border-background"
                  style={{ width: "190px", height: "52px" }}
                >
                  Explore stays
                </a>
              </div>
            </Reveal>
          </Parallax>

          <div className="relative" style={{ height: "clamp(260px, 46vw, 420px)" }}>
            <Reveal variant="scale" delay={80} className="absolute right-[10%] top-[6%] z-20">
              <Parallax speed={0.1}>
                <div
                  className="relative overflow-hidden rounded-[11px] border border-white/35"
                  style={{
                    width: "clamp(150px, 32vw, 260px)",
                    height: "clamp(100px, 21.5vw, 175px)",
                    boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
                  }}
                >
                  <Image src={heroCardFountain} alt="" fill sizes="(min-width: 1024px) 260px, 32vw" className="object-cover" />
                </div>
              </Parallax>
            </Reveal>

            <Reveal variant="scale" delay={0} className="absolute left-[6%] top-[26%] z-10">
              <Parallax speed={-0.07}>
                <div
                  className="relative overflow-hidden rounded-[11px] border border-white/35"
                  style={{
                    width: "clamp(190px, 40vw, 330px)",
                    height: "clamp(120px, 25.5vw, 210px)",
                    boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
                  }}
                >
                  <Image
                    src={heroCardCottage}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 330px, 40vw"
                    className="object-cover"
                    style={{ objectPosition: "60% 35%" }}
                  />
                </div>
              </Parallax>
            </Reveal>

            <Reveal variant="scale" delay={160} className="absolute bottom-[4%] right-[4%] z-0">
              <Parallax speed={0.14}>
                <div
                  className="relative overflow-hidden rounded-[11px] border border-white/35"
                  style={{
                    width: "clamp(130px, 27vw, 220px)",
                    height: "clamp(86px, 17.5vw, 145px)",
                    boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
                  }}
                >
                  <Image src={heroCardDome} alt="" fill sizes="(min-width: 1024px) 220px, 27vw" className="object-cover" />
                </div>
              </Parallax>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <Reveal variant="fade" className="mx-auto max-w-3xl text-center">
          <p className="leading-relaxed text-foreground-soft">
            We provide our guests with a unique perspective on the beauty of nature — a chance to
            disconnect from the outside world and immerse in the natural wonders that surround us.
            Our cottages offer a comfortable, relaxing atmosphere: the perfect place to unwind after
            a day exploring the outdoor scenery around Amer.
          </p>
          {/* <Link href="/book" className="btn btn-accent mt-6 inline-flex">
            Make a reservation
          </Link> */}
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[nightGazebos, amphitheatre, studioDome, eveningLounge].map((img, i) => (
            <Reveal key={i} variant="clip" delay={i * 80} className={i % 2 === 1 ? "sm:mt-6" : ""}>
              <div className="relative aspect-[3/4] overflow-hidden border border-line">
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  placeholder="blur"
                  priority
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </Reveal>
          ))}
        </div>
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
              Seven rooms, each named for an element
            </h2>
            <p className="mt-3 text-sm text-foreground-soft leading-relaxed">
              Every room at Vinyasa is hand-plastered and one of a kind. Pick the element that
              suits your stay, or book the dorm and meet everyone at once.
            </p>
          </Reveal>

          <div className="mt-9 grid gap-5 grid-cols-2 lg:grid-cols-4">
            {ROOMS.map((room, i) => (
              <Reveal key={room.name} variant="up" delay={(i % 4) * 80} className={i % 2 === 1 ? "sm:mt-8" : ""}>
                <Link
                  href="/book"
                  className="group flex flex-col overflow-hidden border border-line bg-surface transition-all hover:shadow-xl"
                >
                  <div className="relative h-36 shrink-0 overflow-hidden sm:h-44">
                    <Image
                      src={room.image}
                      alt={`${room.name} room at Vinyasa Earth`}
                      fill
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 45vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
                    <span
                      className="absolute right-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-full border border-white/40 shadow-[0_2px_10px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-transform duration-300 group-hover:rotate-12"
                      style={{ backgroundColor: `${room.accent}e6`, color: "#fff8ee" }}
                      aria-hidden="true"
                    >
                      <Icon name={room.icon} size={16} />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.18em]" style={{ color: room.accent }}>
                          {room.element}
                        </span>
                        <h3 className="mt-0.5 font-display italic text-2xl leading-tight text-foreground">{room.name}</h3>
                      </div>
                      <span className="shrink-0 text-lg text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden>
                        ↗
                      </span>
                    </div>
                    <p className="mt-1.5 text-[13px] font-medium leading-snug text-foreground">{room.description}</p>
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
            Vinyasa is a space for self-engaging activities like nature walks and hikes, woven into
            our daily lives. We rarely run fixed workshops and sessions — you can also schedule a
            one-on-one session with an artist in residence, so there are no promises, only
            something different every time.
          </p>
          <p className="mt-3 text-sm text-foreground-soft">
            Experiences are seasonal — write to{" "}
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
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </Parallax>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="organic-section relative overflow-hidden bg-dusk-surface py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal variant="fade" className="mx-auto max-w-2xl text-center">
            <SectionEyebrow icon="calendar-outline">More ways to visit</SectionEyebrow>
            <h2 className="mt-3 font-display italic text-4xl leading-tight">
              You don&apos;t have to stay the night
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {VISIT_OPTIONS.map((option, i) => (
              <Reveal key={option.title} variant="up" delay={i * 90}>
                <div className="group flex gap-4 border border-line bg-surface p-4 transition-shadow hover:shadow-lg sm:p-5">
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden sm:h-32 sm:w-32">
                    <Image
                      src={option.image}
                      alt=""
                      fill
                      sizes="150px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
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

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <Reveal variant="fade" className="text-center">
          <SectionEyebrow>Accessory partners</SectionEyebrow>
          <h2 className="mt-3 font-display italic text-3xl leading-tight">
            Brands that align with how we build
          </h2>
          <p className="mt-3 mx-auto max-w-2xl text-foreground-soft leading-relaxed">
            Sustainability is resilience, so we bring you brands that align with it while you have
            your cosy stay in the earthen cottages.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {PARTNERS.map((partner, i) => (
            <Reveal key={partner.name} variant="up" delay={i * 90}>
              <div className="flex h-full flex-col items-center justify-between gap-4 border border-line bg-surface px-6 py-8 text-center">
                <div className="relative h-14 w-full">
                  <Image src={partner.logo} alt={partner.name} fill className="object-contain" />
                </div>
                <p className="text-sm text-foreground-soft">{partner.description}</p>
                <Link href="/contact" className="text-xs font-semibold uppercase tracking-[0.14em] text-accent underline">
                  Enquire
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
