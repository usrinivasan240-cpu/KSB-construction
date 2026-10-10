"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { siteConfig, whatsappUrl } from "@/lib/site.config";

function WhatsAppGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.12-.27-.2-.57-.35Z" />
      <path d="M12.04 2C6.6 2 2.17 6.43 2.17 11.87c0 1.74.46 3.44 1.32 4.94L2 22.5l5.84-1.53a9.9 9.9 0 0 0 4.2.93h.01c5.44 0 9.87-4.43 9.87-9.87 0-2.64-1.03-5.12-2.9-6.99A9.8 9.8 0 0 0 12.04 2Zm0 18.05h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.81.83-3.02-.2-.31a8.16 8.16 0 0 1-1.25-4.34c0-4.53 3.69-8.21 8.22-8.21 2.2 0 4.26.86 5.81 2.41a8.16 8.16 0 0 1 2.41 5.81c0 4.53-3.69 8.18-8.22 8.18Z" />
    </svg>
  );
}

const subscribeScroll = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
};
const readScrollY = () => window.scrollY;
const readScrollYOnServer = () => 0;

/**
 * Conversion anchor:
 *   desktop → floating circular button, bottom-right
 *   mobile  → sticky full-width "CHAT ON WHATSAPP" bar
 * Both open WhatsApp with the prefilled enquiry message from site.config.
 */
export default function WhatsAppFab() {
  const scrollY = useSyncExternalStore(
    subscribeScroll,
    readScrollY,
    readScrollYOnServer,
  );
  const show = scrollY > 420;
  // Hide the sticky mobile bar while the footer (which has its own contact
  // actions) is on screen — otherwise it covers the copyright line.
  const [atFooter, setAtFooter] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(
      ([entry]) => setAtFooter(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  const mobileShow = show && !atFooter;

  return (
    <>
      {/* ------------------------------------------------------- desktop */}
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with KSB Constructions on WhatsApp"
        data-cursor="hover"
        className="group fixed bottom-6 right-6 z-[750] hidden h-14 w-14 items-center justify-center rounded-full border border-copper/50 bg-copper text-coal shadow-[0_14px_40px_-12px_rgba(247,148,29,0.7)] transition-all duration-500 hover:bg-copper-light md:flex"
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "scale(1)" : "scale(0.6)",
          pointerEvents: show ? "auto" : "none",
        }}
      >
        <WhatsAppGlyph className="h-6 w-6" />
        <span className="pointer-events-none absolute right-[4.25rem] whitespace-nowrap border border-bone/15 bg-ink-deep/95 px-3 py-2 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-bone opacity-0 transition-all duration-400 group-hover:opacity-100">
          Chat on WhatsApp
        </span>
      </a>

      {/* --------------------------------------------------------- mobile */}
      <div
        className="fixed inset-x-0 bottom-0 z-[750] border-t border-bone/12 bg-ink-deep/95 px-4 py-3 backdrop-blur-xl transition-transform duration-500 md:hidden"
        style={{
          transform: mobileShow ? "translateY(0)" : "translateY(110%)",
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
        }}
        aria-hidden={!mobileShow}
      >
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-solid w-full !py-4 !text-[0.6875rem]"
          tabIndex={mobileShow ? 0 : -1}
        >
          <WhatsAppGlyph className="h-4 w-4" />
          Chat on WhatsApp
        </a>
      </div>

      {/* Screen-reader announcement of the contact channel */}
      <span className="sr-only" data-fab-ready={show ? "true" : undefined}>
        WhatsApp {siteConfig.phoneDisplay}
      </span>
    </>
  );
}
