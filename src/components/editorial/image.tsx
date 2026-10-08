import { plainText } from "@/lib/editorial/text";
﻿import NextImage, { type ImageProps } from "next/image";
export type { ImageProps, StaticImageData } from "next/image";

// Vercel Blob (where admin-uploaded photos now live, see the media-to-blob
// migration) is a well-behaved, Vercel-native CDN — safe to run through
// Next's image optimizer. Everything else external stays unoptimized: CMS
// content can point at arbitrary third-party hosts next/image hasn't been
// configured for, and at least one of those (a WordPress CDN) has been
// observed to break Next's local image-optimizer cache outright.
const OPTIMIZABLE_HOSTS = [/\.blob\.vercel-storage\.com$/];

/** CMS media may be removed or hosted externally; neither should break a page. */
export default function EditorialImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "src" in props.src ? props.src.src : props.src.default.src;
  if (!src) return null;
  const external = /^(https?:)?\/\//i.test(src);
  const optimizable = external && (() => {
    try {
      return OPTIMIZABLE_HOSTS.some((re) => re.test(new URL(src).hostname));
    } catch {
      return false;
    }
  })();
  return <NextImage {...props} alt={plainText(props.alt)} unoptimized={props.unoptimized || (external && !optimizable)} />;
}
