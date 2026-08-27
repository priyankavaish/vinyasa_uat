import Link from "next/link";
import { Icon } from "@/components/icon";
import { ADDRESS, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "@/lib/site";

const exploreLinks = [
  { href: "/stays", label: "Stays" },
  { href: "/events", label: "Events & Retreats" },
  { href: "/corporate", label: "Corporate Offsites" },
  { href: "/about", label: "Our Story" },
] as const;

export default function SiteFooter() {
  const phoneHref = CONTACT_PHONE_DISPLAY.replace(/\s/g, "");

  return (
    <footer className="relative isolate overflow-hidden bg-[#302d24] text-[#f8eedc]">
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
              quiet landscape of Amer.
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d5bb87]">Explore</p>
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d5bb87]">Find us</p>
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

        <div className="flex flex-col gap-4 pt-6 text-[11px] uppercase tracking-[0.12em] text-[#f8eedc]/40 sm:flex-row sm:items-center sm:justify-between">
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
