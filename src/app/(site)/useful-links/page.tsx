import SectionEyebrow from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Icon, type IconName } from "@/components/ui/icon";
import CopyField from "./copy-field";

export const revalidate = 300;

export const metadata = {
  title: "Useful Links",
  description:
    "The frequently-used links for Vinyasa Earth — check-in, payments, booking a call, reviews, plus bank and GST details.",
  alternates: { canonical: "/useful-links" },
};

type ActionLink = { label: string; href: string; note: string; icon: IconName };

const ACTIONS: ActionLink[] = [
  {
    label: "Check in",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSd8cvRcZ3jD1e--9ydBTe7K00nBEqFlfK09heSp0TUZGueTnw/viewform",
    note: "Share your arrival details",
    icon: "home-outline",
  },
  {
    label: "Make a payment",
    href: "https://razorpay.me/@vinyasaverse",
    note: "Pay securely via Razorpay",
    icon: "ribbon-outline",
  },
  {
    label: "Schedule a call",
    href: "https://calendly.com/vinyasa-earth/connect_call",
    note: "Book a time on Calendly",
    icon: "calendar-outline",
  },
  {
    label: "Leave a Google review",
    href: "https://g.page/r/CZ31HyYgcIyDEBM/review",
    note: "Rate your stay on Google",
    icon: "sparkles-outline",
  },
  {
    label: "Event details template",
    href: "https://docs.google.com/document/d/1MVugxj2JRDGTwBleAM3ysXOg15FWXMbB8SEVYKKC6o4/copy",
    note: "Google Doc — make a copy",
    icon: "compass-outline",
  },
];

const BANK = [
  { label: "Account name", value: "VINYASAVERSE PRIVATE LIMITED" },
  { label: "Account number", value: "925020041471810" },
  { label: "IFSC code", value: "UTIB0005901" },
  { label: "GST", value: "08AALCV7206K1ZV" },
];

export default function UsefulLinksPage() {
  return (
    <>
      <section className="border-b border-line bg-clay-surface px-5 pb-14 pt-28 text-center sm:px-8 sm:pb-20 sm:pt-36">
        <div className="mx-auto max-w-2xl">
          <SectionEyebrow icon="compass-outline" className="justify-center">
            Frequently used
          </SectionEyebrow>
          <h1 className="mt-3 font-display text-4xl italic leading-tight text-clay-ink sm:text-5xl">
            Useful links
          </h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-foreground-soft">
            The handful of links and details that come up again and again &mdash; pinned in one
            place for guests and partners.
          </p>
          <span aria-hidden="true" className="mx-auto mt-6 block h-[3px] w-16 rounded-full bg-accent" />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal variant="up">
          <SectionEyebrow icon="compass-outline">Quick actions</SectionEyebrow>
          <h2 className="mt-3 font-display text-3xl italic leading-tight text-clay-ink">
            Get things done
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {ACTIONS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 border border-line bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_16px_40px_-24px_rgba(45,35,25,0.35)] sm:p-5"
              >
                <span className="flex min-w-0 items-center gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-accent/30 text-accent">
                    <Icon name={item.icon} size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-lg leading-tight text-clay-ink">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-foreground-soft">
                      {item.note}
                    </span>
                  </span>
                </span>
                <Icon
                  name="arrow-forward-outline"
                  size={16}
                  className="-rotate-45 shrink-0 text-accent transition-transform group-hover:translate-x-1"
                />
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal variant="up" delay={120} className="mt-14">
          <SectionEyebrow icon="ribbon-outline">Bank &amp; tax details</SectionEyebrow>
          <h2 className="mt-3 font-display text-3xl italic leading-tight text-clay-ink">
            For direct transfers
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground-soft">
            Payments to Vinyasaverse Private Limited. Please share the reference with us after
            transferring.
          </p>
          <div className="mt-6 border border-line bg-surface px-5 py-2 sm:px-6">
            {BANK.map((row) => (
              <CopyField key={row.label} label={row.label} value={row.value} />
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
