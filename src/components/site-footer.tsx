import Link from "next/link";
import { ADDRESS, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-16 bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 border-b border-background/15 pb-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-xl">Vinyasa Earth</p>
            <p className="mt-3 max-w-[28ch] text-sm text-background/70">{ADDRESS}</p>
          </div>
          <div>
            <p className="eyebrow !text-background/60">Visit</p>
            <ul className="mt-3 space-y-2 text-sm text-background/80">
              <li><Link href="/stays">Stays</Link></li>
              <li><Link href="/events">Events &amp; Retreats</Link></li>
              <li><Link href="/corporate">Corporate Offsites</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow !text-background/60">Reach us</p>
            <ul className="mt-3 space-y-2 text-sm text-background/80">
              <li><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
              <li><a href={`tel:${CONTACT_PHONE_DISPLAY.replace(/\s/g, "")}`}>{CONTACT_PHONE_DISPLAY}</a></li>
              <li><Link href="/admin/login" className="text-background/40">Admin</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 pt-6 text-xs text-background/50">
          <span>© {new Date().getFullYear()} Vinyasa Earth</span>
          <span>Instagram · @vinyasa.earth</span>
        </div>
        <p className="pt-4 text-center sm:text-left">
          <a href="https://lexabiz.in" target="_blank" rel="noopener noreferrer" className="lexabiz-credit">
            Crafted by Lexabiz.in
          </a>
        </p>
      </div>
    </footer>
  );
}
