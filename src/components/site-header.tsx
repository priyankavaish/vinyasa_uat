"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./icon";

const NAV_LINKS = [
  { href: "/stays", label: "Stays" },
  { href: "/events", label: "Events & Retreats" },
  { href: "/corporate", label: "Corporate" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Routes whose first viewport is a full-bleed photo hero — nav rides
// transparent over the image on these, like villaskamezi/era-residence.
// Everywhere else (forms, admin) there's no photo to sit on, so it's solid.
const HERO_PHOTO_ROUTES = [/^\/$/, /^\/stays(\/|$)/, /^\/events(\/|$)/, /^\/corporate$/, /^\/about$/];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() ?? "/";
  const overHero = HERO_PHOTO_ROUTES.some((re) => re.test(pathname));
  const transparent = overHero && !scrolled && !open;

  useEffect(() => {
    function onScroll() {
      const threshold = overHero ? window.innerHeight * 0.88 : 48;
      setScrolled(window.scrollY > threshold);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [overHero]);

  useEffect(() => {
    const threshold = overHero ? window.innerHeight * 0.88 : 48;
    setScrolled(window.scrollY > threshold);
  }, [pathname, overHero]);

  return (
    <header
      className="fixed top-0 z-40 w-full bg-transparent transition-all duration-500"
    >
      <div className="site-header-inner mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link href="/" className="site-logo flex items-center gap-2.5" aria-label="Vinyasa Earth home">
          <Image src="/images/logo.png" alt="" width={42} height={42} className="rounded-full" />
        </Link>

        <ul
          className={`hidden items-center gap-8 text-xs font-medium tracking-[0.12em] uppercase lg:flex ${
            transparent ? "text-background/90" : "text-foreground-soft"
          }`}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`underline decoration-transparent underline-offset-4 transition-colors ${
                  transparent ? "hover:decoration-background" : "hover:text-accent hover:decoration-accent"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-expanded={open}
            aria-label="Toggle menu"
            className={`menu-toggle grid h-10 w-10 place-items-center rounded-full border lg:hidden ${
              transparent ? "border-background/50" : "border-line"
            }`}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <Icon name={open ? "close-outline" : "menu-outline"} size={18} className={transparent ? "text-background" : "text-foreground"} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="mobile-nav border-t border-line bg-background px-5 py-4 lg:hidden">
          <ul className="flex flex-col gap-4 text-sm tracking-[0.08em] uppercase text-foreground-soft">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/book" onClick={() => setOpen(false)} className="btn btn-book-stay inline-flex">
                Book a Stay
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
