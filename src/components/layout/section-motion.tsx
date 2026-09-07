"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/** One gentle entrance per section; heroes and reduced-motion users stay instant. */
export default function SectionMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const seen = new WeakSet<HTMLElement>();
    const animations = new Map<HTMLElement, Animation>();

    const finish = (element: HTMLElement) => {
      animations.get(element)?.cancel();
      animations.delete(element);
    };
    const observer = new IntersectionObserver((entries) => {
      let stagger = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        observer.unobserve(element);
        if (preference.matches || element.contains(document.activeElement)) continue;
        const animation = element.animate(
          [{ opacity: 0, translate: "0 12px" }, { opacity: 1, translate: "0 0" }],
          { duration: 650, delay: 90 + Math.min(stagger++, 3) * 50, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" },
        );
        animations.set(element, animation);
        animation.onfinish = () => finish(element);
      }
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });

    const register = () => {
      root.querySelectorAll<HTMLElement>("section").forEach((section) => {
        if (seen.has(section) || section.closest("[data-hero]") || section.parentElement?.closest("section")) return;
        seen.add(section);
        observer.observe(section);
      });
    };
    const showAll = () => {
      if (preference.matches) animations.forEach((_, element) => finish(element));
    };
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      animations.forEach((_, element) => {
        if (element.contains(event.target as Element)) finish(element);
      });
    };
    register();
    const mutations = new MutationObserver(register);
    mutations.observe(root, { childList: true, subtree: true });
    preference.addEventListener("change", showAll);
    root.addEventListener("focusin", onFocus);
    return () => {
      observer.disconnect();
      mutations.disconnect();
      preference.removeEventListener("change", showAll);
      root.removeEventListener("focusin", onFocus);
      animations.forEach((_, element) => finish(element));
    };
  }, [pathname]);

  return <main ref={ref} className="flex-1" data-section-motion>{children}</main>;
}
