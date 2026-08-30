import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/hero";
import SectionEyebrow from "@/components/section-eyebrow";
import { Reveal } from "@/components/reveal";
import { Parallax } from "@/components/parallax";
import { Icon } from "@/components/icon";
import LeadForm from "@/components/lead-form";
import { volunteerTracks, volunteerInfo } from "@/lib/content";

import heroImg from "@/app/assets/new/community-04.jpg";
import sideImg from "@/app/assets/new/grounds-07.jpg";

export const metadata = {
  title: "Volunteer",
  description:
    "Volunteer at Vinyasa Earth in Amer, Jaipur — community volunteering from one week, or a skill-based exchange from one month. Dorm stay and three vegetarian meals a day included.",
  alternates: { canonical: "/corporate" },
};

export default function VolunteerPage() {
  return (
    <>
      <PageHero
        eyebrow="Volunteering"
        title="Come live on the land, and give something back to it"
        description="Volunteering is how most people first arrive at Vinyasa Earth — and, for many, how they end up staying. Two tracks, both rooted in community living and eco-conscious practice."
        image={heroImg}
      />

      <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
        <Reveal variant="fade">
          <SectionEyebrow icon="leaf-outline" className="justify-center">
            Why volunteer
          </SectionEyebrow>
          <p className="mt-4 leading-relaxed text-foreground-soft">
            {volunteerInfo.note}
          </p>
        </Reveal>
      </section>

      <section className="organic-section relative overflow-hidden bg-clay-surface py-16 sm:py-20">
        <Parallax
          speed={0.04}
          className="pointer-events-none absolute -left-24 bottom-0 hidden w-[20rem] opacity-[0.12] sm:block"
          aria-hidden="true"
        >
          <Image src={sideImg} alt="" className="w-full rounded-full" />
        </Parallax>

        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal variant="left" className="mx-auto mb-12 max-w-2xl text-center">
            <SectionEyebrow icon="people-outline" className="justify-center">
              Two ways in
            </SectionEyebrow>
            <h2 className="mt-3 font-display italic text-4xl leading-tight">
              Pick the track that fits your time
            </h2>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            {volunteerTracks.map((track, i) => (
              <Reveal key={track.slug} variant="up" delay={i * 100} className="h-full">
                <div className="flex h-full flex-col border border-line bg-surface p-7 sm:p-8">
                  <h3 className="font-display italic text-2xl leading-tight text-foreground">
                    {track.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-foreground-soft">{track.description}</p>

                  <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-line py-5 text-sm">
                    <div>
                      <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                        Commitment
                      </dt>
                      <dd className="mt-1 text-foreground">{track.commitment}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                        Exchange
                      </dt>
                      <dd className="mt-1 text-foreground">{track.compensation}</dd>
                    </div>
                  </dl>

                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                    Roles
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-foreground-soft">
                    {track.roles.map((role) => (
                      <li key={role} className="flex gap-2.5">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {role}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:gap-16">
          <Reveal variant="left">
            <SectionEyebrow icon="home-outline">What's included</SectionEyebrow>
            <ul className="mt-5 space-y-3 text-sm text-foreground-soft">
              {volunteerInfo.benefits.map((b) => (
                <li key={b} className="flex gap-3">
                  <Icon name="leaf-outline" size={16} className="mt-0.5 shrink-0 text-secondary" />
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal variant="right" delay={100}>
            <SectionEyebrow icon="compass-outline">Who it's for</SectionEyebrow>
            <ul className="mt-5 space-y-3 text-sm text-foreground-soft">
              {volunteerInfo.requirements.map((r) => (
                <li key={r} className="flex gap-3">
                  <Icon name="circle-outline" size={16} className="mt-0.5 shrink-0 text-accent" />
                  {r}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="organic-section relative overflow-hidden bg-dusk-surface py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal variant="left">
            <SectionEyebrow icon="ribbon-outline">Apply</SectionEyebrow>
            <h2 className="mt-3 font-display italic text-4xl leading-tight">
              Tell us what you'd bring
            </h2>
            <p className="mt-4 leading-relaxed text-foreground-soft">
              Send a note about your skills, the dates you have in mind, and which track you're
              drawn to. Skill-based roles can also be discussed directly at{" "}
              <a href="mailto:vinyasa.ashram@gmail.com" className="text-accent underline">
                vinyasa.ashram@gmail.com
              </a>
              .
            </p>
            <p className="mt-6 border border-line bg-surface p-4 text-sm text-foreground-soft">
              Hosting a team offsite or a brand shoot instead?{" "}
              <Link href="/contact" className="text-accent underline">
                Talk to us about venue hire
              </Link>
              .
            </p>
          </Reveal>
          <Reveal variant="right" delay={100}>
            <div className="border border-line bg-surface p-6 sm:p-8">
              <LeadForm
                source="volunteer"
                title="Volunteer application"
                submitLabel="Send application"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
