import Link from "next/link";
import { PageHero } from "@/components/sections/hero";
import SectionEyebrow from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Icon, type IconName } from "@/components/ui/icon";

export const revalidate = 300;

export const metadata = {
  title: "Useful Links",
  description:
    "Quick links for Vinyasa Earth guests and partners — check-in, payments, booking a call, reviews, and where to follow along.",
  alternates: { canonical: "/useful-links" },
};

type LinkItem = {
  label: string;
  href: string;
  note?: string;
  icon: IconName;
  external?: boolean;
};

const GROUPS: Array<{
  eyebrow: string;
  icon: IconName;
  heading: string;
  items: LinkItem[];
}> = [
  {
    eyebrow: "Before & during your stay",
    icon: "calendar-outline",
    heading: "Get set up",
    items: [
      {
        label: "Check in",
        href: "https://docs.google.com/forms/d/e/1FAIpQLSd8cvRcZ3jD1e--9ydBTe7K00nBEqFlfK09heSp0TUZGueTnw/viewform",
        note: "Share your arrival details with us",
        icon: "home-outline",
        external: true,
      },
      {
        label: "Make a payment",
        href: "https://razorpay.me/@vinyasaverse",
        note: "Secure payment via Razorpay",
        icon: "ribbon-outline",
        external: true,
      },
      {
        label: "Schedule a call",
        href: "https://calendly.com/vinyasa-earth/connect_call",
        note: "Book a time to talk to the team",
        icon: "people-outline",
        external: true,
      },
      {
        label: "Leave a Google review",
        href: "https://g.page/r/CZ31HyYgcIyDEBM/review",
        note: "Tell others about your time here",
        icon: "sparkles-outline",
        external: true,
      },
    ],
  },
  {
    eyebrow: "For hosts & partners",
    icon: "compass-outline",
    heading: "Planning an event",
    items: [
      {
        label: "Event details template",
        href: "https://docs.google.com/document/d/1MVugxj2JRDGTwBleAM3ysXOg15FWXMbB8SEVYKKC6o4/copy",
        note: "Copy the doc and fill in your programme",
        icon: "ribbon-outline",
        external: true,
      },
    ],
  },
  {
    eyebrow: "Around the site",
    icon: "leaf-outline",
    heading: "Explore Vinyasa",
    items: [
      { label: "The Vinyasa Way", href: "/about", icon: "compass-outline" },
      { label: "Stays", href: "/stays", icon: "home-outline" },
      { label: "Events & Retreats", href: "/events", icon: "calendar-outline" },
      { label: "Volunteering", href: "/corporate", icon: "people-outline" },
      { label: "Blogs", href: "/blogs", icon: "sparkles-outline" },
    ],
  },
  {
    eyebrow: "Follow along",
    icon: "images-outline",
    heading: "Social",
    items: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/vinyasa.earth/",
        icon: "images-outline",
        external: true,
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/vinyasa-earth/",
        icon: "circle-outline",
        external: true,
      },
      {
        label: "YouTube",
        href: "https://www.youtube.com/@VinyasaEarth",
        icon: "circle-outline",
        external: true,
      },
    ],
  },
];

function LinkRow({ item }: { item: LinkItem }) {
  const body = (
    <>
      <span className="flex min-w-0 items-center gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-accent/30 text-accent">
          <Icon name={item.icon} size={18} />
        </span>
        <span className="min-w-0">
          <span className="block font-display text-lg leading-tight text-foreground">
            {item.label}
          </span>
          {item.note && (
            <span className="mt-0.5 block text-xs leading-relaxed text-foreground-soft">
              {item.note}
            </span>
          )}
        </span>
      </span>
      <Icon
        name="arrow-forward-outline"
        size={16}
        className={`shrink-0 text-accent transition-transform group-hover:translate-x-1 ${
          item.external ? "-rotate-45" : ""
        }`}
      />
    </>
  );

  const className =
    "group flex items-center justify-between gap-4 border border-line bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_16px_40px_-24px_rgba(45,35,25,0.35)] sm:p-5";

  return item.external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
    </a>
  ) : (
    <Link href={item.href} className={className}>
      {body}
    </Link>
  );
}

export default function UsefulLinksPage() {
  return (
    <>
      <PageHero
        eyebrow="Quick links"
        title="Everything in one place"
        description="The handful of links guests and partners reach for most — check-in, payments, a call with the team, and the corners of Vinyasa Earth worth a wander."
        image="/seed/grounds-05.jpg"
        imageAlt="Garden path through the grounds at Vinyasa Earth"
        imagePosition="50% 55%"
      />

      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
        {GROUPS.map((group, i) => (
          <Reveal key={group.heading} variant="up" delay={(i % 3) * 80} className={i > 0 ? "mt-14" : ""}>
            <SectionEyebrow icon={group.icon}>{group.eyebrow}</SectionEyebrow>
            <h2 className="mt-3 font-display italic text-3xl leading-tight">{group.heading}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {group.items.map((item) => (
                <LinkRow key={item.label} item={item} />
              ))}
            </div>
          </Reveal>
        ))}
      </section>
    </>
  );
}
