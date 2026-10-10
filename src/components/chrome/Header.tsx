"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { images } from "@/lib/assets";
import { nav, siteConfig, whatsappUrl } from "@/lib/site.config";

/**
 * Floating transparent header.
 *  - shrinks + gains a glass background once the page scrolls
 *  - highlights the section currently in view
 *  - full-screen animated navigation on mobile
 */
export default function Header() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  const headerRef = useRef<HTMLElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuPanelRef = useRef<HTMLDivElement | null>(null);

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(onHome ? "#home" : pathname);

  /* ---------------------------- scroll state + active section spy (shared
     rAF pass — the spy finds whichever nav section owns the viewport centre
     and clears itself when the centre sits over a non-nav section) */
  useEffect(() => {
    let frame = 0;
    const ids = nav.map((n) => n.href.slice(1));

    const measure = () => {
      setScrolled(window.scrollY > 40);
      if (!onHome) return;
      const centre = window.innerHeight * 0.42;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= centre && r.bottom > centre) current = `#${id}`;
      }
      setActive(current ?? "");
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [onHome]);

  /* --------------------------------------------- entrance animation (logo
     + nav slide in) — runs once, before RevealSystem batches anything) */
  useLayoutEffect(() => {
    if (prefersReducedMotion() || sessionStorage.getItem("ksb-header-in")) return;
    sessionStorage.setItem("ksb-header-in", "1");
    const el = barRef.current;
    if (!el) return;
    const parts = el.querySelectorAll<HTMLElement>("[data-head-in]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        parts,
        { y: -18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.07, delay: 0.35, ease: "power3.out" },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  /* ---------------------------------------------------- mobile menu open */
  useLayoutEffect(() => {
    const menu = menuRef.current;
    const panel = menuPanelRef.current;
    if (!menu || !panel) return;

    if (!open) return;

    window.dispatchEvent(new CustomEvent("ksb:lock", { detail: true }));
    menu.style.pointerEvents = "auto";

    const items = panel.querySelectorAll<HTMLElement>("[data-menu-item]");
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(menu, { autoAlpha: 1 });
        gsap.set(items, { y: 0, opacity: 1 });
        return;
      }
      gsap.set(menu, { autoAlpha: 1 });
      gsap.fromTo(
        menu,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.62, ease: "expo.inOut" },
      );
      gsap.fromTo(
        items,
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.055, delay: 0.2, ease: "power3.out" },
      );
    }, menu);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      ctx.revert();
      window.removeEventListener("keydown", onKey);
      menu.style.pointerEvents = "none";
      window.dispatchEvent(new CustomEvent("ksb:lock", { detail: false }));
    };
  }, [open]);

  /* ------------------------------------------------------- menu close fx */
  const closeMenu = () => {
    const menu = menuRef.current;
    if (menu) menu.style.pointerEvents = "none";
    if (!menu || prefersReducedMotion()) {
      setOpen(false);
      return;
    }
    const items = menu.querySelectorAll<HTMLElement>("[data-menu-item]");
    const tl = gsap.timeline({ onComplete: () => setOpen(false) });
    tl.to(items, { y: -18, opacity: 0, duration: 0.3, stagger: 0.03, ease: "power2.in" })
      .to(menu, { autoAlpha: 0, clipPath: "inset(0 0 100% 0)", duration: 0.5, ease: "expo.inOut" }, "-=0.12");
  };

  const hrefFor = (href: string) =>
    href.startsWith("/") ? href : onHome ? href : `/${href}`;

  return (
    <>
      <header
        ref={headerRef}
        className="site-header fixed inset-x-0 top-0 z-[700] border-b border-transparent"
        data-scrolled={scrolled || open ? "true" : "false"}
      >
        <div
          ref={barRef}
          className={`shell flex items-center justify-between gap-6 transition-[height] duration-500 ${
            scrolled ? "h-[var(--header-h-sm)]" : "h-[var(--header-h)]"
          }`}
        >
          {/* ---------------------------------------------------- logo */}
          <Link
            href="/"
            data-head-in
            aria-label={`${siteConfig.name} — home`}
            className="group relative flex shrink-0 flex-col items-start justify-center"
          >
            <Image
              src={images.logo}
              alt={`${siteConfig.name} logo`}
              width={747}
              height={489}
              priority
              className={`w-auto transition-all duration-500 ${
                scrolled ? "h-9 sm:h-10" : "h-11 sm:h-[52px]"
              }`}
            />
            <span
              aria-hidden="true"
              className={`tamil tagline-tamil overflow-hidden whitespace-nowrap text-[0.55rem] leading-tight tracking-wide transition-all duration-500 text-copper-deep/90 ${
                scrolled ? "max-h-0 opacity-0" : "mt-1 max-h-5 opacity-100"
              }`}
            >
              {siteConfig.tagline}
            </span>
          </Link>

          {/* --------------------------------------------- primary nav */}
          <nav
            data-head-in
            aria-label="Primary"
            className="hidden items-center gap-7 lg:flex xl:gap-9"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={hrefFor(item.href)}
                className="nav-link"
                data-active={active === item.href ? "true" : "false"}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ------------------------------------------------- actions */}
          <div data-head-in className="flex items-center gap-3 sm:gap-4">
            <Link
              href={onHome ? "#contact" : "/#contact"}
              className="btn btn-primary hidden rounded-lg !px-6 !py-3.5 !text-[0.625rem] xl:inline-flex"
            >
              Start your project
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </Link>

            {/* hamburger */}
            <button
              type="button"
              onClick={() => (open ? closeMenu() : setOpen(true))}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="hamb-btn group relative z-10 flex h-11 w-11 flex-col items-center justify-center gap-[6px] border border-bone/15 bg-ink/40 backdrop-blur-md transition-colors duration-300 hover:border-copper lg:hidden"
            >
              <span
                className={`hamb-line block h-px w-5 bg-bone transition-all duration-400 ${
                  open ? "translate-y-[3.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`hamb-line block h-px w-5 bg-bone transition-all duration-400 ${
                  open ? "-translate-y-[3.5px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ============================================ full-screen mobile nav */}
      <div
        ref={menuRef}
        id="mobile-nav"
        className="fixed inset-0 z-[690] overflow-y-auto bg-ink-deep/98 backdrop-blur-xl lg:hidden"
        style={{ clipPath: "inset(0 0 100% 0)", visibility: "hidden", pointerEvents: "none" }}
        aria-hidden={!open}
        inert={!open}
      >
        <div
          ref={menuPanelRef}
          className="shell flex min-h-full flex-col justify-between pb-10 pt-[calc(var(--header-h)+1.5rem)]"
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {nav.map((item, i) => (
              <div key={item.href} data-menu-item className="overflow-hidden">
                <Link
                  href={hrefFor(item.href)}
                  onClick={closeMenu}
                  aria-current={active === item.href ? "page" : undefined}
                  className="group flex items-baseline justify-between border-b border-bone/10 py-4"
                >
                  <span
                    className={`display-md transition-colors duration-300 group-hover:text-copper ${
                      active === item.href ? "text-copper" : "text-bone"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="label-xs text-copper/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Link>
              </div>
            ))}
          </nav>

          <div className="mt-10 space-y-5">
            <div data-menu-item className="grid grid-cols-2 gap-3">
              <a
                href={siteConfig.phoneHref}
                onClick={closeMenu}
                aria-label={`Call KSB Constructions at ${siteConfig.phoneDisplay}`}
                className="btn w-full !px-4"
              >
                Call now
              </a>
              <Link
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="btn btn-solid w-full !px-4"
              >
                WhatsApp
              </Link>
            </div>
            <div data-menu-item className="space-y-2 border-t border-bone/10 pt-5">
              <p className="tamil text-sm text-mist">{siteConfig.tagline}</p>
              <p className="label-xs text-mist-dim">{siteConfig.addressDisplay}</p>
              <a href={siteConfig.phoneHref} className="block text-lg text-bone">
                {siteConfig.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
