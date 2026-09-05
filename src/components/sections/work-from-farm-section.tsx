import Image from "next/image";
import Link from "next/link";
import SectionEyebrow from "../ui/section-eyebrow";
import { Reveal } from "../ui/reveal";
import farmImage from "@/app/assets/IMG_4301-scaled.webp";

const details = [
  ["A desk with a horizon", "Settle into quiet corners, open-air studios and shaded common spaces instead of another day between four walls."],
  ["Work, then wander", "Stay connected when you need to, then reset with a farm walk, nourishing food and conversations with the community."],
  ["Stay for your rhythm", "Choose an earth-built cottage or the community dorm and shape the day around your own work."],
];

export default function WorkFromFarmSection() {
  return (
    <section className="overflow-hidden bg-[#e8dfc8] py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
        <Reveal variant="right" className="relative order-2 lg:order-2">
          <div className="relative aspect-[5/6] overflow-hidden">
            <Image src={farmImage} alt="Open green grounds and cottages at Vinyasa Earth" fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
        <Reveal variant="left" delay={100} className="order-1 lg:order-1">
          <SectionEyebrow icon="leaf-outline">Work differently</SectionEyebrow>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">Work From Farm <span className="italic text-accent">at Vinyasa</span></h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground-soft">Work From Farm is for anyone who wants to step away from the usual work-from-home routine without stepping away from work.</p>
          <p className="mt-3 leading-relaxed text-foreground-soft">Bring your laptop and your current project. Find focus among mud cottages, open skies and a living creative community - close enough to Jaipur, yet far from its rush.</p>
          <div className="mt-8 space-y-5">
            {details.map(([title, body], index) => (
              <div key={title} className="grid grid-cols-[2rem_1fr] gap-4 border-t border-foreground/15 pt-5">
                <span className="font-display italic text-xl text-accent">0{index + 1}</span>
                <div><h3 className="font-semibold text-foreground">{title}</h3><p className="mt-1 text-sm leading-6 text-foreground-soft">{body}</p></div>
              </div>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/book" className="btn btn-accent inline-flex">Plan your work stay</Link>
            <Link href="/contact" className="btn btn-outline inline-flex">Ask us anything</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}