import Image from "next/image";

/** Shows any photo (landscape or portrait) in a fixed frame without cropping or
 *  distortion: a blurred, darkened copy fills the frame as a backdrop and the
 *  real image sits fully visible (object-contain) on top. */
export default function MediaFrame({
  src,
  alt,
  className = "",
  sizes = "(min-width: 768px) 50vw, 100vw",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        quality={75}
        sizes={sizes}
        className="scale-125 object-cover blur-2xl brightness-[0.8] saturate-[1.05]"
      />
      <div className="absolute inset-0 bg-black/15" />
      <Image src={src} alt={alt} fill quality={90} sizes={sizes} className="object-contain" />
    </div>
  );
}
