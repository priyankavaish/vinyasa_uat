
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_sections_testimonials_section";
import { getEditorial } from "@/lib/editorial/server";
import Image from "@/components/editorial/image";
import SectionEyebrow from "../ui/section-eyebrow";

// Original testimonials and attributions: https://www.vinyasa.earth/
const testimonials = [
  {
    name: "Valentia Holch",
    role: "Flow artist",
    image: "/images/testimonials/valentia.jpg",
    position: "50% 70%",
    quote:
      "A wonderful experience to stay at Vinyasa for 11 days. We were creating so much art, doing yoga, sharing good conversations, good food and amazing moments with beautiful people. If you are an artist, don’t hesitate — it is a place to explore your imagination and creativity 🤍🫂",
  },
  {
    name: "Nitin Jain",
    role: "Founder, Indibni",
    image: "/images/testimonials/nitin.jpg",
    position: "50% 25%",
    quote:
      "It takes a lifetime to build a living experience. Vinyasa is such a place — stories and elements created the rhythm and the space. Be there to find your rhythm and you will be amazed to see yourself dancing.",
  },
  {
    name: "Raman",
    role: "Movement Practitioner",
    image: "/images/testimonials/raman.jpg",
    position: "50% 40%",
    quote:
      "I have been staying at Vinyasa Earth for 12 days now and I must say this is not just a place, it’s an experience. I came here to create some art, but my entire experience has become an art in itself. Eternally grateful.",
  },
  {
    name: "Kamal Bharadwaj",
    role: "Explorer, Traveller",
    image: "/images/testimonials/kamal.jpeg",
    position: "50% 65%",
    quote:
      "The food deserves a special mention — fresh, flavorful, prepared with love. The team went above and beyond to make our anniversary special. Their attention to detail made the entire experience feel personal and unforgettable.",
  },
] as const;

// A pinboard of sticky notes — every voice pinned up at once, each on its own
// tinted paper, gently askew, straightening when you lean in (hover).
const NOTES = [
  { paper: "#f7e7c1", tilt: "-rotate-[2.5deg]", tape: "-rotate-[5deg]" },
  { paper: "#efd7c4", tilt: "rotate-[2deg]", tape: "rotate-[6deg]" },
  { paper: "#e3e0cd", tilt: "rotate-[1.5deg]", tape: "-rotate-[3deg]" },
  { paper: "#f2dcd4", tilt: "-rotate-[1.5deg]", tape: "rotate-[4deg]" },
];

export default async function TestimonialsSection() {
  const content = await getEditorial("components/sections/testimonials-section", editorialDefaults);

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative overflow-hidden bg-[#e8dbc6] py-14 sm:py-20"
    >
      {/* faint board grain */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(rgba(120,90,55,0.10) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow icon="people-outline" className="justify-center">{content.text_1}</SectionEyebrow>
          <h2
            id="testimonials-heading"
            className="mt-3 font-display text-4xl italic leading-tight tracking-tight text-clay-ink sm:text-5xl"
          >{content.text_2}</h2>
          <p className="mt-4 text-base font-medium leading-relaxed text-[#5a4632]">{content.text_3}{" "}
            <span className="text-accent">{content.text_4}</span>.
          </p>
          <span aria-hidden="true" className="mx-auto mt-7 block h-[3px] w-16 rounded-full bg-accent" />
        </div>

        <div className="mt-14 grid gap-6 sm:mt-16 sm:grid-cols-2 sm:gap-7 lg:grid-cols-4">
          {content.testimonials.map((testimonial, index) => {
            const note = NOTES[index % NOTES.length];
            return (
              <figure
                key={testimonial.name}
                className={`group relative flex h-full flex-col p-5 pt-9 shadow-[0_14px_26px_-10px_rgba(70,45,25,0.5)] transition-all duration-300 hover:z-10 hover:rotate-0 hover:-translate-y-1.5 hover:shadow-[0_28px_50px_-14px_rgba(70,45,25,0.55)] sm:p-6 sm:pt-10 ${note.tilt}`}
                style={{ backgroundColor: note.paper }}
              >
                {/* tape */}
                <span
                  aria-hidden="true"
                  className={`absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 bg-white/45 shadow-[0_1px_3px_rgba(0,0,0,0.15)] ${note.tape}`}
                />

                <span
                  aria-hidden="true"
                  className="font-display text-5xl leading-[0.4] text-[#8f3b31]/35"
                >
                  &ldquo;
                </span>

                <blockquote className="mt-3 text-[13.5px] leading-relaxed text-[#584635]">
                  {testimonial.quote}
                </blockquote>

                <figcaption className="mt-auto flex items-center gap-3 border-t border-black/10 pt-4">
                  <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white/70">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                      style={{ objectPosition: testimonial.position }}
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-script text-2xl leading-none text-[#8f3b31]">
                      {testimonial.name}
                    </span>
                    <span className="mt-1 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#7a5c3f]">
                      {testimonial.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
