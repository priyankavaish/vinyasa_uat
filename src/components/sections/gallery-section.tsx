
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_sections_gallery_section";
import { getEditorial } from "@/lib/editorial/server";
import Image from "@/components/editorial/image";
import SectionEyebrow from "../ui/section-eyebrow";
import { Reveal } from "../ui/reveal";
import { Parallax } from "../ui/parallax";
import { galleryPosts } from "@/lib/content";

export default async function GallerySection() {
  const content = await getEditorial("components/sections/gallery-section", editorialDefaults);

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">

      <Reveal variant="up" className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionEyebrow icon="camera-outline">{content.text_1}</SectionEyebrow>
          <h2 className="mt-3 max-w-[26ch] font-display text-4xl leading-tight">{content.text_2}</h2>
        </div>
        <a
          href={content.href_3}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs tracking-[0.08em] uppercase text-accent underline"
        >{content.text_4}</a>
      </Reveal>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {content.galleryPosts.map((post, i) => (
          <Reveal
            key={post.permalink}
            variant="up"
            delay={150 + (i % 4) * 80}
            className={i % 4 === 1 || i % 4 === 3 ? "sm:mt-8" : ""}
          >
            <Parallax enabled speed={i % 2 === 0 ? 0.06 : -0.06}>
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden border border-line"
              >
                <Image
                  src={post.image}
                  alt={post.caption}
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="p-3 text-xs leading-snug text-background">{post.caption}</p>
                </div>
              </a>
            </Parallax>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
