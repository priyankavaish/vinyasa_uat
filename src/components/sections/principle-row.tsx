import Image from "@/components/editorial/image";
import { Icon, type IconName } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";

export default function PrincipleRow({
  index,
  icon,
  title,
  body,
  image,
  imageAlt,
  reverse = false,
}: {
  index: number;
  icon: IconName;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
}) {
  const number = String(index).padStart(2, "0");

  return (
    <div className="border-t border-clay-ink/12 py-12 first:border-t-0 first:pt-0 sm:py-14">
      <div
        className={`grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <Reveal variant={reverse ? "right" : "left"}>
          <div className="flex items-start gap-5">
            <span
              aria-hidden
              className="select-none font-display italic text-[3.25rem] leading-none text-accent/25 sm:text-[4rem]"
            >
              {number}
            </span>
            <div className="pt-1.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/10 text-accent">
                <Icon name={icon} size={16} />
              </span>
              <h3 className="mt-3 font-display italic text-3xl leading-tight sm:text-[2.15rem]">{title}</h3>
              <p className="mt-4 max-w-xl leading-relaxed text-foreground-soft">{body}</p>
            </div>
          </div>
        </Reveal>

        <Reveal variant={reverse ? "left" : "right"} delay={80}>
          <div className="relative aspect-[16/10] overflow-hidden rounded-tl-[2.5rem] rounded-br-[2.5rem] shadow-[0_24px_50px_-28px_rgba(30,20,12,0.4)]">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
