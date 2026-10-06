"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { images } from "@/lib/assets";
import { aboutCopy } from "@/lib/content";

/**
 * "WHO WE ARE" — editorial split layout over a subtle blueprint grid, with the
 * supporting image drifting at a slower rate than the page (parallax).
 */
export default function About() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((node) => {
        const amount = Number(node.dataset.parallax || 8);
        gsap.fromTo(
          node,
          { yPercent: amount * -0.5 },
          {
            yPercent: amount * 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: node.closest("section") || el,
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
    <section
      ref={root}
      id="about"
      className="section-pad noise-layer relative overflow-hidden bg-ink"
    >
      {/* blueprint drafting background */}
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="grid-bg-fine pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-40 top-1/4 h-[36rem] w-[36rem] rounded-full bg-forest/40 blur-[140px]"
        aria-hidden="true"
      />

      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* ------------------------------------------------------ left */}
          <div className="lg:col-span-6">
            <p className="eyebrow mb-8" data-reveal>
              <span className="mr-3 inline-block h-px w-8 bg-copper align-middle" />
              {aboutCopy.label}
            </p>

            <h2 className="display-lg !text-[clamp(2.15rem,4.1vw,4.35rem)] text-bone">
              {aboutCopy.headline.map((line, i) => (
                <span key={line} data-reveal-line className="block">
                  <span className={i === 3 ? "text-copper-light" : undefined}>
                    {line}
                  </span>
                </span>
              ))}
            </h2>

            <div className="mt-9 max-w-xl" data-reveal>
              <span className="accent-rule mb-8" aria-hidden="true" />
              <p className="lead">{aboutCopy.intro}</p>
              <p className="lead mt-5 !text-[0.95rem]">{aboutCopy.secondary}</p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="#projects" className="btn !px-7 !py-4">
                  View our work
                  <span className="btn-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------- right */}
          <div className="lg:col-span-6 lg:col-start-7 xl:col-span-6 xl:col-start-7">
            {/* framed image with slow parallax */}
            <div className="mask-reveal relative overflow-hidden">
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-bone/12">
                <Image
                  src={images.about}
                  alt="Structural frame under construction"
                  fill
                  sizes="(min-width:1024px) 50vw, 100vw"
                  quality={80}
                  className="object-cover"
                  data-parallax="10"
                  data-reveal-img
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(200deg,transparent_35%,rgba(7,9,8,0.75)_100%)]" />
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 border-t border-bone/15 bg-ink-deep/70 p-5 backdrop-blur-sm">
                  <div>
                    <p className="label-xs text-copper">Trichy • Tamil Nadu</p>
                    <p className="mt-1.5 text-sm text-bone/85">
                      Planning • Execution • Finishing
                    </p>
                  </div>
                  <span className="font-display text-4xl leading-none text-bone/25">
                    KSB
                  </span>
                </div>
              </div>
            </div>

            {/* capability list */}
            <ul className="mt-8 divide-y divide-bone/10 border-y border-bone/10">
              {aboutCopy.points.map((p, i) => (
                <li key={p.title} className="group flex gap-5 py-4" data-reveal>
                  <span className="label-xs w-8 shrink-0 pt-1.5 text-copper/60 transition-colors duration-400 group-hover:text-copper">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-bone">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-mist-dim">
                      {p.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
