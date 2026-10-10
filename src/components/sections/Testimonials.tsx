"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { testimonials } from "@/lib/content";

/**
 * Testimonial carousel (stacked crossfade).
 * Slides are layered in a single grid cell and crossfade — so the layout
 * never shows half-sliced text mid-transition. Height stays locked to the
 * tallest slide, so the card never jumps between reviews.
 * NOTE: entries in /src/content/testimonials.json are sample data — swap in
 * genuine client reviews before launch.
 */
export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  useEffect(() => {
    if (paused || count < 2) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), 7000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, count]);

  return (
    <section
      className="section-pad relative overflow-hidden bg-ink-deep"
      aria-labelledby="testimonials-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="shell relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* --------------------------------------------------- heading */}
          <div className="lg:col-span-4">
            <p className="eyebrow mb-6" data-reveal>
              <span className="mr-3 inline-block h-px w-8 bg-copper align-middle" />
              Testimonials
            </p>
            <h2 id="testimonials-heading" className="display-md text-bone">
              <span data-reveal-line className="block">
                <span>TRUSTED BY</span>
              </span>
              <span data-reveal-line className="block">
                <span className="text-copper-deep">OUR CLIENTS.</span>
              </span>
            </h2>

            <p className="label-xs mt-7 max-w-[30ch] leading-[1.9] text-mist-dim" data-reveal>
              Placeholder content — awaiting genuine reviews from completed
              KSB projects.
            </p>

            {/* controls */}
            <div className="mt-8 flex items-center gap-3" data-reveal>
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous testimonial"
                className="flex h-12 w-12 items-center justify-center border border-bone/20 text-bone transition-all duration-400 hover:border-copper hover:bg-copper hover:text-coal"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next testimonial"
                className="flex h-12 w-12 items-center justify-center border border-bone/20 text-bone transition-all duration-400 hover:border-copper hover:bg-copper hover:text-coal"
              >
                →
              </button>
              <span className="label-xs ml-2 text-mist-dim">
                <span className="text-copper">{String(index + 1).padStart(2, "0")}</span>
                <span className="mx-1">/</span>
                {String(count).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* ------------------------------------------------- carousel */}
          <div className="lg:col-span-8" data-reveal>
            <div className="relative overflow-hidden border border-bone/12 bg-ink-soft/60 p-7 backdrop-blur-sm sm:p-10">
              <span
                className="pointer-events-none absolute right-6 top-2 select-none font-display text-[7rem] leading-none text-bone/[0.06]"
                aria-hidden="true"
              >
                ”
              </span>

              <div className="relative grid min-h-[16rem] sm:min-h-[15rem]">
                {testimonials.map((item, i) => {
                  const active = i === index;
                  return (
                    <figure
                      key={item.id}
                      aria-hidden={!active}
                      className={`col-start-1 row-start-1 transition-all duration-700 ease-[var(--ease-arch)] ${
                        active
                          ? "visible relative z-10 translate-y-0 opacity-100"
                          : "invisible pointer-events-none translate-y-6 opacity-0"
                      }`}
                    >
                      <div
                        className="mb-6 flex gap-1 text-copper"
                        aria-label="Five star review"
                      >
                        {Array.from({ length: 5 }).map((_, s) => (
                          <span key={s} aria-hidden="true">
                            ★
                          </span>
                        ))}
                      </div>
                      <blockquote className="text-lg leading-relaxed text-bone/90 sm:text-xl">
                        “{item.quote}”
                      </blockquote>
                      <figcaption className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-bone/12 pt-6">
                        <span className="text-sm font-bold uppercase tracking-[0.18em] text-bone">
                          {item.name}
                        </span>
                        <span className="label-xs text-copper/70">{item.project}</span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>

              {/* dot indicators */}
              <div className="mt-7 flex gap-2">
                {testimonials.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show testimonial ${i + 1}`}
                    aria-current={i === index}
                    className={`h-1 transition-all duration-500 ${
                      i === index ? "w-12 bg-copper" : "w-6 bg-bone/20 hover:bg-bone/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
