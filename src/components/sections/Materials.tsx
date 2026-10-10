"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, isTouch, prefersReducedMotion } from "@/lib/gsap";
import { materials, materialsCopy } from "@/lib/content";

/**
 * "DETAILS MAKE THE DIFFERENCE" — cinematic material & craft band.
 * Close-up imagery drifts slowly against the scroll for depth.
 */
export default function Materials() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion() || isTouch()) return;

    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>("[data-tile-img]").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: img.closest("figure") || el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="section-pad relative overflow-hidden bg-ink">
      {/* tiles are the texture — backdrop stays clean */}

      <div className="shell relative">
        {/* ------------------------------------------------------ heading */}
        <div className="grid gap-8 border-b border-bone/10 pb-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6" data-reveal>
              <span className="mr-3 inline-block h-px w-8 bg-copper align-middle" />
              {materialsCopy.label}
            </p>
            <h2 className="display-lg text-bone">
              {materialsCopy.headline.map((line, i) => (
                <span key={line} data-reveal-line className="block">
                  <span className={i === 2 ? "text-copper-deep" : undefined}>
                    {line}
                  </span>
                </span>
              ))}
            </h2>
          </div>
          <p className="lead self-end !text-[0.95rem] lg:col-span-5" data-reveal>
            {materialsCopy.body}
          </p>
        </div>

        {/* -------------------------------------------------------- tiles */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
          {materials.map((m, i) => (
            <figure
              key={m.id}
              data-reveal
              data-cursor="image"
              className={`group relative overflow-hidden border border-bone/12 bg-ink-soft ${
                i % 3 === 1 ? "md:mt-8" : ""
              }`}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#0A1118]">
                <div
                  className="absolute left-0 right-0 overflow-hidden"
                  style={{ top: "-9%", bottom: "-9%" }}
                  data-tile-img
                >
                  <Image
                    src={m.image}
                    alt={`${m.title} — ${m.subtitle}`}
                    fill
                    sizes="(min-width:1280px) 16vw, (min-width:768px) 33vw, 50vw"
                    quality={80}
                    className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-arch)] group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,11,16,0.1)_0%,rgba(6,11,16,0.86)_100%)]" />
              </div>

              <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <span className="block h-px w-8 origin-left scale-x-100 bg-copper transition-transform duration-500 group-hover:scale-x-[3]" />
                <h3 className="mt-3 text-sm font-bold uppercase tracking-[0.2em] text-[#F6EFE3] sm:text-base">
                  {m.title}
                </h3>
                <p className="mt-1 text-[0.7rem] uppercase tracking-[0.14em] text-[#B7AB96]">
                  {m.subtitle}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
