"use client";

import Image from "next/image";
import whiteLogo from "@/app/assets/white_logo.png";
import colorLogo from "@/app/assets/logo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./icon";
import { whatsappLink } from "@/lib/site";

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
    function getScrollPosition() {
      return Math.max(
        window.scrollY,
        document.documentElement.scrollTop,
        document.body.scrollTop,
      );
    }

    function onScroll() {
      setScrolled(getScrollPosition() > 1);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-all duration-500 ${scrolled ? "site-header--scrolled" : ""} ${
        transparent
          ? "border-b border-transparent"
          : "border-b border-black/10 shadow-[0_8px_30px_rgba(35,31,25,0.10)]"
      }`}
      style={{ backgroundColor: transparent ? "transparent" : "#ffffff" }}
    >
      <div className="site-header-inner mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link href="/" className="site-logo flex items-center gap-2.5" aria-label="Vinyasa Earth home">

          <Image
            src={transparent ? whiteLogo : colorLogo}
            alt=""
            width={42}
            height={42}
            className="rounded-full transition-opacity duration-300"
          />
        </Link>

        <ul
          className={`hidden items-center gap-8 text-xs font-semibold tracking-[0.12em] uppercase lg:flex ${
            transparent ? "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.65)]" : "text-black"
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

        <div className="flex items-center gap-3">
          <Link
            href="/book"
            className="hidden items-center justify-center px-5 py-3 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-all hover:-translate-y-0.5 hover:brightness-110 lg:inline-flex"
            style={{ backgroundColor: "#8f3b31", color: "#ffffff" }}
          >
            Book Your Stay
          </Link>
          <a
            href={whatsappLink("Hi! I'd like to know more about Vinyasa Earth.")}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden items-center justify-center gap-2 border px-4 py-3 text-xs !text-white font-semibold tracking-[0.1em] uppercase transition-all hover:-translate-y-0.5 hover:shadow-md lg:inline-flex ${
              transparent
                ? "border-white bg-transparent text-white hover:bg-white/10"
                : "border-[#6b7a5e] bg-[#6b7a5e] text-white hover:border-[#55644a] hover:bg-[#55644a]"
            }`}
          >
            <Icon name="logo-whatsapp" size={16} />
            Chat on WhatsApp
          </a>
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
              <a
                href={whatsappLink("Hi! I'd like to know more about Vinyasa Earth.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 bg-[#6b7a5e] px-5 py-3 font-semibold !text-white"
              >
                <Icon name="logo-whatsapp" size={18} />
                Chat on WhatsApp
              </a>
            </li>
            <li>
              <Link
                href="/book"
                onClick={() => setOpen(false)}
                className="inline-flex px-5 py-3 font-semibold text-white"
                style={{ backgroundColor: "#8f3b31", color: "#ffffff" }}
              >
                Book Your Stay
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
