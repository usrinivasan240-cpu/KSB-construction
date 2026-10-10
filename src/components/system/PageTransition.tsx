"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { images } from "@/lib/assets";

/**
 * Premium page transition.
 *
 *   Entrance  → dark curtain lifts to reveal the site (~700ms)
 *   Internal navigation → dark KSB curtain covers, then lifts
 *
 * In-page hash links are intentionally excluded: Lenis handles those.
 */
export default function PageTransition() {
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const covered = useRef(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  /* ---------------------------------------------------------- animations -- */
  const play = (mode: "entrance" | "cover" | "reveal" | "both") => {
    const el = overlay.current;
    const lg = logo.current;
    if (!el || !lg) return;

    if (prefersReducedMotion()) {
      el.style.opacity = "0";
      el.style.visibility = "hidden";
      el.style.pointerEvents = "none";
      return;
    }

    tl.current?.kill();
    const t = gsap.timeline();
    tl.current = t;

    try {
      if (mode === "entrance") {
        // Dark screen + logo → curtain lifts to reveal the first page.
        t.set(el, { autoAlpha: 1, clipPath: "inset(0% 0 0% 0)" })
          .fromTo(lg, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.42, ease: "power2.out" })
          .to(lg, { opacity: 0, y: -10, duration: 0.28, ease: "power2.in" }, "+=0.12")
          .to(el, { clipPath: "inset(0% 0 100% 0%)", duration: 0.64, ease: "expo.inOut" }, "-=0.06");
      }

      if (mode === "cover" || mode === "both") {
        // Curtain drops over the screen, KSB logo present.
        t.set(el, { autoAlpha: 1, clipPath: "inset(100% 0 0% 0)" }).to(el, {
          clipPath: "inset(0% 0 0% 0)",
          duration: 0.42,
          ease: "power3.inOut",
        });
        t.fromTo(
          lg,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.36, ease: "power2.out" },
          "-=0.3",
        );
      }

      if (mode === "reveal") {
        // Logo out → curtain lifts → new page.
        t.to(lg, { opacity: 0, y: -10, duration: 0.26, ease: "power2.in" }, "+=0.2").to(
          el,
          { clipPath: "inset(0% 0 100% 0%)", duration: 0.62, ease: "expo.inOut" },
          "-=0.05",
        );
      }

      t.set(el, { autoAlpha: 0 }).set(lg, { opacity: 1, y: 0 });
    } catch {
      gsap.set(el, { autoAlpha: 0 });
    }
  };

  /* ------------------------------------------------- route change handling */
  useEffect(() => {
    if (first.current) {
      first.current = false;
      play("entrance");
      return;
    }
    if (covered.current) {
      covered.current = false;
      play("reveal");
    } else {
      play("both");
    }
  }, [pathname]);

  /* ------------------------------------- cover *before* the route swaps --- */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("/") || href.startsWith("//")) return;
      if (href.startsWith("#")) return;
      try {
        const next = new URL(a.href);
        if (next.pathname === window.location.pathname && next.search === window.location.search) return;
      } catch {
        return;
      }
      covered.current = true;
      play("cover");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <div
      ref={overlay}
      className="page-curtain fixed inset-0 z-[9000] flex items-center justify-center bg-[#0A1118]"
      style={{ clipPath: "inset(0% 0 0% 0)" }}
      aria-hidden
    >
      <noscript>
        <style>{`.page-curtain{display:none!important}`}</style>
      </noscript>
      <div ref={logo} className="flex flex-col items-center gap-6 px-6 text-center">
        <Image
          src={images.logo}
          alt="KSB Constructions"
          width={747}
          height={489}
          priority
          className="h-auto w-[150px] sm:w-[180px]"
        />
        <span className="label-xs text-[#A89D89]">நம்பிக்கை | தரம் | திறமை</span>
        <span className="h-px w-24 bg-copper/50" />
      </div>
    </div>
  );
}
