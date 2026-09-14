import Image from "next/image";

/** A single, uncropped photograph on a quiet background, in either orientation. */
export default function MediaFrame({
  src,
  alt,
  className = "",
  sizes = "(min-width: 1280px) 600px, (min-width: 900px) 50vw, 100vw",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden bg-clay-ink ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        quality={95}
        sizes={sizes}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}
