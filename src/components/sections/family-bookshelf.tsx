"use client";
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_sections_family_bookshelf";
import { useEditorial } from "@/components/editorial/provider";

import Image from "@/components/editorial/image";
import Link from "next/link";
import SectionEyebrow from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";

export type FamilyMember = {
  name: string;
  role: string;
  photo: string;
  position?: string;
  blurb: string;
  since: string;
};

export default function FamilyBookshelf({ members, hero = false }: { members: FamilyMember[]; hero?: boolean }) {
  const content = useEditorial("components/sections/family-bookshelf", editorialDefaults);
  const Heading = hero ? "h1" : "h2";

  return (
    <section
      id="family"
      className={`texture-linen relative overflow-hidden ${hero ? "organic-section bg-surface pb-14 pt-28 sm:pb-20 sm:pt-32" : "organic-section bg-surface py-16 sm:py-20"}`}
    >
      <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal variant="fade" className="mx-auto max-w-2xl text-center">
          <SectionEyebrow icon="people-outline" className="justify-center">{content.text_1}</SectionEyebrow>
          <Heading className="mt-3 font-display text-3xl italic leading-[1.15] text-clay-ink sm:text-4xl">
            {content.text_2}{" "}
            <span className="not-italic text-accent">{content.text_3}</span>
          </Heading>
          <p className="mx-auto mt-5 max-w-[52ch] leading-relaxed text-foreground-soft">{content.text_4}</p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 divide-y divide-clay-ink/12 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {members.map((member, i) => (
            <Reveal
              key={member.name}
              variant="up"
              delay={i * 120}
              className="flex flex-col items-center px-6 py-10 text-center first:pt-0 sm:py-0"
            >
              <div className="relative h-40 w-40 sm:h-48 sm:w-48">
                <span
                  aria-hidden
                  className="absolute -bottom-3 -right-3 h-full w-full border border-clay-ink/15 bg-background"
                  style={{ borderRadius: "38% 62% 63% 37% / 41% 44% 56% 59%", rotate: `${(i - 1) * 9}deg` }}
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-accent shadow-[0_20px_40px_-16px_rgba(143,59,49,0.55)]"
                  style={{ borderRadius: "38% 62% 63% 37% / 41% 44% 56% 59%", rotate: `${(i - 1) * 9}deg` }}
                />
                <div className="group relative h-full w-full p-4">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    sizes="176px"
                    className="object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              <span className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">{member.role}</span>
              <h3 className="mt-1.5 font-display italic text-2xl leading-tight text-clay-ink">{member.name}</h3>
              <p className="mt-3 max-w-[24ch] text-sm leading-relaxed text-foreground-soft">{member.blurb}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href={content.href_5} className="btn btn-accent inline-flex">{content.text_6}</Link>
        </div>
      </div>
    </section>
  );
}
