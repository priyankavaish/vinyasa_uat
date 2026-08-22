import Image from "next/image";
import vine1 from "@/app/assets/vine1.png";
import vine2 from "@/app/assets/vine2.png";
import vine3 from "@/app/assets/vine3.png";
import vine4 from "@/app/assets/vine4.png";
import Link from "next/link";
import SectionEyebrow from "./section-eyebrow";
import { Reveal } from "./reveal";
import { Icon } from "./icon";
import { Parallax } from "./parallax";

// Each tile previews the page it links to, so it borrows that page's own
// hero/identity photo rather than a fresh one — never a photo shown nowhere
// else on the site, just the same "cover shot" doing double duty as a preview.
const WAYS = [
  {
    number: "01",
    title: "Events",
    href: "/events",
    image: "/images/property-night-gathering.jpg",
    blurb: "Residencies, retreats, and workshops for makers.",
    accent: "#c9713f",
    span: "sm:col-span-4 sm:row-span-2",
  },
  {
    number: "02",
    title: "Corporate Offsites",
    href: "/corporate",
    image: "/images/property-lawn-gazebo.jpg",
    blurb: "Team retreats grounded in the desert, not a boardroom.",
    accent: "#7c8f5a",
    span: "sm:col-span-2 sm:row-span-1",
  },
  {
    number: "03",
    title: "Artist Escapes",
    href: "/events/artist-escape",
    image: "/images/hero-desert-dusk.jpg",
    blurb: "Weeks to build, paint, or write alongside a resident community.",
    accent: "#d99a2b",
    span: "sm:col-span-2 sm:row-span-1",
  },
  {
    number: "04",
    title: "Stays",
    href: "/stays",
    image: "/images/property-cottages-day.jpg",
    blurb: "Six hand-built mud cottages to return to.",
    accent: "#b5643b",
    span: "sm:col-span-3 sm:row-span-1",
  },
  {
    number: "05",
    title: "Founder's Place",
    href: "/about",
    image: "/images/amer-fort-lake.jpg",
    blurb: "Stay among founders, trade ideas by the fire, and perhaps meet your next CTO or collaborator.",
    accent: "#6b7a9e",
    span: "sm:col-span-3 sm:row-span-1",
  },
] as const;

const REVEAL_VARIANTS = ["scale", "up", "fade", "left", "right"] as const;

export default function ConnectSection() {
  return (
    <section className="organic-section organic-connect relative overflow-hidden bg-background py-24 text-foreground">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Parallax speed={-0.04} className="absolute -right-20 -top-24 w-[18rem] sm:-right-16 sm:w-[25rem] lg:w-[30rem]">
          <Image src={vine1} alt="" className="w-full opacity-30" />
        </Parallax>
        <Image
          src={vine2}
          alt=""
          className="absolute -left-24 top-[18%] hidden w-[24rem] -rotate-6 opacity-20 md:block lg:w-[30rem]"
        />
        <Image
          src={vine3}
          alt=""
          className="absolute -right-28 top-[42%] hidden w-[27rem] rotate-3 opacity-20 md:block lg:w-[34rem]"
        />
        <Parallax speed={0.035} className="absolute -bottom-28 -left-24 w-[20rem] sm:w-[27rem] lg:w-[33rem]">
          <Image src={vine4} alt="" className="w-full opacity-25" />
        </Parallax>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal variant="fade" className="mb-12 max-w-2xl">
          <SectionEyebrow tone="secondary" icon="compass-outline">Self-discovery</SectionEyebrow>
          <h2 className="mt-3 font-display italic text-5xl leading-[1.02] sm:text-6xl">
            A place to arrive. People to build with.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-foreground-soft">
            Stay among artists, founders, and curious minds. Make something, exchange ideas,
            or meet the person who changes what you build next.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6 sm:auto-rows-[190px]">
          {WAYS.map((way, i) => (
            <Reveal
              key={way.href}
              variant={REVEAL_VARIANTS[i % REVEAL_VARIANTS.length]}
              delay={i * 90}
              className={way.span}
            >
              <Link
                href={way.href}
                className={`connect-tile connect-tile-${i + 1} group relative block h-full min-h-[220px] overflow-hidden border border-line`}
              >
                <Image
                  src={way.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 40vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 transition-opacity duration-500 group-hover:from-black/90" />
                <span
                  className="absolute right-4 top-4 font-display text-4xl italic opacity-40 transition-opacity duration-500 group-hover:opacity-80 sm:text-5xl"
                  style={{ color: way.accent }}
                  aria-hidden
                >
                  {way.number}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <span
                    className="mb-2 inline-block h-1 w-8 rounded-full transition-all duration-500 group-hover:w-14"
                    style={{ backgroundColor: way.accent }}
                    aria-hidden
                  />
                  <h3 className="font-display italic text-2xl leading-tight text-background drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-3xl">
                    {way.title}
                  </h3>
                  <p className="mt-1.5 max-w-[32ch] text-sm text-background/80">{way.blurb}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-background/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Explore
                    <Icon name="arrow-forward-outline" size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
