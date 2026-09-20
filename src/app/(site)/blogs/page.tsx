
import Link from "next/link";
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/app__site__blogs_page";
import { getEditorial } from "@/lib/editorial/server";
import SectionEyebrow from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import SectionWave from "@/components/ui/section-wave";
import AnimateInView from "@/components/ui/animate-in-view";
import Image from "@/components/editorial/image";
import { getPublishedBlogs } from "@/lib/cms";

export const revalidate = 300;

export async function generateMetadata(): Promise<import("next").Metadata> {
  return (await getEditorial("app/(site)/blogs/page", editorialDefaults)).seo;
}

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

export default async function BlogsPage() {
  const content = await getEditorial("app/(site)/blogs/page", editorialDefaults);
  const posts = await getPublishedBlogs();

  return (
    <>
      <section className="bg-clay-surface px-5 pb-12 pt-28 text-center sm:px-8 sm:pb-16 sm:pt-36">
        <div className="mx-auto max-w-2xl">
          <SectionEyebrow icon="sparkles-outline" className="justify-center">{content.text_1}</SectionEyebrow>
          <h1 className="mt-3 font-display text-4xl italic leading-tight text-clay-ink sm:text-5xl">{content.text_2}</h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-foreground-soft">{content.text_3}</p>
          <span aria-hidden="true" className="mx-auto mt-6 block h-[3px] w-16 rounded-full bg-accent" />
          <p className="mt-6 text-xs uppercase tracking-[0.16em] text-muted">{content.text_4}</p>
        </div>
      </section>
      <SectionWave from="#f3e6d8" to="#f3f1ea" variant="arch" />

      {posts.length > 0 && (
        <AnimateInView delay={60}><section className="mx-auto max-w-6xl px-5 pt-16 sm:px-8 sm:pt-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.slug} variant="up" delay={(i % 3) * 80}>
                <Link
                  href={`/blogs/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden border border-line bg-surface transition-all hover:-translate-y-1 hover:border-accent hover:shadow-[0_24px_60px_-28px_rgba(45,35,25,0.4)]"
                >
                  {post.coverUrl ? (
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <Image src={post.coverUrl} alt={post.title} fill sizes="400px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">{content.text_5}</span>
                    <h3 className="mt-3 font-display italic text-xl leading-snug text-clay-ink">{post.title}</h3>
                    {post.excerpt ? (
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground-soft">{post.excerpt}</p>
                    ) : null}
                    <span className="mt-5 inline-flex items-center gap-2 border-t border-line pt-4 text-xs font-bold uppercase tracking-[0.12em] text-accent">
                      {content.text_6}
                      <Icon name="arrow-forward-outline" size={14} className="-rotate-45 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section></AnimateInView>
      )}

      <AnimateInView delay={80}><section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        {posts.length > 0 ? (
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Archive — earlier posts</p>
        ) : null}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.POSTS.map((post, i) => (
            <Reveal key={post.href} variant="up" delay={(i % 3) * 80}>
              <a
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col border border-line bg-surface p-6 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-[0_24px_60px_-28px_rgba(45,35,25,0.4)] sm:p-7"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">{content.text_5}</span>
                <h3 className="mt-3 font-display italic text-xl leading-snug text-clay-ink">
                  {post.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground-soft">
                  {post.blurb}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 border-t border-line pt-4 text-xs font-bold uppercase tracking-[0.12em] text-accent">{content.text_6}<Icon
                    name="arrow-forward-outline"
                    size={14}
                    className="-rotate-45 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section></AnimateInView>
    </>
  );
}
