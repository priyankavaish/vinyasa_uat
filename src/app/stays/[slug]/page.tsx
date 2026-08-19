import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cottages } from "@/lib/content";

const IMAGE_ROTATION = [
  "/images/property-cottages-day.jpg",
  "/images/property-night-gathering.jpg",
  "/images/property-lawn-gazebo.jpg",
];

export function generateStaticParams() {
  return cottages.map((c) => ({ slug: c.slug }));
}

export default async function CottageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cottage = cottages.find((c) => c.slug === slug);
  if (!cottage) notFound();
  const image = IMAGE_ROTATION[cottages.indexOf(cottage) % IMAGE_ROTATION.length];

  return (
    <>
      <section className="relative flex h-[52vh] min-h-[380px] items-end text-background">
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/5" />
        <div className="relative z-10 mx-auto w-full max-w-4xl px-5 pb-12 sm:px-8">
          <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] before:h-px before:w-7 before:bg-background/60 before:content-['']">
            {cottage.tagline}
          </p>
          <h1 className="font-display italic text-4xl leading-tight sm:text-5xl">{cottage.name}</h1>
          <p className="mt-4 max-w-[60ch] text-background/85 leading-relaxed">{cottage.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-display italic text-2xl">Amenities</h2>
            <ul className="mt-4 space-y-2 text-sm text-foreground-soft">
              {cottage.amenities.map((a) => (
                <li key={a} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-accent" /> {a}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-muted">Sleeps up to {cottage.maxGuests} guests.</p>
          </div>

          <div className="border border-line bg-surface p-6">
            <p className="text-xs tracking-[0.08em] uppercase text-foreground-soft">From</p>
            <p className="mt-1 font-display italic text-3xl">
              ₹{cottage.pricePerNight.toLocaleString("en-IN")}
              <span className="text-sm font-sans not-italic text-foreground-soft"> / night</span>
            </p>
            {cottage.placeholder && <p className="mt-1 text-xs text-muted">(placeholder, confirm)</p>}
            <Link
              href={`/book?type=stay&slug=${cottage.slug}`}
              className="btn btn-accent mt-5 block text-center"
            >
              Check availability
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
