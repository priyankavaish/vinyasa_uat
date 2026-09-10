import Image from "next/image";
import eventsTileImage from "@/app/assets/events-tile-community.png";
import corporateTileImage from "@/app/assets/IMG_2429.jpeg";
import artistTileImage from "@/app/assets/2N0A9983.JPG";
import Link from "next/link";
import SectionEyebrow from "../ui/section-eyebrow";
import { Reveal } from "../ui/reveal";
import { Icon } from "../ui/icon";

// Each block previews the page it links to, so it borrows that page's own
// hero/identity photo rather than a fresh one — never a photo shown nowhere
// else on the site, just the same "cover shot" doing double duty as a preview.
const WAYS = [
  {
    number: "01",
    title: "Events",
    href: "/events",
    image: eventsTileImage,
    blurb:
      "Residencies, retreats, and workshops for makers — a rotating calendar of ways to spend a week or a month here, alongside people building something of their own.",
  },
  {
    number: "02",
    title: "Corporate Offsites",
    href: "/corporate",
    image: corporateTileImage,
    blurb:
      "Team retreats grounded in the desert, not a boardroom. Slow mornings, shared meals, and conversations that don't happen back at the office.",
  },
  {
    number: "03",
    title: "Artist Escapes",
    href: "/stays#artist-escape",
    image: artistTileImage,
    blurb:
      "Weeks to build, paint, or write alongside a resident community — an affordable stay-with-meals program for creative practitioners.",
  },
] as const;

export default function ConnectSection() {
  return (
    <section className="relative overflow-hidden pt-14 text-foreground sm:pt-20">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal variant="up">
          <SectionEyebrow tone="secondary" icon="compass-outline" className="justify-center">
            Self-discovery
          </SectionEyebrow>
          <h2 className="mt-4 font-display text-4xl leading-[1.08] sm:text-5xl">
            A place to arrive. People to build with.
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-lg leading-relaxed text-foreground">
            Stay among artists, founders, and curious minds. Make something, exchange ideas,
            or meet the person who changes what you build next.
          </p>
        </Reveal>
      </div>

      <div className="mt-10 sm:mt-14">
        {WAYS.map((way, i) => (
          <div key={way.href} className="mx-auto max-w-[100rem]">
            <div
              className={`grid items-center gap-2 md:grid-cols-2 md:gap-6 lg:gap-10 ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <Reveal
                variant="up"
                className={`w-full p-5 sm:p-10 md:p-12 lg:p-16 ${
                  i % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden border border-line shadow-[0_20px_50px_-28px_rgba(45,35,25,0.35)] sm:aspect-[16/10] md:aspect-[4/3]">
                  <Image
                    src={way.image}
                    alt=""
                    fill
                    quality={90}
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>

              <Reveal
                variant="up"
                delay={200}
                className={`px-6 py-14 sm:px-12 sm:py-16 md:px-16 lg:px-20 ${
                  i % 2 === 1 ? "md:order-1" : ""
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                  {way.number}
                </span>
                <h3 className="mt-3 max-w-[16ch] font-display text-3xl leading-tight sm:text-4xl">
                  {way.title}
                </h3>
                <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-foreground">
                  {way.blurb}
                </p>
                <Link
                  href={way.href}
                  className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent transition-[gap] duration-300 hover:gap-3.5"
                >
                  Explore
                  <Icon name="arrow-forward-outline" size={13} />
                </Link>
              </Reveal>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
