"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { processSteps } from "@/lib/content";

/**
 * "FROM IDEA TO REALITY" — five-step timeline.
 * The copper line draws itself with scroll progress and each step lights up
 * as it reaches the reading line.
 */
export default function Process() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const fill = el.querySelector<HTMLElement>(".timeline-fill");
    const steps = Array.from(el.querySelectorAll<HTMLElement>("[data-step]"));

    if (prefersReducedMotion()) {
      if (fill) fill.style.transform = "scaleY(1)";
      steps.forEach((s) => (s.dataset.active = "true"));
      return;
    }

    const ctx = gsap.context(() => {
      if (fill) {
        gsap.to(fill, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el.querySelector("[data-timeline]"),
            start: "top 62%",
            end: "bottom 78%",
            scrub: 0.6,
          },
        });
      }

      steps.forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 64%",
          end: "bottom 42%",
          onEnter: () => (step.dataset.active = "true"),
          onEnterBack: () => (step.dataset.active = "true"),
          onLeaveBack: () => (step.dataset.active = "false"),
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="process"
      className="section-pad relative overflow-hidden bg-ink-deep"
    >
      {/* timeline carries the detailing here — no backdrop texture */}
      <div
        className="pointer-events-none absolute right-[-10rem] top-10 h-[30rem] w-[30rem] rounded-full bg-copper/10 blur-[150px]"
        aria-hidden="true"
      />

      <div className="shell relative">
        <div className="mb-14 grid gap-6 border-b border-bone/10 pb-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6" data-reveal>
              <span className="mr-3 inline-block h-px w-8 bg-copper align-middle" />
              How we work
            </p>
            <h2 className="display-lg text-bone">
              <span data-reveal-line className="block">
                <span>FROM IDEA</span>
              </span>
              <span data-reveal-line className="block">
                <span className="text-copper-deep">TO REALITY.</span>
              </span>
            </h2>
          </div>
          <p className="lead self-end !text-[0.95rem] lg:col-span-4 lg:col-start-9" data-reveal>
            Five disciplined stages. Nothing starts on site that has not been
            resolved on paper first.
          </p>
        </div>

        {/* ------------------------------------------------------ timeline */}
        <div data-timeline className="relative pl-8 sm:pl-14">
          <div className="timeline-track" aria-hidden="true" />
          <div className="timeline-fill" aria-hidden="true" />

          <ol className="space-y-10 sm:space-y-14">
            {processSteps.map((s) => (
              <li
                key={s.number}
                data-step
                data-reveal
                className="relative grid gap-4 sm:grid-cols-12 sm:gap-8"
              >
                {/* node */}
                <span
                  className="step-dot absolute -left-8 top-2 block h-3 w-3 rounded-full border border-bone/35 bg-ink-deep sm:-left-14 sm:top-3"
                  aria-hidden="true"
                />

                <div className="sm:col-span-3">
                  <span className="step-num font-display text-[3rem] leading-none text-bone/20 transition-all duration-700 sm:text-[3.75rem]">
                    {s.number}
                  </span>
                </div>

                <div className="sm:col-span-9">
                  <h3 className="step-title text-xl font-bold uppercase tracking-[0.14em] text-bone transition-colors duration-700 sm:text-2xl">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-mist-dim">
                    {s.description}
                  </p>
                  <span className="accent-rule mt-6 block max-w-md" aria-hidden="true" />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
