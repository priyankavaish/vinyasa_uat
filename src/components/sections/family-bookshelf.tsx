"use client";
import FormattedText from "@/components/editorial/formatted-text";

import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_sections_family_bookshelf";
import { useEditorial } from "@/components/editorial/provider";

import { useState } from "react";
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
  const [expandedMembers, setExpandedMembers] = useState<string[]>([]);
  const Heading = hero ? "h1" : "h2";

  return (
    <section
      id="family"
      className={`texture-linen relative overflow-hidden ${hero ? "organic-section bg-surface pb-14 pt-28 sm:pb-20 sm:pt-32" : "organic-section bg-surface py-16 sm:py-20"}`}
    >
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal variant="fade" className="mx-auto max-w-2xl text-center">
          <SectionEyebrow icon="people-outline" className="justify-center"><FormattedText value={content.text_1} /></SectionEyebrow>
          <Heading className="mt-3 font-display text-3xl italic leading-[1.15] text-clay-ink sm:text-4xl">
            <FormattedText value={content.text_2} /><FormattedText value={" "} />
            <span className="not-italic text-accent"><FormattedText value={content.text_3} /></span>
          </Heading>
          <p className="mx-auto mt-5 max-w-[52ch] leading-relaxed text-foreground-soft"><FormattedText value={content.text_4} /></p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 divide-y divide-clay-ink/15 md:grid-cols-3 md:divide-x md:divide-y-0 sm:mt-16">
          {members.map((member, i) => (
            <Reveal
              key={member.name}
              variant="up"
              delay={i * 120}
              className="grid min-w-0 grid-cols-1 justify-items-center px-5 py-10 text-center first:pt-0 md:row-span-5 md:grid-rows-subgrid md:px-6 md:py-0 lg:px-8"
            >
              <div className="relative mx-auto h-40 w-40 lg:h-48 lg:w-48">
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
                    sizes="(min-width: 1024px) 192px, 160px"
                    className="object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              <span className="mt-7 self-center text-[11px] font-bold uppercase leading-relaxed tracking-[0.14em] text-accent"><FormattedText value={member.role} /></span>
              <h3 className="mt-2 font-display text-2xl leading-tight text-clay-ink"><FormattedText value={member.name} /></h3>
              <p id={`family-bio-${i}`} className={`mt-4 w-full max-w-[42ch] self-start text-pretty text-left text-sm leading-[1.8] text-foreground-soft ${member.blurb.length > 160 && !expandedMembers.includes(member.name) ? "line-clamp-3" : ""}`}><FormattedText value={member.blurb} /></p>
              <div className="w-full max-w-[42ch] self-start text-left">
                {member.blurb.length > 160 && (
                  <button
                    type="button"
                    aria-expanded={expandedMembers.includes(member.name)}
                    aria-controls={`family-bio-${i}`}
                    aria-label={`${expandedMembers.includes(member.name) ? "Read less" : "Read more"} about ${member.name}`}
                    onClick={() => setExpandedMembers((current) => current.includes(member.name) ? current.filter((name) => name !== member.name) : [...current, member.name])}
                    className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    <FormattedText value={expandedMembers.includes(member.name) ? "Read less" : "Read more"} links={false} />
                  </button>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href={content.href_5} className="btn btn-accent inline-flex"><FormattedText value={content.text_6} links={false} /></Link>
        </div>
      </div>
    </section>
  );
}
