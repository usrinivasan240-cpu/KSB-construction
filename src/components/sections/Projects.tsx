"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, prefersReducedMotion, isTouch } from "@/lib/gsap";
import { projects } from "@/lib/content";

/**
 * "BUILT WITH PURPOSE" — immersive project showcase.
 * Desktop: the gallery track is pinned and scrolled horizontally.
 * Mobile:  the same markup stacks vertically for thumb-friendly swiping.
 */
export default function Projects() {
  const wrap = useRef<HTMLDivElement | null>(null);
  const track = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = wrap.current;
    const row = track.current;
    if (!section || !row) return;

    // Touch devices and reduced-motion users get the plain vertical stack.
    if (prefersReducedMotion() || isTouch()) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const distance = () => Math.max(0, row.scrollWidth - window.innerWidth + 48);

      const tween = gsap.to(row, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.85,
          start: "top top",
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      return () => tween.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="projects" className="relative overflow-hidden bg-ink">
      {/* ------------------------------------------------------- heading */}
      <div className="shell pb-12 pt-24 sm:pb-16 sm:pt-32">
        <div className="flex flex-col gap-6 border-b border-bone/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-6" data-reveal>
              <span className="mr-3 inline-block h-px w-8 bg-copper align-middle" />
              Selected work
            </p>
            <h2 className="display-lg text-bone">
              <span data-reveal-line className="block">
                <span>BUILT WITH</span>
              </span>
              <span data-reveal-line className="block">
                <span className="text-copper-light">PURPOSE.</span>
              </span>
            </h2>
          </div>
          <p className="lead max-w-md !text-[0.95rem]" data-reveal>
            Every project starts with a brief, a site and a budget — and ends
            with a space that has to work for decades.
          </p>
        </div>
      </div>

      {/* --------------------------------------------------------- track */}
      <div
        ref={wrap}
        className="relative lg:h-[100svh] lg:overflow-hidden"
      >
        <div
          ref={track}
          className="flex flex-col gap-5 px-5 pb-6 sm:px-8 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-8 lg:px-[8vw] lg:pb-0"
        >
          {projects.map((p, i) => (
            <Link
              key={p.id}
              href={`/projects/${p.slug}`}
              data-cursor="project"
              data-reveal
              className="group relative block h-[68vh] min-h-[26rem] w-full shrink-0 overflow-hidden border border-bone/12 bg-ink-soft lg:h-[66vh] lg:w-[74vw] lg:max-w-[640px]"
            >
              {/* image */}
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={p.image}
                  alt={`${p.title} — ${p.type}`}
                  fill
                  sizes="(min-width:1024px) 640px, 100vw"
                  quality={80}
                  className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-arch)] group-hover:scale-[1.06]"
                />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,8,0.15)_0%,rgba(7,9,8,0.55)_55%,rgba(7,9,8,0.94)_100%)]" />

              {/* index + arrow */}
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6">
                <span className="font-display text-5xl leading-none text-bone/70 transition-colors duration-500 group-hover:text-copper-light">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="flex h-12 w-12 items-center justify-center border border-bone/30 bg-ink-deep/40 text-bone backdrop-blur-sm transition-all duration-500 group-hover:border-copper group-hover:bg-copper group-hover:text-ink"
                  aria-hidden="true"
                >
                  <span className="inline-block transition-transform duration-500 ease-[var(--ease-arch)] group-hover:translate-x-1">
                    ↗
                  </span>
                </span>
              </div>

              {/* meta */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <span className="accent-rule mb-5" aria-hidden="true" />
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="min-w-0">
                    <p className="label-xs mb-3 text-copper-light">{p.type}</p>
                    <h3 className="text-xl font-bold uppercase tracking-[0.06em] text-bone transition-transform duration-500 ease-[var(--ease-arch)] group-hover:translate-x-1.5 sm:text-2xl">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm uppercase tracking-[0.18em] text-mist-dim">
                      {p.location}
                    </p>
                  </div>
                  <span className="shrink-0 border border-bone/25 px-3 py-1.5 label-xs text-mist transition-colors duration-500 group-hover:border-copper group-hover:text-copper-light">
                    {p.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* scroll hint (desktop only) */}
        <div className="pointer-events-none absolute bottom-6 right-[8vw] z-10 hidden items-center gap-3 lg:flex">
          <span className="label-xs text-mist-dim">Scroll</span>
          <span className="block h-px w-24 bg-bone/20">
            <span className="block h-px w-1/2 bg-copper" />
          </span>
          <span className="text-copper" aria-hidden="true">
            →
          </span>
        </div>
      </div>
    </section>
  );
}
