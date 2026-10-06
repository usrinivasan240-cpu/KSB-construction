"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const SEL_REVEAL = "[data-reveal]";
const SEL_LINE = "[data-reveal-line] > span";
const SEL_IMG = "[data-reveal-img]";

function showAll() {
  document
    .querySelectorAll<HTMLElement>(`${SEL_REVEAL}, ${SEL_LINE}, ${SEL_IMG}`)
    .forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.clipPath = "none";
    });
}

/**
 * Central scroll-triggered reveal engine.
 *
 * Markup contract (see globals.css for the resting states):
 *   data-reveal       → opacity 0 → 1, translateY(40px) → 0
 *   data-reveal-line  → per-line mask reveal (children <span>)
 *   data-reveal-img   → masked image scale(1.08) → scale(1)
 */
export default function RevealSystem() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) {
      document.documentElement.classList.add("no-motion");
      showAll();
      return;
    }

    let ctx: gsap.Context | undefined;

    try {
      ctx = gsap.context(() => {
        ScrollTrigger.batch(SEL_REVEAL, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 1.05,
              ease: "power3.out",
              stagger: 0.075,
              overwrite: true,
            }),
        });

        ScrollTrigger.batch(SEL_LINE, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              y: 0,
              duration: 1.15,
              ease: "expo.out",
              stagger: 0.085,
              overwrite: true,
            }),
        });

        ScrollTrigger.batch(SEL_IMG, {
          start: "top 92%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              scale: 1,
              duration: 1.5,
              ease: "power3.out",
              stagger: 0.06,
              overwrite: true,
            }),
        });
      });

      // Anchor for anything already on screen + assets that finish loading late
      ScrollTrigger.refresh();
      const t = window.setTimeout(() => ScrollTrigger.refresh(), 700);

      return () => {
        window.clearTimeout(t);
        ctx?.revert();
      };
    } catch {
      showAll();
      return () => ctx?.revert();
    }
  }, [pathname]);

  return null;
}
