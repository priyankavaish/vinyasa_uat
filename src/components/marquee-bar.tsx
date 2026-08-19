const ITEMS = [
  "Six eco mud-house cottages",
  "Artist Escape Program open for applications",
  "Corporate offsites & team retreats",
];

export default function MarqueeBar() {
  const loop = [...ITEMS, ...ITEMS];
  return (
    <div className="flex items-stretch border-y border-foreground/10 bg-foreground text-background">
      <div className="overflow-hidden">
        <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-0 py-3 motion-reduce:animate-none">
          {loop.map((item, i) => (
            <span key={i} className="px-7 text-xs tracking-[0.14em] uppercase text-background/85 whitespace-nowrap">
              {item} <span className="text-accent">·</span>
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
