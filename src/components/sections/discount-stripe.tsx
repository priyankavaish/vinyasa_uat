import Image from "next/image";
import vine2 from "@/app/assets/vine2.png";
import vine3 from "@/app/assets/vine3.png";
import { whatsappLink } from "@/lib/site";
import { Icon } from "../ui/icon";

export default function DiscountStripe() {
  return (
    <section className="bg-background px-5 py-10 sm:px-8 sm:py-12">
      <a
        href={whatsappLink("Hi! Is there any discount running right now?")}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative mx-auto grid max-w-7xl items-center gap-7 overflow-hidden rounded-[2rem] border border-[#ddcfbb] bg-[#f8f1e5] px-6 py-8 shadow-[0_1.5rem_4rem_rgba(82,57,37,0.12)] transition-shadow duration-300 hover:shadow-[0_2rem_5rem_rgba(82,57,37,0.17)] sm:px-10 lg:grid-cols-[9rem_1fr_auto] lg:gap-10 lg:px-14 lg:py-10"
      >
        <Image
          src={vine2}
          alt=""
          className="pointer-events-none absolute -left-12 -top-28 w-48 -rotate-12 opacity-[0.16] sm:w-60"
          aria-hidden="true"
        />
        <Image
          src={vine3}
          alt=""
          className="pointer-events-none absolute -bottom-40 -right-12 w-56 rotate-12 opacity-[0.10] sm:w-72"
          aria-hidden="true"
        />
        <span className="pointer-events-none absolute -bottom-28 -left-24 h-52 w-72 rotate-12 rounded-[50%] bg-[#c9713f]/20" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-24 -right-20 h-48 w-64 -rotate-12 rounded-[50%] bg-secondary/20" aria-hidden="true" />

        <span className="relative mx-auto grid h-28 w-28 place-items-center rounded-full border border-dashed border-[#8f3b31]/55 bg-[#fbf7ef]/90 text-[#8f3b31] shadow-[0_10px_30px_rgba(143,59,49,0.12)] lg:mx-0">
          <span className="grid h-20 w-20 place-items-center rounded-full border-2 border-[#8f3b31]/75">
            <Icon name="logo-whatsapp" size={38} />
          </span>
          <span className="absolute -left-2 top-1/2 h-px w-5 bg-[#8f3b31]/55" aria-hidden="true" />
          <span className="absolute -right-2 top-1/2 h-px w-5 bg-[#8f3b31]/55" aria-hidden="true" />
        </span>

        <span className="relative text-center lg:text-left">
          <span className="block text-[11px] font-bold uppercase tracking-[0.24em] text-secondary">Planning your stay?</span>
          <span className="mt-3 flex items-center justify-center gap-3 text-accent/55 lg:justify-start" aria-hidden="true">
            <span className="h-px w-16 bg-accent/35" />
            <Icon name="leaf-outline" size={14} />
            <span className="h-px w-16 bg-accent/35" />
          </span>
          <span className="mt-4 block font-display text-3xl italic leading-tight text-foreground sm:text-4xl lg:text-[2.65rem]">
            Ask us about current offers
          </span>
        </span>

        <span className="relative mx-auto inline-flex min-w-64 items-center justify-center gap-4 rounded-full bg-[#8f3b31] px-7 py-5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_rgba(143,59,49,0.28)] transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-[#743027] group-hover:shadow-[0_16px_34px_rgba(143,59,49,0.34)] lg:mx-0">
          <Icon name="logo-whatsapp" size={22} />
          Chat on WhatsApp
          <Icon name="arrow-forward-outline" size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </a>
    </section>
  );
}