"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { images } from "@/lib/assets";
import { credibilityStats, heroCopy } from "@/lib/content";

/** Line icons for the credibility stats card (stroke = currentColor). */
function StatIcon({ id, className = "" }: { id: string; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  } as const;
  if (id === "journey")
    return (
      <svg {...common} className={className}>
        <circle cx="12" cy="9" r="5" />
        <path d="M12 6.8l.9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2-1.4-1.4 2-.3z" />
        <path d="M9.2 13.4 7.5 21l4.5-2.4L16.5 21l-1.7-7.6" />
      </svg>
    );
  if (id === "experience")
    return (
      <svg {...common} className={className}>
        <path d="M4 15a8 8 0 0 1 5.2-7.5V5h5.6v2.5A8 8 0 0 1 20 15" />
        <line x1="2.5" y1="15" x2="21.5" y2="15" />
        <line x1="12" y1="5" x2="12" y2="11" />
      </svg>
    );
  if (id === "projects")
    return (
      <svg {...common} className={className}>
        <path d="M4 11.2 12 4l8 7.2" />
        <path d="M6 10v10h12V10" />
        <path d="M10.2 20v-5h3.6v5" />
      </svg>
    );
  return (
    <svg {...common} className={className}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
      <line x1="3.5" y1="10" x2="20.5" y2="10" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
      <circle cx="8" cy="14.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="16" cy="14.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Cinematic full-viewport hero.
 * Entrance sequence: image 105% → 100%, headline line-by-line, then CTAs,
 * credibility stats (with count-up) and the scroll cue. Everything is hidden
 * *by GSAP only*, so with JS disabled the copy is still fully readable.
 */
export default function Hero() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const lines = el.querySelectorAll<HTMLElement>("[data-hero-line]");
      const chrome = el.querySelectorAll<HTMLElement>("[data-hero-fade]");
      const media = el.querySelector<HTMLElement>("[data-hero-media]");

      const tl = gsap.timeline({ delay: 0.5 });

      tl.fromTo(
        media,
        { scale: 1.05 },
        { scale: 1, duration: 2.6, ease: "power2.out" },
        0,
      )
        .fromTo(
          el.querySelector("[data-hero-eyebrow]"),
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
          0.15,
        )
        .fromTo(
          lines,
          { yPercent: 108 },
          { yPercent: 0, duration: 1.25, stagger: 0.11, ease: "expo.out" },
          0.28,
        )
        .fromTo(
          chrome,
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.09, ease: "power3.out" },
          0.85,
        );

      // Credibility numbers count up after the headline lands.
      // Final values are already in the markup, so reduced-motion / no-JS
      // visitors see the true figures with no animation at all.
      el.querySelectorAll<HTMLElement>("[data-count]").forEach((node, k) => {
        const target = Number(node.dataset.count);
        if (!Number.isFinite(target)) return;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          delay: 1.05 + k * 0.12,
          ease: "power2.out",
          onUpdate: () => {
            node.textContent = String(Math.round(obj.v));
          },
        });
      });

      // Slow parallax drift on the background as the hero leaves the viewport
      gsap.to(media, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="home"
      className="noise-layer relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-ink-deep"
    >
      {/* ------------------------------------------------------ media layer */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={images.hero}
          alt="Completed KSB home in daylight — colourful modern elevation"
          fill
          priority
          sizes="100vw"
          quality={82}
          className="object-cover"
          data-hero-media
        />
      </div>
      {/* cinematic grading */}
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,11,16,0.9)_0%,rgba(6,11,16,0.55)_38%,rgba(6,11,16,0.85)_78%,rgba(6,11,16,0.97)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_20%,rgba(32,36,38,0.55)_0%,transparent_60%)]"
        aria-hidden="true"
      />
      {/* architectural vertical rules */}
      <div
        className="pointer-events-none absolute inset-0 hidden lg:block"
        aria-hidden="true"
      >
        <div className="shell h-full">
          <div className="grid h-full grid-cols-12">
            {Array.from({ length: 13 }).map((_, i) => (
              <div
                key={i}
                className="col-span-1 border-l border-bone/[0.055] last:border-r"
              />
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------- copy layer */}
      <div className="shell relative z-10 flex flex-1 flex-col justify-end pb-28 pt-[calc(var(--header-h)+2.5rem)] sm:pb-32">
        <p
          data-hero-eyebrow
          className="label-xs mb-5 flex flex-wrap items-center gap-2 !text-[0.5625rem] !tracking-[0.18em] text-bone/75 sm:gap-3 sm:!text-[0.625rem] sm:!tracking-[0.28em]"
        >
          <span className="inline-block h-px w-8 bg-copper align-middle" aria-hidden="true" />
          {heroCopy.eyebrow.map((part, i) => (
            <span key={part}>
              {i > 0 ? <span className="mx-3 text-copper">•</span> : null}
              {part}
            </span>
          ))}
        </p>

        <h1
          className="display-xl max-w-[16ch] text-bone"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {heroCopy.headline.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <span
                data-hero-line
                className={`block ${
                  i === heroCopy.headline.length - 1
                    ? "bg-gradient-to-r from-gilt via-copper to-copper-deep bg-clip-text text-transparent"
                    : ""
                }`}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-7 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <p
            data-hero-fade
            className="lead max-w-xl !text-[1.05rem] !leading-relaxed !text-bone/80"
          >
            {heroCopy.supporting}
            <span className="tamil mt-3 block text-[0.95rem] !leading-relaxed text-copper-light/90">
              உங்கள் கனவு இல்லத்தை உருவாக்குவோம்.
            </span>
          </p>

          <div data-hero-fade className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link href="#contact" className="btn btn-primary rounded-lg">
              {heroCopy.primaryCta}
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <Link href="#projects" className="btn rounded-lg">
              <span aria-hidden="true" className="text-[0.65rem] text-copper">
                ▶
              </span>
              {heroCopy.secondaryCta}
            </Link>
          </div>
        </div>

        {/* -------------------------------------- credibility statistics */}
        <div
          data-hero-fade
          className="relative mt-9 overflow-hidden rounded-2xl border border-copper/35 bg-ink-deep/70 backdrop-blur-md sm:mt-10"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center opacity-[0.16]"
            style={{ backgroundImage: `url(${images.blueprint})` }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,11,16,0.55)_0%,rgba(6,11,16,0.9)_100%)]"
          />
          <dl
            aria-label="KSB Constructions track record"
            className="relative grid grid-cols-2 gap-x-6 gap-y-8 px-6 py-7 sm:px-8 lg:grid-cols-4"
          >
            {credibilityStats.map((s) => (
              <div
                key={s.id}
                className="flex items-start gap-4 max-lg:[&:nth-child(n+3)]:border-t max-lg:[&:nth-child(n+3)]:border-bone/10 max-lg:[&:nth-child(n+3)]:pt-6 lg:border-l lg:border-copper/25 lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
              >
                <StatIcon
                  id={s.id}
                  className="mt-1 h-9 w-9 shrink-0 text-copper sm:h-10 sm:w-10"
                />
                <div className="flex min-w-0 flex-col">
                  <dt className="label-xs order-2 mt-2 leading-[1.7] text-bone/65">
                    {s.label}
                  </dt>
                  <dd className="order-1 font-display text-4xl leading-none text-copper sm:text-5xl">
                    {s.prefix ? (
                      <span className="mr-2 align-middle text-[0.65rem] font-bold tracking-[0.24em]">
                        {s.prefix}
                      </span>
                    ) : null}
                    <span data-count={s.countUp ? s.value : undefined}>{s.value}</span>
                    {s.suffix ? <span>{s.suffix}</span> : null}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ------------------------------------------------ scroll cue */}
      <div data-hero-fade className="absolute inset-x-0 bottom-5 z-10">
        <div className="shell flex justify-center">
          <a
            href="#about"
            aria-label={heroCopy.scroll}
            className="group flex flex-col items-center gap-2.5"
          >
            <span
              aria-hidden="true"
              className="relative flex h-9 w-[1.4rem] justify-center rounded-full border border-bone/30 pt-2"
            >
              <span className="h-1.5 w-1 animate-bounce rounded-full bg-copper" />
            </span>
            <span className="label-xs text-mist-dim transition-colors duration-300 group-hover:text-copper-light">
              {heroCopy.scroll}
            </span>
            <span
              aria-hidden="true"
              className="h-2 w-2 rotate-45 border-b border-r border-copper"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
