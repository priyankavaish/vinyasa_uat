"use client";
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_layout_site_header";
import { useEditorial } from "@/components/editorial/provider";


import Link from "next/link";
import Image from "@/components/editorial/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "../ui/icon";

const NAV_LINKS = [
  { href: "/about", label: "The Vinyasa Way" },
  { href: "/stays", label: "Stays" },
  { href: "/artist-escape", label: "For the Artists" },
  { href: "/events", label: "Events & Retreats" },
  { href: "/volunteering", label: "Volunteering" },
  { href: "/contact", label: "Contact" },
];

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

// Routes whose first viewport is a full-bleed photo hero — nav rides
// transparent over the image on these, like villaskamezi/era-residence.
// Everywhere else (forms, admin) there's no photo to sit on, so it's solid.
const HERO_PHOTO_ROUTES = [/^\/$/, /^\/about$/, /^\/book$/, /^\/artist-escape$/];

export default function SiteHeader() {
  const content = useEditorial("components/layout/site-header", editorialDefaults);

  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const logoWrapRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // usePathname() has intermittently returned a stale/empty value on the
  // very first client render in production (a real, reproducible race, not
  // just an SSR quirk — confirmed by re-testing the same URL repeatedly).
  // Reading window.location.pathname directly in the render body instead is
  // synchronous and always correct on the client.
  const routerPathname = usePathname() || "/";
  const pathname = typeof window !== "undefined" ? window.location.pathname || "/" : routerPathname;
  const overHero = HERO_PHOTO_ROUTES.some((re) => re.test(pathname));
  const transparent = overHero && !scrolled && !open;

  // On Vercel's production runtime (not reproducible in a local `next build`
  // + `next start`), React was silently accepting the hydration mismatch
  // this component produces (SSR always renders "solid", since `window`
  // doesn't exist server-side) WITHOUT ever patching the real DOM node's
  // `data-transparent`, background or border-related attributes to match —
  // and every later re-render bailed out because React's own internal
  // snapshot already (incorrectly) matched the intended value. Setting them
  // imperatively via a ref bypasses that reconciliation entirely, so the
  // header is guaranteed correct regardless of what React's declarative
  // pass did or didn't commit to the DOM.
  useEffect(() => {
    const el = headerRef.current;
    if (el) {
      el.setAttribute("data-transparent", transparent ? "true" : "false");
      el.style.backgroundColor = transparent ? "transparent" : "#ffffff";
      el.classList.toggle("border-transparent", transparent);
      el.classList.toggle("border-black/10", !transparent);
      el.classList.toggle("shadow-[0_8px_30px_rgba(35,31,25,0.10)]", !transparent);
    }
    const nav = navRef.current;
    if (nav) {
      nav.classList.toggle("text-white", transparent);
      nav.classList.toggle("drop-shadow-[0_1px_4px_rgba(0,0,0,0.65)]", transparent);
      nav.classList.toggle("text-black", !transparent);
    }
    const logoWrap = logoWrapRef.current;
    if (logoWrap) {
      logoWrap.classList.toggle("shadow-[0_2px_12px_rgba(0,0,0,0.4),0_0_22px_6px_rgba(255,255,255,0.35)]", transparent);
      logoWrap.classList.toggle("shadow-[0_0_14px_2px_rgba(255,255,255,0.45)]", !transparent);
    }
  }, [transparent]);

  useEffect(() => {
    // A hard refresh can land the browser back at its last scroll offset
    // (scroll restoration), which makes the header render "scrolled" for a
    // frame on a page that should open transparent over the hero photo.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    function getScrollPosition() {
      return Math.max(
        window.scrollY,
        document.documentElement.scrollTop,
        document.body.scrollTop,
      );
    }

    function onScroll() {
      // A small threshold (not >1px) so a layout shift from the hero image
      // or video finishing its load can't falsely flip the header solid.
      setScrolled(getScrollPosition() > 24);
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

  const linkClass = `underline decoration-transparent underline-offset-4 transition-colors ${
    transparent ? "hover:decoration-background" : "hover:text-accent hover:decoration-accent"
  }`;
  const activeClass = transparent
    ? "text-white !decoration-white decoration-2 underline-offset-[6px]"
    : "text-accent !decoration-[#8f3b31] decoration-2 underline-offset-[6px]";

  return (
    <header
      ref={headerRef}
      data-menu-open={open ? "true" : "false"}
      data-transparent={transparent ? "true" : "false"}
      data-mounted={mounted ? "true" : "false"}
      className={`fixed top-0 z-40 w-full transition-all duration-500 ${scrolled ? "site-header--scrolled" : ""} ${
        transparent
          ? "border-b border-transparent"
          : "border-b border-black/10 shadow-[0_8px_30px_rgba(35,31,25,0.10)]"
      }`}
      style={{ backgroundColor: transparent ? "transparent" : "#ffffff" }}
    >
      <div className="site-header-inner mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-2.5 sm:px-8">
        <Link
          href={content.href_5}
          aria-label={content.aria_label_6}
          className="flex items-center justify-self-start"
        >
          <span
            ref={logoWrapRef}
            className={`grid place-items-center rounded-full bg-white p-0.5 ring-1 ring-white/70 transition-all duration-500 ${
              transparent ? "shadow-[0_2px_12px_rgba(0,0,0,0.4),0_0_22px_6px_rgba(255,255,255,0.35)]" : "shadow-[0_0_14px_2px_rgba(255,255,255,0.45)]"
            }`}
          >
            <Image
              src={content.src_7}
              alt={content.alt_8}
              width={60}
              height={60}
              priority
              className="h-[3.25rem] w-[3.25rem]"
            />
          </span>
        </Link>

        <ul
          ref={navRef}
          className={`hidden items-center justify-center gap-6 text-xs font-semibold tracking-[0.12em] uppercase lg:flex ${
            transparent ? "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.65)]" : "text-black"
          }`}
        >
          {content.NAV_LINKS.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{ fontSize: "0.8rem" }}
                  aria-current={active ? "page" : undefined}
                  className={`${linkClass} ${active ? activeClass : ""}`}
                >
                  {link.href === "/artist-escape" ? "For the Artists" : link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="col-start-3 flex shrink-0 items-center justify-self-end gap-3 lg:col-start-3">
          <Link
            href={content.href_11}
            className="hidden items-center justify-center px-5 py-2.5 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-all hover:-translate-y-0.5 hover:brightness-110 lg:inline-flex"
            style={{ backgroundColor: "#8f3b31", color: "#ffffff", fontSize: "0.8rem" }}
          >{content.text_12}</Link>
          <button
            type="button"
            aria-expanded={open}
            aria-label={content.aria_label_13}
            className="menu-toggle grid h-12 w-12 place-items-center lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{content.text_14}</span>
            <Icon
              name={open ? "close-outline" : "menu-outline"}
              size={28}
              className={transparent ? "text-white" : "text-accent"}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav className="mobile-nav px-5 py-5 lg:hidden">
          <ul className="flex flex-col gap-4 text-sm tracking-[0.08em] uppercase text-foreground">
            {content.NAV_LINKS.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                  style={{ fontSize: "0.8rem" }}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={
                      active
                        ? "font-semibold text-accent underline decoration-2 decoration-[#8f3b31] underline-offset-4"
                        : ""
                    }
                  >
                    {link.href === "/artist-escape" ? "For the Artists" : link.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href={content.href_20}
                onClick={() => setOpen(false)}
                className="inline-flex px-5 py-3 font-semibold text-white"
                style={{ backgroundColor: "#8f3b31", color: "#ffffff", fontSize: "0.8rem" }}
              >{content.text_21}</Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
