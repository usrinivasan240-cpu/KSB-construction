"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { galleryImages, type GalleryImage } from "@/lib/content";

const FILTERS = ["All", "Exterior", "Interior"] as const;

/**
 * Animated gallery: masonry grid with scroll-in reveals, hover zoom +
 * caption, filter chips, and a full-screen lightbox (keyboard navigable).
 * Entrance uses framer-motion per-item so filtering re-animates cleanly,
 * independent of the global scroll-reveal system.
 */
export default function GalleryGrid() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const items = galleryImages.filter((g) => filter === "All" || g.tag === filter);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setLightbox((cur) =>
        cur === null ? cur : (cur + dir + items.length) % items.length,
      ),
    [items.length],
  );

  // Lock page scroll + keyboard controls while the lightbox is open
  useEffect(() => {
    if (lightbox === null) return;
    window.dispatchEvent(new CustomEvent("ksb:lock", { detail: true }));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.dispatchEvent(new CustomEvent("ksb:lock", { detail: false }));
    };
  }, [lightbox, close, step]);

  const active: GalleryImage | null = lightbox === null ? null : items[lightbox];

  return (
    <>
      {/* -------------------------------------------------- filter chips */}
      <div className="mb-10 flex flex-wrap gap-3" role="group" aria-label="Filter gallery">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => {
              setFilter(f);
              setLightbox(null);
            }}
            aria-pressed={filter === f}
            className={`border px-6 py-3 text-[0.65rem] font-bold uppercase tracking-[0.22em] transition-all duration-400 ${
              filter === f
                ? "border-copper bg-copper text-ink"
                : "border-bone/20 text-bone hover:border-copper/70 hover:text-copper-light"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* -------------------------------------------------- masonry grid */}
      <div className="columns-1 gap-5 sm:columns-2 xl:columns-3 [&>*]:mb-5">
        {items.map((g, i) => (
          <motion.figure
            key={g.id}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-6%" }}
            transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative break-inside-avoid overflow-hidden border border-bone/10 bg-ink-soft"
          >
            <button
              type="button"
              onClick={() => setLightbox(i)}
              aria-label={`Open ${g.title} full screen`}
              className="block w-full text-left"
            >
              <div className="relative w-full overflow-hidden">
                <Image
                  src={g.src}
                  alt={g.title}
                  width={900}
                  height={1100}
                  sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="h-auto w-full transition-transform duration-[1.2s] ease-[var(--ease-arch)] group-hover:scale-[1.06]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(6,11,16,0.85)_100%)] opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                <span className="text-sm font-bold uppercase tracking-[0.14em] text-bone">
                  {g.title}
                </span>
                <span className="label-xs shrink-0 border border-copper/50 px-2.5 py-1 text-copper-light">
                  {g.tag}
                </span>
              </figcaption>
              <span
                aria-hidden="true"
                className="absolute right-5 top-5 flex h-10 w-10 translate-y-1 items-center justify-center border border-bone/25 bg-ink-deep/60 text-bone opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
              >
                ⤢
              </span>
            </button>
            <span className="accent-rule" aria-hidden="true" />
          </motion.figure>
        ))}
      </div>

      {/* -------------------------------------------------- lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[900] flex flex-col bg-ink-deep/97 backdrop-blur-md"
            onClick={close}
          >
            <div
              className="shell flex items-center justify-between py-5"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="label-xs text-mist-dim">
                <span className="text-copper">
                  {String((lightbox ?? 0) + 1).padStart(2, "0")}
                </span>
                <span className="mx-1">/</span>
                {String(items.length).padStart(2, "0")}
                <span className="ml-4 hidden text-bone/80 sm:inline">{active.title}</span>
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close viewer"
                className="flex h-11 w-11 items-center justify-center border border-bone/25 text-xl text-bone transition-colors hover:border-copper hover:text-copper-light"
              >
                ✕
              </button>
            </div>

            <div
              className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 0.965 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative max-h-full"
              >
                <Image
                  src={active.src}
                  alt={active.title}
                  width={1400}
                  height={1600}
                  sizes="90vw"
                  className="max-h-[68vh] w-auto max-w-full border border-bone/15 object-contain sm:max-h-[74vh]"
                  priority
                />
              </motion.div>

              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-bone/25 bg-ink-deep/70 text-xl text-bone backdrop-blur-sm transition-colors hover:border-copper hover:text-copper-light sm:left-6"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next image"
                className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-bone/25 bg-ink-deep/70 text-xl text-bone backdrop-blur-sm transition-colors hover:border-copper hover:text-copper-light sm:right-6"
              >
                →
              </button>
            </div>

            <p className="shell pb-6 text-center text-sm font-bold uppercase tracking-[0.16em] text-bone sm:hidden">
              {active.title}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
