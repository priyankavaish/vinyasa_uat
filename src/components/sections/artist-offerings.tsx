import Image from "@/components/editorial/image";
import { Reveal } from "@/components/ui/reveal";
import SectionHeading from "@/components/ui/section-heading";
import { Icon } from "@/components/ui/icon";
import residenceImage from "@/app/assets/artist-in-residence/Arthur-1024x683 (2).webp";

export default function ArtistOfferings({ escapeImage }: { escapeImage: string }) {
  const offerings = [
    {
      name: "Artist Escape", href: "#artist-escape",
      image: escapeImage, alt: "Artists sharing a creative space at Vinyasa",
      label: "Space to Create",
      description: "Find room for your art in everyday life, with community living, shared meals and space to create. Choose your dates and bring your intent.",
      action: "Explore Artist Escape",
    },
    {
      name: "Artist in Residence", href: "#artist-in-residence",
      image: residenceImage, alt: "An artist playing guitar in an earthen space at Vinyasa",
      label: "Rooted in Practice",
      description: "A June to September residency for two selected artists to develop an inquiry through creative practice and community life.",
      action: "Explore Artist in Residence",
    },
  ];
  return (
    <section id="offerings" className="scroll-mt-28 bg-background py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading icon="sparkles-outline" eyebrow="Two paths. One creative home." title="Find your way to Vinyasa" description="Explore Artist Escape and Artist in Residence, and choose the space your practice needs." />
        <div className="mt-10 grid gap-7 md:grid-cols-2">
          {offerings.map((offering, i) => (
            <Reveal key={offering.name} variant="up" delay={i * 80}>
              <a href={offering.href} className="group flex h-full flex-col overflow-hidden border border-line bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={offering.image} alt={offering.alt} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">{offering.label}</p>
                  <h3 className="mt-3 font-display text-3xl italic">{offering.name}</h3>
                  <p className="mb-6 mt-3 text-sm leading-7 text-foreground-soft">{offering.description}</p>
                  <span className="mt-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-accent">{offering.action}<Icon name="arrow-forward-outline" size={16} /></span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
