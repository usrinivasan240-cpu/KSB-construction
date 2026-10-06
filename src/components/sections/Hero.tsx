"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { images } from "@/lib/assets";
import { heroCopy } from "@/lib/content";

/**
 * Cinematic full-viewport hero.
 * Entrance sequence: image 105% → 100%, headline line-by-line, then CTAs and
 * the scroll cue. Everything is hidden *by GSAP only*, so with JS disabled the
 * copy is still fully readable.
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
          alt="Construction site at dusk — steel, concrete and scaffolding"
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
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,8,0.86)_0%,rgba(7,9,8,0.36)_38%,rgba(7,9,8,0.78)_78%,rgba(7,9,8,0.97)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_20%,rgba(15,26,20,0.55)_0%,transparent_60%)]"
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

        <h1 className="display-xl max-w-[16ch] text-bone">
          {heroCopy.headline.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <span
                data-hero-line
                className={`block ${i === 2 ? "text-copper-light" : ""}`}
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
            <Link href="#contact" className="btn btn-primary">
              {heroCopy.primaryCta}
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <Link href="#projects" className="btn">
              {heroCopy.secondaryCta}
              <span className="btn-arrow" aria-hidden="true">
                ↓
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ scroll cue */}
      <div data-hero-fade className="absolute inset-x-0 bottom-5 z-10">
        <div className="shell flex items-center justify-between border-t border-bone/12 pt-4">
          <a href="#about" className="group flex items-center gap-3">
            <span className="label-xs text-mist-dim transition-colors duration-300 group-hover:text-copper-light">
              {heroCopy.scroll}
            </span>
            <span
              className="relative flex h-6 w-4 items-start justify-center overflow-hidden"
              aria-hidden="true"
            >
              <span className="absolute h-4 w-px animate-[ksbDrip_1.9s_ease-in-out_infinite] bg-copper" />
            </span>
          </a>
          <span className="label-xs hidden text-mist-dim sm:block">
            Est. Trichy • Tamil Nadu
          </span>
        </div>
      </div>
    </section>
  );
}
