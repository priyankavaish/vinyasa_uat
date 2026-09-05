import Image from "next/image";

/** Real bougainvillea vines from era-residence's own garden shot, swaying on
 *  a slow wind cycle (see .animate-sway in globals.css). Used once, on the
 *  About page only. */
export default function BougainvilleaCanopy() {
  return (
    <div className="relative h-72 w-full overflow-hidden sm:h-96" aria-hidden>
      <div className="animate-sway absolute inset-x-[-6%] top-[-6%] h-[130%] w-[112%]">
        <Image
          src="/images/floral-accent.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "80% 30%" }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  );
}
