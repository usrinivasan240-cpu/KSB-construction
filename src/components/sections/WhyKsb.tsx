import { whyReasons } from "@/lib/content";
import ElevationLines from "@/components/decor/ElevationLines";

/**
 * "WHY KSB?" — six reasons set in oversized type over a deep forest ground.
 */
export default function WhyKsb() {
  return (
    <section
      id="why"
      className="section-pad noise-layer forest-depth relative overflow-hidden bg-forest"
    >
      {/* faint elevation drafting over forest — no grid here */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(232,117,18,0.6),transparent)]"
        aria-hidden="true"
      />
      <ElevationLines className="pointer-events-none absolute -left-24 top-0 h-[24rem] w-auto text-[#F6F2EA] opacity-[0.06]" />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-[34rem] w-[34rem] rounded-full bg-copper/12 blur-[160px]"
        aria-hidden="true"
      />

      <div className="shell relative">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-6" data-reveal>
              <span className="mr-3 inline-block h-px w-8 bg-copper align-middle" />
              The difference
            </p>
            <h2 className="display-xl text-[#F6F2EA]">
              <span data-reveal-line className="block">
                <span>WHY</span>
              </span>
              <span data-reveal-line className="block">
                <span className="serif-accent !text-copper-light">KSB?</span>
              </span>
            </h2>
          </div>
          <p className="lead max-w-md !text-[0.95rem] !text-[#D8CFBC]" data-reveal>
            Because a building is only as good as the decisions made before the
            first brick is laid.
          </p>
        </div>

        <div className="grid border-t border-[#F6F2EA]/15 sm:grid-cols-2 xl:grid-cols-3">
          {whyReasons.map((r, i) => (
            <article
              key={r.number}
              data-reveal
              className="group relative overflow-hidden border-b border-[#F6F2EA]/15 px-1 py-9 sm:px-7 sm:py-11 xl:border-r xl:last:border-r-0"
            >
              {/* oversized index */}
              <span
                className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[7rem] leading-none text-[#F6F2EA]/[0.07] transition-all duration-700 group-hover:text-copper/30 group-hover:-translate-y-1"
                aria-hidden="true"
              >
                {r.number}
              </span>

              <div className="relative">
                <span className="label-xs text-copper/70 transition-colors duration-500 group-hover:text-copper-light">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-2xl font-bold uppercase tracking-[0.04em] text-[#F6F2EA] sm:text-[1.75rem]">
                  {r.title}
                </h3>
                <span className="accent-rule mt-5 block" aria-hidden="true" />
                <p className="mt-5 max-w-[34ch] text-[0.95rem] leading-relaxed text-[#F6F2EA]/65">
                  {r.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
