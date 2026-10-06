"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { images } from "@/lib/assets";
import { finalCtaCopy } from "@/lib/content";
import { siteConfig, whatsappUrl } from "@/lib/site.config";

/** Full-bleed conversion block directly above the contact form. */
export default function FinalCta() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const media = el.querySelector("[data-cta-media]");
      if (media) {
        gsap.fromTo(
          media,
          { scale: 1.12, yPercent: -4 },
          {
            scale: 1,
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="noise-layer relative flex min-h-[92svh] items-center overflow-hidden bg-ink-deep"
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={images.cta}
          alt=""
          fill
          sizes="100vw"
          quality={80}
          className="object-cover"
          data-cta-media
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,8,0.94)_0%,rgba(7,9,8,0.72)_45%,rgba(7,9,8,0.96)_100%)]" />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-45" aria-hidden="true" />

      <div className="shell relative z-10 py-24 text-center">
        <p className="eyebrow mb-8 inline-flex items-center gap-3" data-reveal>
          <span className="inline-block h-px w-8 bg-copper" aria-hidden="true" />
          Let&apos;s begin
          <span className="inline-block h-px w-8 bg-copper" aria-hidden="true" />
        </p>

        <h2 className="display-xl mx-auto max-w-[15ch] text-bone">
          {finalCtaCopy.headline.map((line, i) => (
            <span key={line} data-reveal-line className="block">
              <span className={i === 2 ? "text-copper-light" : undefined}>{line}</span>
            </span>
          ))}
        </h2>

        <p className="lead mx-auto mt-8 max-w-2xl !text-bone/75" data-reveal>
          {finalCtaCopy.supporting}
        </p>

        <p className="tamil mx-auto mt-4 max-w-xl text-base !leading-relaxed text-copper-light/90" data-reveal>
          உங்கள் கனவு இல்லத்தை உருவாக்குவோம்.
        </p>

        <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4" data-reveal>
          <Link href="#contact" className="btn btn-primary sm:min-w-[16rem]">
            {finalCtaCopy.primary}
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          </Link>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn sm:min-w-[16rem]"
          >
            {finalCtaCopy.secondary}
            <span className="btn-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>

        <p className="label-xs mt-9 text-mist-dim" data-reveal>
          Or call{" "}
          <a href={siteConfig.phoneHref} className="text-bone hover:text-copper-light">
            {siteConfig.phoneDisplay}
          </a>
        </p>
      </div>
    </section>
  );
}
