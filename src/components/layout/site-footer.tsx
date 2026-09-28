
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_layout_site_footer";
import { getEditorial } from "@/lib/editorial/server";
import Link from "next/link";
import SectionWave from "@/components/ui/section-wave";
import { Icon } from "@/components/ui/icon";
import { ADDRESS, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "@/lib/site";

const exploreLinks = [
  { href: "/stays", label: "Stays" },
  { href: "/events", label: "Events & Retreats" },
  { href: "/volunteering", label: "Corporate Offsites" },
  { href: "/about", label: "Our Story" },
  { href: "/useful-links", label: "Useful Links" },
  { href: "/blogs", label: "Blogs" },
] as const;

export default async function SiteFooter() {
  const content = await getEditorial("components/layout/site-footer", editorialDefaults);

  const phoneHref = content.CONTACT_PHONE_DISPLAY.replace(/\s/g, "");

  return (
    <>
    <SectionWave from="var(--wave-lead, transparent)" to="var(--footer-background)" variant="wave" className="h-8 sm:h-12" />
    <footer className="relative isolate overflow-hidden bg-[var(--footer-background)] pb-[env(safe-area-inset-bottom)] text-clay-ink">
      <div
        aria-hidden="true"
        className="footer-shape pointer-events-none absolute -right-32 -top-36 h-80 w-80 rounded-full border border-secondary/25"
      />
      <div
        aria-hidden="true"
        className="footer-shape pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full border border-secondary/15"
        style={{ animationDelay: "1.2s" }}
      />
      <div className="relative mx-auto max-w-7xl px-5 pb-5 pt-10 sm:px-8 sm:pt-14">
        <div className="grid gap-8 border-b border-clay-ink/15 pb-9 lg:grid-cols-[1.35fr_0.7fr_1fr] lg:gap-14">
          <div>
            <div className="flex items-center gap-3 text-secondary">
              <span className="h-px w-9 bg-current" />
              <Icon name="leaf-outline" size={18} />
            </div>
            <p className="mt-4 font-display text-4xl leading-none text-clay-ink sm:text-[2.75rem]">{content.text_1}</p>
            <p className="mt-4 max-w-md text-sm leading-6 text-clay-ink/85">{content.text_2}</p>
            <Link
              href={content.href_3}
              className="mt-6 inline-flex items-center gap-4 border-b border-secondary/60 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary-ink transition-all hover:gap-6 hover:text-accent"
            >{content.text_4}<span className="arrow-nudge"><Icon name="arrow-forward-outline" size={15} /></span>
            </Link>
          </div>

          <nav aria-label={content.aria_label_5}>
            <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-secondary">{content.text_6}</p>
            <ul className="mt-4 space-y-2.5">
              {content.exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-clay-ink/85 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-secondary">{content.text_7}</p>
            <p className="mt-4 max-w-[32ch] text-sm leading-6 text-clay-ink/85">{content.ADDRESS}</p>
            <div className="mt-4 space-y-2.5 text-sm">
              <a
                href={`mailto:${content.CONTACT_EMAIL}`}
                className="flex w-fit items-center gap-3 text-clay-ink/85 transition-colors hover:text-accent"
              >
                <Icon name="ribbon-outline" size={16} className="text-secondary" />
                {content.CONTACT_EMAIL}
              </a>
              <a
                href={`tel:${phoneHref}`}
                className="flex w-fit items-center gap-3 text-clay-ink/85 transition-colors hover:text-accent"
              >
                <Icon name="circle-outline" size={16} className="text-secondary" />
                {content.CONTACT_PHONE_DISPLAY}
              </a>
            </div>

            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary">Follow along</p>
            <div className="mt-3 flex items-center gap-3">
              <a
                href={content.href_8}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vinyasa Earth on Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-clay-ink/20 text-clay-ink/85 transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                <Icon name="logo-instagram" size={17} />
              </a>
              <a
                href={content.href_youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vinyasa Earth on YouTube"
                className="grid h-10 w-10 place-items-center rounded-full border border-clay-ink/20 text-clay-ink/85 transition-all hover:-translate-y-0.5 hover:border-[#cc2b26] hover:text-[#cc2b26]"
              >
                <Icon name="play-outline" size={17} />
              </a>
              <a
                href={`https://wa.me/${phoneHref.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Message Vinyasa Earth on WhatsApp"
                className="grid h-10 w-10 place-items-center rounded-full border border-clay-ink/20 text-clay-ink/85 transition-all hover:-translate-y-0.5 hover:border-[#25D366] hover:text-[#25D366]"
              >
                <Icon name="logo-whatsapp" size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-5 text-[13px] uppercase tracking-[0.12em] text-clay-ink/85">
          <p>{content.text_10}{new Date().getFullYear()}{content.text_11}</p>
        </div>
      </div>

      <div className="border-t border-clay-ink/10 bg-[#ddcaa9]">
        <p className="mx-auto max-w-7xl px-5 py-3 text-center text-xs font-medium tracking-[0.06em] text-clay-ink/85 sm:px-8">{content.text_12}{" "}
          <a
            href={content.href_13}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-secondary-ink transition-colors hover:text-accent"
          >{content.text_14}</a>
        </p>
      </div>
    </footer>
    </>
  );
}
