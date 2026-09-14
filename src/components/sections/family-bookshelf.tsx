"use client";
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_sections_family_bookshelf";
import { useEditorial } from "@/components/editorial/provider";


import type { CSSProperties } from "react";
import { useState } from "react";
import Image from "@/components/editorial/image";
import coverArtwork from "@/app/assets/ChatGPT Image Aug 26, 2026, 02_21_03 PM (2).png";
import Link from "next/link";
import SectionEyebrow from "@/components/ui/section-eyebrow";

export type FamilyMember = {
  name: string;
  role: string;
  photo: string;
  position?: string;
  blurb: string;
  since: string;
};

const FLIPBOOK_CSS = `
.vy-flipbook { display:flex; perspective:1400px; padding-block:.6rem; }
.vy-book {
  position:relative; display:flex; margin:auto;
  width:min(86vw,23rem);
  pointer-events:none;
  transform-style:preserve-3d;
  transition:translate .9s;
  translate:calc(min(var(--c),1) * 50%) 0;
  rotate:1 0 0 12deg;
}
.vy-page {
  --thickness:4;
  flex:none; display:flex; width:100%;
  height:clamp(22rem,82vw,29rem);
  pointer-events:all; user-select:none; cursor:pointer;
  transform-style:preserve-3d;
  transform-origin:left center;
  transition:transform .9s, rotate .9s ease-in calc((min(var(--i),var(--c)) - max(var(--i),var(--c))) * 40ms);
  translate:calc(var(--i) * -100%) 0 0;
  transform:translateZ(calc((var(--c) - var(--i) - .5) * calc(var(--thickness) * .9px)));
  rotate:0 1 0 calc(clamp(0,var(--c) - var(--i),1) * -180deg);
  box-shadow:0 .5em 1.2em -.3em rgba(74,47,28,.28);
}
.vy-face {
  position:relative; flex:none; width:100%;
  backface-visibility:hidden; overflow:hidden;
  background:#fbf4e7; color:#4a3728;
  display:flex; flex-flow:column; justify-content:space-between;
  padding:1.7rem;
  border:1px solid rgba(0,0,0,.10);
  translate:0;
}
.vy-front { border-radius:.15rem .55rem .55rem .15rem; background:linear-gradient(to left,#fbf4e7 82%,#efe4cf 100%); }
.vy-back  { translate:-100% 0; rotate:0 1 0 180deg; border-radius:.55rem .15rem .15rem .55rem; background:linear-gradient(to right,#fbf4e7 82%,#efe4cf 100%); }
.vy-photo, .vy-face:has(img) { padding:0; }
.vy-photo img { width:100%; height:100%; object-fit:cover; }
.vy-cover {
  justify-content:center; align-items:center; text-align:center; gap:.55rem;
  color:#f6e8dd; border:1px solid rgba(0,0,0,.22);
  background:radial-gradient(circle at 78% 18%, rgba(255,255,255,.16), transparent 60%),
            linear-gradient(150deg,#8c5636,#6f4027 58%,#57311c);
}
.vy-cover-art { position:absolute; left:0; width:100%; height:auto; pointer-events:none; opacity:.9; }
.vy-cover-art-top { top:1.2rem; }
.vy-cover-art-bottom { bottom:1.2rem; transform:rotate(180deg); }
.vy-cover-front::after { content:""; position:absolute; inset:0; pointer-events:none; background:linear-gradient(90deg,rgba(30,15,8,.35),transparent 5%,rgba(255,255,255,.09) 7%,transparent 10%); }
.vy-kick { font-size:.68rem; letter-spacing:.24em; text-transform:uppercase; opacity:.82; }
.vy-cover-title { font-family:var(--font-bellefair),Georgia,serif; font-style:italic; font-size:clamp(2.4rem,9vw,3.4rem); line-height:1; margin:0; }
.vy-cover-sub { font-size:.72rem; letter-spacing:.16em; text-transform:uppercase; opacity:.78; }
.vy-photo-name {
  position:absolute; left:0; right:0; bottom:0; padding:1.5rem 1.3rem;
  font-family:var(--font-bellefair),Georgia,serif; font-style:italic;
  font-size:clamp(1.4rem,6vw,1.95rem); color:#fff;
  background:linear-gradient(to top,rgba(0,0,0,.62),transparent);
}
.vy-role { font-size:.64rem; font-weight:700; letter-spacing:.17em; text-transform:uppercase; color:#8f3b31; }
.vy-name { font-family:var(--font-bellefair),Georgia,serif; font-style:italic; font-size:clamp(1.55rem,6vw,2.05rem); line-height:1.05; margin:.35rem 0 0; color:#3a2b1e; }
.vy-blurb { margin:.75rem 0 0; font-size:clamp(.83rem,3.4vw,.95rem); line-height:1.55; color:#5a4635; }
.vy-since { font-size:.64rem; letter-spacing:.15em; text-transform:uppercase; color:#8a725a; border-top:1px solid rgba(0,0,0,.10); padding-top:.6rem; }
.vy-quote { margin:auto 0 0; font-family:var(--font-bellefair),Georgia,serif; font-style:italic; font-size:clamp(1.1rem,4.6vw,1.5rem); line-height:1.4; color:#3a2b1e; }
.vy-quote-by { margin:.85rem 0 auto; font-size:.68rem; letter-spacing:.17em; text-transform:uppercase; color:#8f3b31; }
/* An open spread shows two pages side by side (current page's width × 2). At
   the 86vw size used when closed, an open spread would need ~172vw — badly
   overflowing a phone screen. Halve the page width on small screens so the
   open spread fits, and shrink the page height/padding to match. */
@media (max-width:640px) {
  .vy-book { width:min(44vw,11.5rem); rotate:1 0 0 8deg; }
  .vy-page { height:clamp(15rem,58vw,19rem); }
  .vy-face { padding:1rem; }
  .vy-photo-name { padding:1rem .9rem; }
}
@media (prefers-reduced-motion:reduce) { .vy-book, .vy-page { transition:none; } }
`;

// An open flip-book of the family — tap a page to turn it. Pure-CSS 3D page
// turns (technique: rokobuljan / Stack Overflow), re-skinned to the clay theme
// and sized in viewport units so it stays responsive.
export default function FamilyBookshelf({ members, hero = false }: { members: FamilyMember[]; hero?: boolean }) {
  const content = useEditorial("components/sections/family-bookshelf", editorialDefaults);

  const Heading = hero ? "h1" : "h2";
  const last = members.length;
  const [current, setCurrent] = useState(0);

  const turn = (e: React.MouseEvent, leafIndex: number) => {
    const onBack = !!(e.target as HTMLElement).closest(".vy-back");
    const next = onBack ? leafIndex : leafIndex + 1;
    setCurrent(Math.max(0, Math.min(last, next)));
  };

  return (
    <section
      className={hero ? "organic-section pb-10 pt-28 sm:pb-14 sm:pt-32" : "organic-section py-12 sm:py-16"}
      style={{
        background:
          "linear-gradient(to bottom, #ece0c9 0%, #e2d1b1 48%, #d4bd96 100%)",
      }}
    >
      <style>{FLIPBOOK_CSS}</style>

      <div className="mx-auto grid max-w-6xl items-center gap-6 px-5 sm:px-8 lg:grid-cols-[0.62fr_1.38fr] lg:gap-6">
        <div className="relative z-20 flex flex-col items-center text-center lg:items-start lg:text-left lg:pr-6">
          <SectionEyebrow
            icon="people-outline"
            className="justify-center lg:justify-start"
          >{content.text_1}</SectionEyebrow>
          <Heading className="mt-3 font-display text-3xl italic leading-[1.15] text-clay-ink sm:text-4xl">{content.text_2}{" "}
            <span className="not-italic text-accent">{content.text_3}</span>
          </Heading>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-foreground-soft sm:text-base lg:max-w-none">{content.text_4}</p>
          <Link
            href={content.href_5}
            className="btn btn-accent mt-7 inline-flex"
          >{content.text_6}</Link>
        </div>

        <div className="relative z-0 mt-2 lg:mt-0">
          <div className="vy-flipbook">
        <div className="vy-book" style={{ "--c": current } as CSSProperties}>
          {/* Each leaf pairs a story (front / right page) with the NEXT person's
              photo (back / left page), so an open spread shows one person's
              photo and text at the same time. */}
          {Array.from({ length: last + 1 }).map((_, leaf) => {
            const story = leaf === 0 ? null : members[leaf - 1];
            const photo = leaf < last ? members[leaf] : null;
            return (
              <div
                key={leaf}
                className="vy-page"
                style={{ "--i": leaf } as CSSProperties}
                onClick={(e) => turn(e, leaf)}
              >
                {story ? (
                  <div className="vy-face vy-front">
                    <div>
                      <span className="vy-role">{story.role}</span>
                      <h4 className="vy-name">{story.name}</h4>
                      <p className="vy-blurb">{story.blurb}</p>
                    </div>
                    <span className="vy-since">{content.text_7}{story.since}</span>
                  </div>
                ) : (
                  <div className="vy-face vy-front vy-cover vy-cover-front">
                    <Image src={content.coverArtwork} alt="" sizes="(max-width: 640px) 86vw, 368px" className="vy-cover-art vy-cover-art-top" />
                    <Image src={content.coverArtwork} alt="" sizes="(max-width: 640px) 86vw, 368px" className="vy-cover-art vy-cover-art-bottom" />
                    <span className="vy-kick">{content.text_8}</span>
                    <h3 className="vy-cover-title">{content.text_9}</h3>
                    <span className="vy-cover-sub">{content.text_10}</span>
                  </div>
                )}

                {photo ? (
                  <div className="vy-face vy-back vy-photo">
                    <Image
                      src={photo.photo}
                      alt={photo.name}
                      fill
                      sizes="30rem"
                      style={{ objectPosition: photo.position ?? "50% 40%" }}
                    />
                    <span className="vy-photo-name">{photo.name}</span>
                  </div>
                ) : (
                  <div className="vy-face vy-back vy-cover">
                    <h3 className="vy-cover-title" style={{ fontSize: "clamp(1.6rem,7vw,2.4rem)" }}>{content.text_11}</h3>
                    <span className="vy-cover-sub">{content.text_12}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          aria-label={content.aria_label_13}
          className="inline-flex items-center gap-2 border border-clay-ink/25 bg-[#fbf4e7]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-clay-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-35"
        >
          <span aria-hidden>&larr;</span>{content.text_14}</button>

        <span className="min-w-[4.5rem] text-center font-display text-sm tracking-wide text-clay-ink">
          {current === 0 ? content.text_15 : `${current} / ${last}`}
        </span>

        <button
          type="button"
          onClick={() => setCurrent((c) => Math.min(last, c + 1))}
          disabled={current === last}
          aria-label={content.aria_label_16}
          className="inline-flex items-center gap-2 border border-clay-ink/25 bg-[#fbf4e7]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-clay-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-35"
        >{content.text_17}<span aria-hidden>&rarr;</span>
        </button>
        </div>
        <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-clay-ink/55">{content.text_18}</p>
        </div>
      </div>
    </section>
  );
}
