
import FormattedText from "@/components/editorial/formatted-text";
import { pageSeoMetadata } from "@/lib/editorial/seo";

import { defaults as editorialDefaults } from "@/lib/editorial/defaults/app__site__stays_page";
import { getEditorial } from "@/lib/editorial/server";
import Image from "@/components/editorial/image";
import SectionEyebrow from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Parallax } from "@/components/ui/parallax";
import StayCollection from "@/components/sections/stay-collection";

import StaysHeroGallery from "@/components/sections/stays-hero-gallery";
import PartnerCards from "@/components/sections/partner-cards";
import texauraLogo from "@/app/assets/stays/IMG_1554-600x112.png";
import carpetLiveLogo from "@/app/assets/stays/carpetlive-trimmed.png";
import dheerLogo from "@/app/assets/stays/DHEER-LOGO.png";
import SectionWave from "@/components/ui/section-wave";
import AnimateInView from "@/components/ui/animate-in-view";
import expA from "@/app/assets/new/community-06.jpg";
import expD from "@/app/assets/new/grounds-08.jpg";
import expE from "@/app/assets/new/community-07.jpg";
import expF from "@/app/assets/new/grounds-09.jpg";

import { getCottages, getVisitOptions } from "@/lib/cms";

const ACCESSORY_PARTNERS = [
  {
    name: "Texaura",
    logo: texauraLogo.src,
    blurb:
      "A modern bed, bath, and living brand from Jaipur, crafting refined collections in certified organic cotton for homes, boutique hotels, and wellness retreats worldwide — quiet, considered, and naturally lived-in.",
    about: [
      "Texaura is a modern bed, bath, and living brand creating thoughtfully crafted collections for homes and hospitality spaces around the world.",
      "Rooted in the belief that the spaces we live in shape the way we feel, rest, and experience everyday life, Texaura brings together refined comfort, timeless design, certified organic cotton, and conscious craftsmanship into one considered expression of modern living.",
      "Founded in Jaipur, India — a city long celebrated for its textile heritage, craftsmanship, and artistic culture — Texaura combines this rich foundation with a contemporary global design language defined by simplicity, balance, warmth, and understated elegance.",
      "Our collections include bedding, blankets, throws, towels, bathrobes, and hospitality linen designed for modern homes, boutique hotels, wellness retreats, luxury villas, and thoughtfully curated spaces. Every product is created with careful attention to softness, breathability, texture, durability, and lasting comfort — allowing each collection to feel elevated, welcoming, and naturally lived in.",
      "At the heart of Texaura is a deep appreciation for material integrity and thoughtful creation. We work with certified organic cotton sourced through responsible farming ecosystems and collaborate with ethically managed manufacturing partners who value skilled craftsmanship, fair wages, safe working environments, and responsible production practices.",
      "We believe exceptional quality is experienced through the complete character of a product — the quality of fibre, the refinement of yarn, the weave, finishing, texture, and the way fabric performs over time. This philosophy guides every Texaura collection.",
      "For hospitality spaces, Texaura partners with properties that value rest, wellbeing, and elevated guest experiences. Our hospitality collections bring together timeless aesthetics, operational durability, and refined comfort for hotels, resorts, retreats, and modern hospitality environments.",
      "Sustainability at Texaura is approached through responsibility, long-term thinking, and conscious decision-making across every stage of creation — from certified organic cotton and thoughtful production planning to recyclable packaging and products designed for lasting use.",
      "Guided by a philosophy of quiet refinement and thoughtful simplicity, Texaura is building a global lifestyle brand where comfort, craftsmanship, wellbeing, and conscious luxury come together seamlessly — a more thoughtful expression of modern luxury, designed around how people live, rest, and feel every day.",
    ],
  },
  {
    name: "Carpet Live",
    logo: carpetLiveLogo.src,
    blurb:
      "Rooted in Bhadohi's weaving legacy, Carpet Live brings export-quality flatweaves — kilims and dhurries — into contemporary homes. Lightweight, tactile, and built to last. Crafted. Curated. Enduring.",
    about: [
      "Rooted in Bhadohi's legacy of craftsmanship, Carpet Live brings export-quality rugs into contemporary homes. Built on generations of weaving expertise, the brand balances heritage techniques with modern design sensibilities to create pieces that feel timeless, functional, and quietly refined.",
      "At Carpet Live, rugs are not treated as decorative afterthoughts, but as foundational elements that shape the feeling of a space. Every piece is designed with an emphasis on texture, materiality, and longevity — crafted to feel lived-in, effortless, and enduring over time.",
      "Known for one of India's largest collections of kilims and dhurries, Carpet Live focuses on flatweaves that work naturally within contemporary homes: lightweight and versatile, easy to maintain, functional for everyday living, and designed for warmth without visual heaviness.",
      "The brand aesthetic leans minimal, tactile, and grounded — blending traditional craftsmanship with modern interiors in a way that feels elevated yet deeply personal. Crafted. Curated. Enduring.",
    ],
  },
  {
    name: "Dheer Exports",
    logo: dheerLogo.src,
    blurb:
      "A Jaipur family business since 2010, Dheer Exports grew from two weavers to three hundred — building one of India's largest collections of handcrafted rugs, dhurries, and carpets while creating dignified livelihoods for artisans.",
    about: [
      "In 2010, this organisation was formed with a resolve to work for artisans — handing them a way to earn a livelihood and lead a respectful life, and in turn contributing to the larger ambition of rebuilding and serving the nation. With this goal, Dheer Exports came into existence.",
      "It's a family business that combines the pursuit of positive wealth creation with spreading kindness in a way that benefits all stakeholders — consumers, artisans, employees, suppliers, and channel partners. Manufacturing rugs since 2010, it began with a single loom and two weavers in the family home, and the dreams of Mr Kunal and Mrs Sujata Shah. It has been a tough journey from two weavers to three hundred.",
      "Today Dheer Exports makes one of the largest collections of rugs and carpets, and designs and develops home-furnishing items of every kind. The range — dhurries, cotton stone-wash dhurries, chenille rugs, hemp and jute rugs, cotton-wool rugs, hand-tufted carpets, cushion covers, shaggy rugs, cotton throws, stools and poufs — comes in many attractive colour combinations.",
      "At Dheer Rugs, we serve a community of designers, decorators, and homebodies — people who care deeply about the objects they bring into their homes, from the materials we source to the textures we develop. Our carpets and rugs are known for their elegant designs and quality.",
    ],
  },
] as const;

export const revalidate = 300;

export async function generateMetadata(): Promise<import("next").Metadata> {
  return pageSeoMetadata((await getEditorial("app/(site)/stays/page", editorialDefaults)).seo, editorialDefaults.seo);
}

const EXPERIENCE_PHOTOS = [expA, "/images/2N0A9839.JPG", "/images/DJI_20240924131352_0562_D.jpg", expD, expE, expF];

export default async function StaysPage() {
  const content = await getEditorial("app/(site)/stays/page", editorialDefaults);

  const [rooms, visitOptions] = await Promise.all([getCottages(), getVisitOptions()]);

  return (
    <>
      <StaysHeroGallery photos={rooms.map((room) => ({ src: room.gallery[1] || room.gallery[0] || room.image, name: room.name, slug: room.slug, element: room.element }))} />

      <AnimateInView delay={60}><section id="stays-intro" className="mx-auto max-w-6xl px-5 pb-7 pt-4 sm:px-8">
        <Reveal variant="fade" className="mx-auto max-w-3xl text-center">
          <p className="leading-relaxed text-foreground-soft"><FormattedText value={content.text_1} /></p>
        </Reveal>


      </section></AnimateInView>

      <SectionWave from="#f3f1ea" to="var(--footer-background)" variant="wave" className="h-6 sm:h-8" />
      <AnimateInView delay={80}><StayCollection rooms={rooms} /></AnimateInView>

      <SectionWave from="var(--footer-background)" to="#f3f1ea" variant="arch" />
      <AnimateInView delay={80}><section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <Reveal variant="fade" className="mx-auto max-w-2xl text-center">
          <SectionEyebrow icon="sparkles-outline"><FormattedText value={content.text_2} /></SectionEyebrow>
          <h2 className="mt-3 font-display italic text-4xl leading-tight"><FormattedText value={content.text_3} /></h2>
          <p className="mt-4 text-foreground-soft leading-relaxed"><FormattedText value={content.text_4} /><FormattedText value={" "} />
            <a href={content.href_5} className="text-accent underline"><FormattedText value={content.text_6} links={false} /></a><FormattedText value={" "} /><FormattedText value={content.text_7} /></p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {content.EXPERIENCE_PHOTOS.map((img, i) => (
            <Reveal key={i} variant="clip" delay={(i % 3) * 80} className={i % 3 === 1 ? "sm:mt-8" : ""}>
              <Parallax speed={i % 2 === 0 ? 0.05 : -0.05}>
                <div className="relative aspect-square overflow-hidden border border-line">
                  <Image src={img} alt="" fill sizes="33vw" className="object-cover transition-transform duration-500 hover:scale-105" />
                </div>
              </Parallax>
            </Reveal>
          ))}
        </div>
      </section></AnimateInView>

      {visitOptions.length > 0 && (
        <SectionWave from="#f3f1ea" to="#e7ebdd" variant="slant" />
      )}
      {visitOptions.length > 0 && (
        <AnimateInView delay={100}><section className="organic-section texture-linen relative overflow-hidden bg-dusk-surface py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal variant="fade" className="mx-auto max-w-2xl text-center">
              <SectionEyebrow icon="calendar-outline"><FormattedText value={content.text_23} /></SectionEyebrow>
              <h2 className="mt-3 font-display italic text-4xl leading-tight"><FormattedText value={content.text_24} /></h2>
            </Reveal>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {visitOptions.map((option, i) => (
                <Reveal
                  key={option.title}
                  variant="up"
                  delay={i * 90}
                  className={i % 2 === 1 ? "sm:mt-10" : ""}
                >
                  <div className="group relative aspect-[4/3] overflow-hidden border border-line transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-28px_rgba(45,35,25,0.4)] sm:aspect-[16/10]">
                    {option.image ? (
                      <Image
                        src={option.image}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-clay-surface" />
                    )}
                    <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <h3 className="font-display italic text-xl leading-tight text-white sm:text-2xl"><FormattedText value={option.title} /></h3>
                      <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-white/85"><FormattedText value={option.description} /></p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section></AnimateInView>
      )}
      {visitOptions.length > 0 && (
        <SectionWave from="#e7ebdd" to="#f3f1ea" variant="wave" />
      )}

      <AnimateInView delay={80}><section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <Reveal variant="fade" className="mx-auto max-w-2xl text-center">
          <SectionEyebrow icon="ribbon-outline" className="justify-center"><FormattedText value={content.text_25} /></SectionEyebrow>
          <h2 className="mt-3 font-display italic text-3xl leading-tight"><FormattedText value={content.text_26} /></h2>
          <p className="mx-auto mt-3 text-sm leading-relaxed text-foreground-soft"><FormattedText value={content.text_27} /></p>
        </Reveal>

        <PartnerCards partners={content.ACCESSORY_PARTNERS} />
      </section></AnimateInView>
    </>
  );
}
