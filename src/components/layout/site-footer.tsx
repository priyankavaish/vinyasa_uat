import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { ADDRESS, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "@/lib/site";

const exploreLinks = [
  { href: "/stays", label: "Stays" },
  { href: "/events", label: "Events & Retreats" },
  { href: "/corporate", label: "Corporate Offsites" },
  { href: "/about", label: "Our Story" },
] as const;

// Sourced from vinyasa.earth/frequent-links — the handful guests actually reach for.
const usefulLinks = [
  {
    label: "Check in",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSd8cvRcZ3jD1e--9ydBTe7K00nBEqFlfK09heSp0TUZGueTnw/viewform",
  },
  { label: "Make a payment", href: "https://razorpay.me/@vinyasaverse" },
  {
    label: "Schedule a call",
    href: "https://calendly.com/vinyasa-earth/connect_call",
  },
  { label: "Leave a Google review", href: "https://g.page/r/CZ31HyYgcIyDEBM/review" },
  {
    label: "Event details template",
    href: "https://docs.google.com/document/d/1MVugxj2JRDGTwBleAM3ysXOg15FWXMbB8SEVYKKC6o4/copy",
  },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/vinyasa-earth/" },
  { label: "YouTube", href: "https://www.youtube.com/@VinyasaEarth" },
] as const;

// Reference: vinyasa.earth/blogs
const blogLinks = [
  { label: "Settling In…", href: "https://www.vinyasa.earth/settling-in/" },
  { label: "The Shift", href: "https://www.vinyasa.earth/the-shift/" },
  { label: "The Real Hustle!", href: "https://www.vinyasa.earth/the-real-hustle/" },
  { label: "New Beginnings!", href: "https://www.vinyasa.earth/new-beginnings/" },
  { label: "Memories of Vinyasa", href: "https://www.vinyasa.earth/memories-of-vinyasa/" },
  {
    label: "Washing Your Own Dishes: A Practice in Presence",
    href: "https://www.vinyasa.earth/washing-your-own-dishes-at-vinyasa-earth/",
  },
] as const;

const BLOG_INDEX = "https://www.vinyasa.earth/blogs/";

export default function SiteFooter() {
  const phoneHref = CONTACT_PHONE_DISPLAY.replace(/\s/g, "");

  return (
    <footer className="relative isolate overflow-hidden pb-[env(safe-area-inset-bottom)] bg-[#302d24] text-[#f8eedc]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-36 h-80 w-80 rounded-full border border-[#d5bb87]/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full border border-[#d5bb87]/10"
      />
      <div className="h-px bg-gradient-to-r from-transparent via-[#d5bb87]/55 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 pb-7 pt-14 sm:px-8 sm:pt-20">
        <div className="grid gap-12 border-b border-[#f8eedc]/15 pb-14 lg:grid-cols-[1.35fr_0.7fr_1fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-3 text-[#d5bb87]">
              <span className="h-px w-9 bg-current" />
              <Icon name="leaf-outline" size={18} />
            </div>
            <p className="mt-5 font-display text-4xl leading-none sm:text-5xl">Vinyasa Earth</p>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#f8eedc]/68">
              A hand-built home for slow stays, creative practice, and meaningful gatherings in the
              quiet landscape of Rajasthan.
            </p>
            <Link
              href="/book"
              className="mt-8 inline-flex items-center gap-4 border-b border-[#d5bb87]/70 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f3dba9] transition-all hover:gap-6 hover:text-white"
            >
              Plan your stay
              <Icon name="arrow-forward-outline" size={15} />
            </Link>
          </div>

          <nav aria-label="Footer navigation">
            <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[#d5bb87]">Explore</p>
            <ul className="mt-5 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#f8eedc]/72 transition-colors hover:text-[#f3dba9]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[#d5bb87]">Find us</p>
            <p className="mt-5 max-w-[32ch] text-sm leading-6 text-[#f8eedc]/72">{ADDRESS}</p>
            <div className="mt-6 space-y-3 text-sm">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex w-fit items-center gap-3 text-[#f8eedc]/72 transition-colors hover:text-[#f3dba9]"
              >
                <Icon name="ribbon-outline" size={16} className="text-[#d5bb87]" />
                {CONTACT_EMAIL}
              </a>
              <a
                href={`tel:${phoneHref}`}
                className="flex w-fit items-center gap-3 text-[#f8eedc]/72 transition-colors hover:text-[#f3dba9]"
              >
                <Icon name="circle-outline" size={16} className="text-[#d5bb87]" />
                {CONTACT_PHONE_DISPLAY}
              </a>
              <a
                href="https://www.instagram.com/vinyasa.earth/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-3 text-[#f8eedc]/72 transition-colors hover:text-[#f3dba9]"
              >
                <Icon name="images-outline" size={16} className="text-[#d5bb87]" />
                @vinyasa.earth
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-10 border-b border-[#f8eedc]/15 py-12 sm:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[#d5bb87]">
              Useful Links
            </p>
            <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-1 xl:grid-cols-2">
              {usefulLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm text-[#f8eedc]/72 transition-colors hover:text-[#f3dba9]"
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className="text-[10px] text-[#d5bb87]/60 transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
                    >
                      &#8599;
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[#d5bb87]">
              Blogs
            </p>
            <ul className="mt-5 space-y-3">
              {blogLinks.map((post) => (
                <li key={post.href}>
                  <a
                    href={post.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#f8eedc]/72 transition-colors hover:text-[#f3dba9]"
                  >
                    {post.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={BLOG_INDEX}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-3 border-b border-[#d5bb87]/70 pb-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#f3dba9] transition-all hover:gap-5 hover:text-white"
            >
              Read the journal
              <Icon name="arrow-forward-outline" size={14} />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-[13px] uppercase tracking-[0.12em] text-[#f8eedc]/40 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Vinyasa Earth. Rooted in Rajasthan.</p>
          <div className="flex items-center gap-5">
            <Link href="/admin/login" className="transition-colors hover:text-[#f8eedc]/70">Admin</Link>
            <a
              href="https://lexabiz.in"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#f3dba9]"
            >
              Crafted by Lexabiz
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
