import { PageHero } from "@/components/sections/hero";
import SectionEyebrow from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";

export const revalidate = 300;

export const metadata = {
  title: "Blogs",
  description:
    "Long-form writing from the Vinyasa Earth journal — residencies, community life, and the small practices that shape a shared home in Jaipur.",
  alternates: { canonical: "/blogs" },
};

// Index of the Vinyasa Earth journal. Full pieces live on vinyasa.earth for now.
const POSTS: Array<{ title: string; href: string; blurb: string }> = [
  {
    title: "Settling In…",
    href: "https://www.vinyasa.earth/settling-in/",
    blurb: "The first weeks of finding a rhythm in a new place, among new people.",
  },
  {
    title: "The Shift",
    href: "https://www.vinyasa.earth/the-shift/",
    blurb: "How a slower pace quietly rearranges what feels important.",
  },
  {
    title: "The Real Hustle!",
    href: "https://www.vinyasa.earth/the-real-hustle/",
    blurb: "The unglamorous, everyday work of keeping a creative home going.",
  },
  {
    title: "New Beginnings!",
    href: "https://www.vinyasa.earth/new-beginnings/",
    blurb: "Arrivals, first mornings, and the start of something at Vinyasa.",
  },
  {
    title: "Memories of Vinyasa",
    href: "https://www.vinyasa.earth/memories-of-vinyasa/",
    blurb: "Looking back on the people and moments that stayed with us.",
  },
  {
    title: "Beyond the Escape: Introducing the Vinyasa Voices",
    href: "https://www.vinyasa.earth/vinyasa-voices/",
    blurb: "A new series handing the page to the residents themselves.",
  },
  {
    title: "Washing Your Own Dishes: A Practice in Presence",
    href: "https://www.vinyasa.earth/washing-your-own-dishes-at-vinyasa-earth/",
    blurb: "Why the smallest shared chores hold the community together.",
  },
  {
    title: "A Substance-Free Space: Holding a Container of Clarity and Care",
    href: "https://www.vinyasa.earth/vinyasa-earth-substance-free-space/",
    blurb: "The thinking behind keeping the land clear-headed and safe.",
  },
  {
    title: "My First Blog……",
    href: "https://www.vinyasa.earth/my-first-blog/",
    blurb: "A resident writes for the journal for the very first time.",
  },
];

export default function BlogsPage() {
  return (
    <>
      <PageHero
        eyebrow="The journal"
        title="Notes from a shared home"
        description="Long-form writing from residents and the team — on community life, creative practice, and the small habits that make Vinyasa Earth what it is."
        image="/seed/community-02.jpg"
        imageAlt="Residents gathered in the courtyard at Vinyasa Earth"
        imagePosition="50% 45%"
      />

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal variant="fade" className="mx-auto max-w-2xl text-center">
          <SectionEyebrow icon="sparkles-outline" className="justify-center">
            Recent writing
          </SectionEyebrow>
          <h2 className="mt-3 font-display italic text-4xl leading-tight">
            Stories from the land
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-foreground-soft">
            Each piece opens on the Vinyasa Earth journal in a new tab.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post, i) => (
            <Reveal key={post.href} variant="up" delay={(i % 3) * 80}>
              <a
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col border border-line bg-surface p-6 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-[0_24px_60px_-28px_rgba(45,35,25,0.4)] sm:p-7"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                  Journal
                </span>
                <h3 className="mt-3 font-display italic text-xl leading-snug text-foreground">
                  {post.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground-soft">
                  {post.blurb}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 border-t border-line pt-4 text-xs font-bold uppercase tracking-[0.12em] text-accent">
                  Read on the journal
                  <Icon
                    name="arrow-forward-outline"
                    size={14}
                    className="-rotate-45 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
