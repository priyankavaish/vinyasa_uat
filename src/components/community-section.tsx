import Image from "next/image";
import chulha from "@/app/assets/chulha.png";
import communityGathering from "@/app/assets/community-gathering.png";
import Link from "next/link";
import SectionEyebrow from "./section-eyebrow";
import { Reveal } from "./reveal";
import { Parallax, ParallaxHeroImage } from "./parallax";

export default function CommunitySection() {
  return (
    <section className="relative overflow-hidden bg-secondary-surface py-20">
      <Parallax speed={0.045} className="pointer-events-none absolute -bottom-24 -right-24 w-[20rem] sm:w-[28rem] lg:w-[34rem]">
        <Image src={chulha} alt="" className="w-full opacity-10" aria-hidden="true" />
      </Parallax>
      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-5 sm:grid-cols-[1fr_1.2fr] sm:px-8">
        <Reveal variant="clip" className="relative min-h-[380px] overflow-hidden border border-line">
          <ParallaxHeroImage>
            <Image
              src={communityGathering}
              alt="Travellers from around the world gathered together at Vinyasa Earth"
              fill
              sizes="(min-width: 640px) 45vw, 100vw"
              className="object-cover"
            />
          </ParallaxHeroImage>
        </Reveal>
        <Reveal variant="up" delay={40} className="flex flex-col justify-center">
          <SectionEyebrow tone="secondary" icon="people-outline">One community, one table</SectionEyebrow>
          <h2 className="mt-3 max-w-[22ch] font-display text-4xl leading-tight">
            Volunteers, artists, and strangers, cooking, eating, and living as one
          </h2>
          <p className="mt-5 max-w-[54ch] leading-relaxed text-foreground">
            Vinyasa Earth runs on shared work as much as shared meals: residents and visiting
            volunteers cook together in the communal kitchen, tend the garden, and show up for
            each other's projects. People arrive from across the world as strangers and leave
            part of the community; it's the thread through every program here, from a single
            workshop to a month-long residency.
          </p>
          <p className="mt-3 max-w-[54ch] text-sm">
            Skill-exchange and volunteer stays are part of how the community runs (placeholder:
            exact terms to confirm with the client before this goes live).
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link href="/events/artist-escape" className="btn btn-secondary">
              Join the Artist Escape Program
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Ask About Volunteering
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
