"use client";

import { services } from "@/lib/content";

/**
 * "WHAT WE BUILD" — architectural grid of service panels.
 * Not ordinary rectangles: hairline grid, oversized index numbers, a copper
 * rule that expands on hover and a background image that fades up beneath the
 * type. Mobile falls back to a stacked card layout with a visible image.
 */
export default function Services() {
  return (
    <section
      id="services"
      className="section-pad relative overflow-hidden bg-ink-deep"
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />

      <div className="shell relative">
        {/* ------------------------------------------------------ heading */}
        <div className="mb-14 flex flex-col gap-6 border-b border-bone/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-6" data-reveal>
              <span className="mr-3 inline-block h-px w-8 bg-copper align-middle" />
              Our services
            </p>
            <h2 className="display-lg text-bone">
              <span data-reveal-line className="block">
                <span>WHAT WE</span>
              </span>
              <span data-reveal-line className="block">
                <span className="text-copper-light">BUILD</span>
              </span>
            </h2>
          </div>
          <p className="lead max-w-md !text-[0.95rem]" data-reveal>
            Six coordinated capabilities — from first drawing to final handover,
            delivered by one accountable team.
          </p>
        </div>

        {/* --------------------------------------------------------- grid */}
        <div className="grid border-t border-l border-bone/12 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.id}
              data-reveal
              data-cursor="image"
              className="group relative isolate flex min-h-[20rem] flex-col justify-between overflow-hidden border-b border-r border-bone/12 p-7 transition-transform duration-500 ease-[var(--ease-arch)] hover:z-10 sm:p-8"
            >
              {/* background image — faint on touch devices, full on hover (desktop) */}
              <div className="absolute inset-0 -z-10 opacity-[0.18] transition-opacity duration-700 ease-[var(--ease-arch)] sm:opacity-0 sm:group-hover:opacity-100">
                <div className="absolute inset-0 overflow-hidden">
                  <div
                    className="absolute inset-0 scale-110 bg-cover bg-center brightness-[0.42] grayscale-[28%] contrast-[0.92] transition-transform duration-[1.4s] ease-[var(--ease-arch)] group-hover:scale-100"
                    style={{ backgroundImage: `url(${s.image})` }}
                  />
                </div>
                <div className="absolute inset-0 bg-ink-deep/85" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,11,16,0.62)_0%,rgba(6,11,16,0.94)_100%)]" />
              </div>

              {/* top row: index + arrow */}
              <div className="relative flex items-start justify-between">
                <span className="font-display text-[4.5rem] leading-[0.8] text-bone/12 transition-all duration-500 group-hover:text-copper sm:text-[5.5rem]">
                  {s.number}
                </span>
                <span
                  className="mt-3 flex h-11 w-11 items-center justify-center border border-bone/20 text-bone transition-all duration-500 group-hover:border-copper group-hover:bg-copper group-hover:text-ink"
                  aria-hidden="true"
                >
                  <span className="inline-block transition-transform duration-500 ease-[var(--ease-arch)] group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>

              {/* bottom block */}
              <div className="relative mt-10">
                <span className="accent-rule mb-6" aria-hidden="true" />
                <h3 className="text-lg font-bold uppercase leading-tight tracking-[0.1em] text-bone transition-transform duration-500 ease-[var(--ease-arch)] group-hover:translate-x-1.5 sm:text-xl">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-mist-dim transition-colors duration-500 group-hover:text-mist">
                  {s.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                  {s.highlights.map((h) => (
                    <li
                      key={h}
                      className="label-xs text-copper/60 transition-colors duration-500 group-hover:text-copper-light"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
