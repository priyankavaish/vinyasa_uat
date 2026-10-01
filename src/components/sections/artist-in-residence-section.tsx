import Image from "@/components/editorial/image";
import SectionEyebrow from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import livingImage from "@/app/assets/artist-in-residence/GPS_4871-2-edited-1024x768.webp";
import researchImage from "@/app/assets/artist-in-residence/WhatsApp-Image-2024-07-31-at-2.01.34-PM-edited-1024x768.webp";

const details = [
  { title: "Living & learning", body: "Dorm accommodation, daily vegetarian meals and access to Vinyasa's spaces support independent inquiry. Artists from movement, wellness, film, photography and permaculture are welcome." },
  { title: "Practice in community", body: "Share regular sessions and deeper weekly offerings. There is no stipend; independently hosted paid sessions share revenue 60% to the artist and 40% to Vinyasa." },
  { title: "Research & the archive", body: "Develop a proposal with your question, methods, documentation and timeline. A final research document joins the Vinyasa Archive; authorship remains yours, with Vinyasa permitted to share it for educational and archival purposes." },
];

export default function ArtistInResidenceSection() {
  return (
    <section id="artist-in-residence" className="scroll-mt-24 bg-secondary-surface py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left">
            <SectionEyebrow icon="compass-outline">Rooted in Practice</SectionEyebrow>
            <h2 className="mt-3 font-display text-4xl italic leading-tight sm:text-5xl">Artist in Residence</h2>
            <p className="mt-5 text-lg leading-8 text-foreground-soft">Live with a question. Give your practice time to unfold.</p>
            <p className="mt-5 border-y border-line py-4 text-xs font-semibold uppercase tracking-[0.13em] text-accent">June to September programme &middot; Four months &middot; Two artists</p>
            <a href="#residency-enquiry" className="btn btn-accent mt-6">Enquire about the next intake</a>
          </Reveal>
          <Reveal variant="right" className="relative aspect-[4/3] overflow-hidden rounded-tl-[3rem] rounded-br-[3rem]">
            <Image src={livingImage} alt="Reading in Vinyasa's bamboo dorm accommodation" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </Reveal>
        </div>
        <div className="mt-12 grid gap-8 border-y border-line py-10 md:grid-cols-3">
          {details.map((detail, i) => (
            <Reveal key={detail.title} variant="up" delay={i * 70}>
              <h3 className="font-display text-2xl italic">{detail.title}</h3>
              <p className="mt-3 text-sm leading-7 text-foreground-soft">{detail.body}</p>
            </Reveal>
          ))}
        </div>
        <div id="residency-enquiry" className="mt-12 grid scroll-mt-28 items-center gap-8 md:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <Reveal variant="left" className="relative aspect-[4/3] overflow-hidden">
            <Image src={researchImage} alt="A quiet workspace overlooking Vinyasa's green grounds" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
          </Reveal>
          <Reveal variant="right">
            <SectionEyebrow icon="leaf-outline">Begin a conversation</SectionEyebrow>
            <h3 className="mt-3 font-display text-3xl italic">Bring your inquiry</h3>
            <p className="mt-4 text-sm leading-7 text-foreground-soft">Email your portfolio, artist statement and research proposal. Shortlisted artists discuss their practice and contributions with the team before agreeing on the residency.</p>
            <a href="mailto:vinyasa.ashram@gmail.com?subject=Artist%20in%20Residence%20-%20Next%20intake%20enquiry" className="btn btn-accent mt-6">Enquire by email</a>
            <p className="mt-3 text-sm text-foreground-soft">Contact the team for the next intake dates and availability.</p>
            <a href="#offerings" className="mt-5 inline-block text-xs uppercase tracking-[0.12em] text-accent underline underline-offset-4">Find Your Path</a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
