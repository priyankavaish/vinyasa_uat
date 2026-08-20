const ITEMS = [
  "Six eco mud-house cottages",
  "Artist Escape Program open for applications",
  "Corporate offsites & team retreats",
];

export default function MarqueeBar() {
  const loop = [...ITEMS, ...ITEMS];
  return (
    <div className="marquee-strip relative z-10 flex items-stretch overflow-hidden border-y border-foreground/10 bg-foreground text-background">
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="marquee-track flex w-max gap-0 py-3">
          {loop.map((item, i) => (
            <span key={i} className="px-7 text-xs tracking-[0.14em] uppercase text-background/85 whitespace-nowrap">
              {item} <span className="text-accent">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
