import { Icon } from "@/components/ui/icon";

const ITEMS = [
  "Six hand-built mud cottages",
  "Artist Escape applications open",
  "Corporate offsites and team retreats",
];

export default function MarqueeBar() {
  const loop = [...ITEMS, ...ITEMS];

  return (
    <aside
      aria-label="Vinyasa Earth highlights"
      className="marquee-strip relative z-10 overflow-hidden border-y border-[#8f3b31] bg-[#302d24] text-[#fff1dc] shadow-[inset_0_1px_rgba(255,245,220,0.08),inset_0_-1px_rgba(0,0,0,0.28)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 20%, rgba(255,224,170,.24), transparent 24%), radial-gradient(circle at 78% 90%, rgba(66,88,54,.28), transparent 28%)",
        }}
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#302d24] to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#302d24] to-transparent sm:w-24" />

      <div className="marquee-track relative flex w-max items-center py-3.5 sm:py-4">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="flex shrink-0 items-center">
            <span className="px-6 font-display text-base tracking-[0.045em] text-[#fff1dc]/92 whitespace-nowrap sm:px-9 sm:text-lg">
              {item}
            </span>
            <span
              aria-hidden="true"
              className="grid h-7 w-7 place-items-center rounded-full border border-[#e4c995]/45 bg-[#fff1dc]/5 text-[#e4c995]"
            >
              <Icon name="leaf-outline" size={13} className="-rotate-45" />
            </span>
          </span>
        ))}
      </div>
    </aside>
  );
}
