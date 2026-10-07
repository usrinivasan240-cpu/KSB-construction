"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { images } from "@/lib/assets";
import { services, projects } from "@/lib/content";
import { nav, siteConfig } from "@/lib/site.config";

const year = new Date().getFullYear();

export default function Footer() {
  const pathname = usePathname();
  // On the home page in-page anchors scroll smoothly; from any other route we
  // have to return home first.
  const hrefFor = (hash: string) => (pathname === "/" ? hash : `/${hash}`);

  return (
    <footer className="relative overflow-hidden border-t border-bone/10 bg-ink-deep">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden="true" />

      <div className="shell relative pb-10 pt-16 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* --------------------------------------------------- identity */}
          <div className="lg:col-span-4">
            <Image
              src={images.logo}
              alt={`${siteConfig.name} logo`}
              width={747}
              height={489}
              className="h-16 w-auto"
            />
            <p className="tamil mt-5 text-[0.95rem] leading-relaxed text-copper-light">
              {siteConfig.tagline}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-mist-dim">
              {siteConfig.taglineTranslated}
            </p>
            <p className="lead mt-6 max-w-sm !text-[0.9rem] !leading-relaxed">
              Residential, commercial and renovation construction delivered with
              disciplined planning and careful finishing — from Trichy, Tamil Nadu.
            </p>
          </div>

          {/* ------------------------------------------------------- nav */}
          <nav aria-label="Footer navigation" className="lg:col-span-2">
            <h2 className="label-xs mb-5 text-copper">Navigate</h2>
            <ul className="space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={hrefFor(item.href)}
                    className="nav-link !tracking-[0.14em]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* --------------------------------------------------- services */}
          <div className="lg:col-span-3">
            <h2 className="label-xs mb-5 text-copper">Services</h2>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.id}>
                  <Link
                    href={hrefFor("#services")}
                    className="text-sm text-mist transition-colors duration-300 hover:text-copper-light"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------------------------------------------------- contact */}
          <div className="lg:col-span-3">
            <h2 className="label-xs mb-5 text-copper">Contact</h2>
            <ul className="space-y-3 text-sm text-mist">
              <li>{siteConfig.addressDisplay}</li>
              <li>
                <a
                  href={siteConfig.phoneHref}
                  className="transition-colors duration-300 hover:text-copper-light"
                >
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition-colors duration-300 hover:text-copper-light"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="pt-2">
                <Link href={hrefFor("#contact")} className="nav-link !tracking-[0.14em]">
                  Start your project
                </Link>
              </li>
            </ul>

            <h2 className="label-xs mb-4 mt-8 text-copper">Follow</h2>
            <ul className="flex flex-wrap gap-2">
              {(
                [
                  ["Instagram", siteConfig.social.instagram],
                  ["Facebook", siteConfig.social.facebook],
                  ["YouTube", siteConfig.social.youtube],
                ] as const
              ).map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex border border-bone/15 px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-mist transition-colors duration-300 hover:border-copper hover:text-copper-light"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --------------------------------------------------- project strip */}
        <div className="mt-14 hidden border-t border-bone/10 pt-8 md:block">
          <p className="label-xs mb-4 text-mist-dim">Selected work</p>
          <ul className="flex flex-wrap gap-x-7 gap-y-2">
            {projects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="text-xs uppercase tracking-[0.16em] text-mist-dim transition-colors duration-300 hover:text-copper-light"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ------------------------------------------------------ bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-bone/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-mist-dim">
            © {year} {siteConfig.name}. All Rights Reserved.
          </p>
          <p className="label-xs text-mist-dim">
            {siteConfig.addressDisplay} • India
          </p>
        </div>
      </div>
    </footer>
  );
}
