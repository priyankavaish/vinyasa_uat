
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_sections_community_section";
import { getEditorial } from "@/lib/editorial/server";
import Image from "@/components/editorial/image";
import communityGathering from "@/app/assets/community-gathering-2.jpg";
import Link from "next/link";
import SectionEyebrow from "../ui/section-eyebrow";
import { Reveal } from "../ui/reveal";

export default async function CommunitySection() {
  const content = await getEditorial("components/sections/community-section", editorialDefaults);

  return (
    <section className="texture-linen relative overflow-hidden bg-background">
      <div className="grid items-center gap-0 md:grid-cols-2">
        <Reveal variant="up" delay={200} className="order-2 px-5 py-10 sm:px-12 sm:py-12 md:px-16 lg:px-20">
          <SectionEyebrow tone="secondary" icon="people-outline">{content.text_1}</SectionEyebrow>
          <h2 className="mt-4 max-w-[20ch] font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">{content.text_2}</h2>
          <p className="mt-5 max-w-[48ch] leading-relaxed text-foreground">{content.text_3}</p>
          <p className="mt-3 max-w-[48ch] text-sm text-foreground-soft">{content.text_4}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={content.href_5} className="btn btn-secondary inline-flex !px-5 !text-[13px] sm:!px-7 sm:!text-xs">{content.text_6}</Link>
            <Link href={content.href_7} className="btn btn-outline inline-flex !px-5 !text-[13px] sm:!px-7 sm:!text-xs">{content.text_8}</Link>
          </div>
        </Reveal>
        <Reveal variant="up" delay={0} className="relative order-1 md:order-1 md:self-stretch">
          <div aria-hidden className="absolute -bottom-4 -left-4 hidden h-full w-full border border-clay-ink/15 bg-clay-surface md:block" />
          <div aria-hidden className="absolute -bottom-2 -left-2 hidden h-full w-full bg-accent/10 md:block" />
          <div className="group relative aspect-[16/11] w-full overflow-hidden shadow-[0_30px_60px_-28px_rgba(20,15,10,0.35)] sm:aspect-[16/10] md:aspect-auto md:h-full md:min-h-[26rem]">
            <Image
              src={content.communityGathering}
              alt={content.alt_9}
              fill
              quality={80}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
