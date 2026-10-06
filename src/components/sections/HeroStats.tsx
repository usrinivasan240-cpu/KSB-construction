import { stats } from "@/lib/content";

/**
 * Service-category strip directly under the hero.
 * Deliberately non-numeric — no invented figures, only real capability areas.
 */
export default function HeroStats() {
  return (
    <section
      aria-label="What we build"
      className="relative z-10 border-y border-bone/10 bg-ink-deep"
    >
      <div className="shell grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <article
            key={s.number}
            data-reveal
            className={`group relative flex h-full flex-col px-1 py-8 sm:px-6 sm:py-10 ${
              i > 0 ? "border-t border-bone/10 sm:border-t-0 lg:border-l" : ""
            } ${i === 1 ? "sm:border-l" : ""} ${
              i > 1 ? "sm:border-t lg:border-t-0" : ""
            }`}
          >
            <span className="block font-display text-[2.75rem] leading-none text-copper/35 transition-colors duration-500 group-hover:text-copper">
              {s.number}
            </span>
            <h3 className="mt-4 text-[0.95rem] font-semibold uppercase tracking-[0.16em] text-bone">
              {s.label}
            </h3>
            <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-mist-dim">
              {s.detail}
            </p>
            <div className="mt-auto pt-6" aria-hidden="true">
              <span className="accent-rule" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
