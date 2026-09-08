"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Icon } from "../ui/icon";
import SectionEyebrow from "../ui/section-eyebrow";

// Original testimonials and attributions: https://www.vinyasa.earth/
const testimonials = [
  {
    name: "Valentia Holch",
    role: "Flow artist",
    image: "/images/testimonials/valentia.jpg", position: "50% 70%",
    quote: "A wonderful experience to stay at Vinyasa for 11 days. We were creating so much art, doing yoga, sharing good conversations, good food and amazing moments with beautiful people there. If you are an artist don’t hesitate to stay here! It is a place to explore your imagination and creativity 🤍🫂 Thank you guys!!!",
  },
  {
    name: "Nitin Jain",
    role: "Founder | Indibni",
    image: "/images/testimonials/nitin.jpg", position: "50% 25%",
    quote: "It takes lifetime to build living experience. Vinyasa is such place, stories and elements created the rhythm and the space. Be there to find your rhythm and you will be amazed to see yourself dancing and rocking.",
  },
  {
    name: "Raman",
    role: "Movement Practitioner",
    image: "/images/testimonials/raman.jpg", position: "50% 40%",
    quote: "I have been staying at Vinyasa Earth for 12 days now and i must say this is not just a place, its an experience. I came here to create some art, but my entire experience has become an art in itself. I am eternally grateful for this place and the people who made it possible. Thank you from the core of my heart.",
  },
  {
    name: "Kamal Bharadwaj",
    role: "Explorer, Traveller",
    image: "/images/testimonials/kamal.jpeg", position: "50% 65%",
    quote: "The food deserves a special mention—fresh, flavorful, and prepared with love. The team went above and beyond to make our anniversary special, surprising my wife with thoughtful decorations that brought a big smile to her face. Their attention to detail made the entire experience feel personal and unforgettable.",
  },
] as const;

export default function TestimonialsSection() {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const autoplay = !paused && !focused && !dragging && !reducedMotion;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  useEffect(() => {
    if (!emblaApi) return;
    const updateSelected = () => setSelected(emblaApi.selectedScrollSnap());
    updateSelected();
    emblaApi.on("select", updateSelected);
    emblaApi.on("reInit", updateSelected);
    return () => {
      emblaApi.off("select", updateSelected);
      emblaApi.off("reInit", updateSelected);
    };
  }, [emblaApi]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const startDrag = () => setDragging(true);
    const endDrag = () => setDragging(false);
    emblaApi.on("pointerDown", startDrag);
    emblaApi.on("pointerUp", endDrag);
    return () => {
      emblaApi.off("pointerDown", startDrag);
      emblaApi.off("pointerUp", endDrag);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !autoplay) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) emblaApi.scrollNext();
    }, 6500);
    return () => window.clearInterval(timer);
  }, [emblaApi, autoplay, selected]);

  const navigate = (direction: "previous" | "next") => {
    const jump = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (direction === "previous") emblaApi?.scrollPrev(jump);
    else emblaApi?.scrollNext(jump);
  };

  return (
    <section
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
      aria-labelledby="testimonials-heading" aria-roledescription="carousel" className="border-y border-line bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow icon="people-outline" className="justify-center">Voices from our community</SectionEyebrow>
          <h2 id="testimonials-heading" className="mt-3 font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
            We have nurtured a few bonds
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-foreground-soft">
            Everyone who shares the space with us at Vinyasa is FAMILY
          </p>
          <span aria-hidden="true" className="mx-auto mt-7 block h-px w-16 bg-accent/40" />
        </div>

        <div
          id="testimonial-slides"
          ref={emblaRef}
          tabIndex={0}
          aria-label="Testimonials. Use left and right arrow keys to browse."
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              navigate(event.key === "ArrowLeft" ? "previous" : "next");
            }
          }}
          className="mt-10 overflow-hidden border border-line bg-surface sm:mt-12"
        >
          <div className="flex touch-pan-y">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.name} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${testimonials.length}: ${testimonial.name}`} aria-hidden={index !== selected} className="min-w-0 flex-[0_0_100%]">
                <figure className="grid h-full md:grid-cols-[0.8fr_1.2fr]">
                  <div className="relative h-64 overflow-hidden bg-secondary-surface sm:h-80 md:h-full md:min-h-[26rem]">
                    <Image src={testimonial.image} alt={testimonial.name} fill sizes="(min-width: 1280px) 480px, (min-width: 768px) 40vw, 100vw" className="object-cover" style={{ objectPosition: testimonial.position }} draggable={false} />
                  </div>
                  <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
                    <span aria-hidden="true" className="h-10 font-display text-5xl leading-none text-accent/60">&ldquo;</span>
                    <blockquote className="mt-3">
                      <p className="text-sm leading-relaxed text-foreground-soft">{testimonial.quote}</p>
                    </blockquote>
                    <figcaption className="mt-7 border-t border-line pt-5">
                      <p className="font-display text-xl leading-tight text-foreground">{testimonial.name}</p>
                      <p className="mt-1 text-xs text-muted">{testimonial.role}</p>
                    </figcaption>
                  </div>
                </figure>
              </div>
            ))}
          </div>
        </div>

        {!reducedMotion && (
          <div className="mt-4 flex justify-end">
            <button type="button" onClick={() => setPaused((value) => !value)} aria-controls="testimonial-slides" className="min-h-11 px-3 text-xs text-accent underline underline-offset-4">
              {paused ? "Resume slideshow" : "Pause slideshow"}
            </button>
          </div>
        )}
        <div className="mt-5 flex items-center justify-between gap-3">
          <p aria-live={autoplay ? "off" : "polite"} aria-atomic="true" className="text-xs tabular-nums text-muted">
            {String(selected + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
          </p>
          <div className="flex items-center" aria-label="Choose a testimonial">
            {testimonials.map((testimonial, index) => (
              <button key={testimonial.name} type="button" aria-label={`Read ${testimonial.name}'s testimonial`} aria-current={selected === index ? "true" : undefined} aria-controls="testimonial-slides" onClick={() => emblaApi?.scrollTo(index, window.matchMedia("(prefers-reduced-motion: reduce)").matches)} className="grid h-11 w-9 place-items-center">
                <span className={`block h-1.5 rounded-full transition-[width,background-color] motion-reduce:transition-none ${selected === index ? "w-6 bg-accent" : "w-1.5 bg-secondary/35"}`} />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => navigate("previous")} aria-label="Previous testimonial" aria-controls="testimonial-slides" className="grid h-11 w-11 place-items-center rounded-full border border-line text-accent transition-colors hover:border-accent hover:bg-accent hover:text-surface">
              <Icon name="arrow-forward-outline" size={16} className="rotate-180" />
            </button>
            <button type="button" onClick={() => navigate("next")} aria-label="Next testimonial" aria-controls="testimonial-slides" className="grid h-11 w-11 place-items-center rounded-full border border-line text-accent transition-colors hover:border-accent hover:bg-accent hover:text-surface">
              <Icon name="arrow-forward-outline" size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
