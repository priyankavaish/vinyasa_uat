import NextImage, { type ImageProps } from "next/image";
export type { ImageProps, StaticImageData } from "next/image";
/** CMS media may be removed or hosted externally; neither should break a page. */
export default function EditorialImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "src" in props.src ? props.src.src : props.src.default.src;
  if (!src) return null;
  const external = /^(https?:)?\/\//i.test(src);
  return <NextImage {...props} unoptimized={props.unoptimized || external} />;
}
