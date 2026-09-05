import Image from "next/image";
import communityGathering from "@/app/assets/community-gathering-2.jpg";
import Link from "next/link";
import SectionEyebrow from "../ui/section-eyebrow";
import { Reveal } from "../ui/reveal";

export default function CommunitySection() {
  return (
    <section className="relative overflow-hidden">
      <div className="grid items-center gap-0 md:grid-cols-2">
        <Reveal variant="up" delay={200} className="px-6 py-9 sm:px-12 sm:py-12 md:order-2 md:px-16 lg:px-20">
          <SectionEyebrow tone="secondary" icon="people-outline">One community, one table</SectionEyebrow>
          <h2 className="mt-4 max-w-[20ch] font-display text-4xl leading-tight sm:text-5xl">
            Volunteers, artists, and strangers, cooking, eating, and living as one
          </h2>
          <p className="mt-5 max-w-[48ch] leading-relaxed text-foreground">
            Vinyasa Earth runs on shared work as much as shared meals: residents and visiting
            volunteers cook together in the communal kitchen, tend the garden, and show up for
            each other's projects. People arrive from across the world as strangers and leave
            part of the community; it's the thread through every program here, from a single
            workshop to a month-long residency.
          </p>
          <p className="mt-3 max-w-[48ch] text-sm text-foreground-soft">
            Skill-exchange and volunteer stays are part of how the community runs (placeholder:
            exact terms to confirm with the client before this goes live).
          </p>
          <div className="mt-8 flex flex-nowrap gap-2 overflow-x-auto sm:gap-4">
            <Link href="/events#artist-escape" className="btn btn-secondary shrink-0 whitespace-nowrap !px-4 !text-[11px] sm:!px-7 sm:!text-xs">
              Join the Artist Escape Program
            </Link>
            <Link href="/contact" className="btn btn-outline shrink-0 whitespace-nowrap !px-4 !text-[11px] sm:!px-7 sm:!text-xs">
              Ask About Volunteering
            </Link>
          </div>
        </Reveal>
        <Reveal variant="up" delay={0} className="relative aspect-[4/3] w-full sm:aspect-[16/10] md:order-1 md:aspect-square md:min-h-[24rem]">
          <Image
            src={communityGathering}
            alt="Travellers from around the world gathered together at Vinyasa Earth"
            fill
            quality={95}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
