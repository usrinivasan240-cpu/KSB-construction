import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, whatsappUrl } from "@/lib/site.config";
import { galleryImages } from "@/lib/content";
import GalleryGrid from "@/components/sections/GalleryGrid";

export const metadata: Metadata = {
  title: "Project Gallery — Real KSB Homes",
  description:
    "Browse completed KSB Constructions homes across Trichy, Tamil Nadu — night elevations, interiors and finishing stages, photographed on real sites.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Project Gallery | KSB Constructions",
    description:
      "Real completed homes by KSB Constructions, Trichy — elevations, interiors and finishing.",
    url: "/gallery",
    images: [{ url: "/assets/photos/real/house-02-night-wide.jpg", width: 1600, height: 1200 }],
  },
};

/**
 * GALLERY — every real KSB home photograph in one animated showcase.
 * Masonry grid + filters + full-screen lightbox (see GalleryGrid).
 */
export default function GalleryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: `Project Gallery — ${siteConfig.name}`,
    url: `${siteConfig.url}/gallery`,
    image: galleryImages.map((g) => `${siteConfig.url}${g.src}`),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* ---------------------------------------------------------- header */}
      <header className="noise-layer relative overflow-hidden bg-ink-deep">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url(/assets/photos/real/house-02-night-wide.jpg)" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,11,16,0.72)_0%,rgba(6,11,16,0.55)_45%,rgba(6,11,16,0.97)_100%)]"
        />
        <div
          aria-hidden="true"
          className="grid-bg pointer-events-none absolute inset-0 opacity-40"
        />

        <div className="shell relative pb-14 pt-[calc(var(--header-h)+3rem)] sm:pb-20">
          <p data-reveal className="eyebrow mb-6">
            <span className="mr-3 inline-block h-px w-8 bg-copper align-middle" />
            Gallery
          </p>
          <h1 className="display-lg max-w-[14ch] text-[#F6EFE3]">
            <span data-reveal-line className="block">
              <span>REAL HOMES.</span>
            </span>
            <span data-reveal-line className="block">
              <span className="text-copper-light">REAL SITES.</span>
            </span>
          </h1>
          <p data-reveal className="lead mt-7 max-w-xl !text-[#D9CFBC]">
            {galleryImages.length} photographs from genuine KSB builds — night
            elevations, living spaces and finishing stages. No renders, no stock.
          </p>
          <div data-reveal className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link href="/#contact" className="btn btn-primary rounded-lg">
              Start your project
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn rounded-lg !border-[#F6EFE3]/40 !text-[#F6EFE3]">
              WhatsApp us
            </a>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------ grid */}
      <section aria-label="All project photographs" className="section-pad relative bg-ink">
        <div
          aria-hidden="true"
          className="grid-bg pointer-events-none absolute inset-0 opacity-30"
        />
        <div className="shell relative">
          <GalleryGrid />
        </div>
      </section>
    </>
  );
}
