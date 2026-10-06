"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion, isTouch } from "@/lib/gsap";

/**
 * Lenis smooth scrolling wired into the GSAP ticker so ScrollTrigger and the
 * scroll position never drift apart.
 *
 * Disabled on touch devices and for users who prefer reduced motion — mobile
 * keeps native inertia scrolling for maximum performance.
 */
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Fallback lock for reduced-motion users (no Lenis instance exists).
    if (prefersReducedMotion()) {
      const onLock = (e: Event) => {
        document.body.style.overflow = (e as CustomEvent<boolean>).detail
          ? "hidden"
          : "";
      };
      window.addEventListener("ksb:lock", onLock as EventListener);
      return () => {
        window.removeEventListener("ksb:lock", onLock as EventListener);
        document.body.style.overflow = "";
      };
    }

    const lenis = new Lenis({
      duration: isTouch() ? 0.9 : 1.15,
      lerp: 0.09,
      smoothWheel: !isTouch(),
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;
    // Public hook (console/automation + third-party integrations)
    (window as unknown as { __ksbLenis?: Lenis }).__ksbLenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // In-page anchor navigation with smooth easing
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, {
        offset: -70,
        duration: 1.2,
      });
      if (id === "#main") (el as HTMLElement).focus?.();
    };

    document.addEventListener("click", onClick);

    // Open overlays (mobile menu) pause the smooth scroll loop
    const onLock = (e: Event) => {
      if ((e as CustomEvent<boolean>).detail) lenis.stop();
      else lenis.start();
    };
    window.addEventListener("ksb:lock", onLock as EventListener);

    // Recalculate once all imagery has settled
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("ksb:lock", onLock as EventListener);
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __ksbLenis?: Lenis }).__ksbLenis;
    };
  }, []);

  /**
   * Cross-page hash navigation (e.g. `/services` link from a project page →
   * `/#services`). Next handles the route change; we handle the landing scroll
   * so the fixed header never covers the target section.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash || hash === "#") return;
    const target = document.querySelector(hash) as HTMLElement | null;
    if (!target) return;

    const timer = window.setTimeout(() => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, { offset: -70, duration: 1.1 });
      } else {
        target.scrollIntoView({ block: "start" });
      }
    }, 200);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
