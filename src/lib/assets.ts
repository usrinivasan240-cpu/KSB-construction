/* ===========================================================================
 * KSB CONSTRUCTIONS — IMAGE / BRAND ASSET MANIFEST
 * ---------------------------------------------------------------------------
 * ★ SINGLE SOURCE OF TRUTH FOR EVERY IMAGE ON THE WEBSITE ★
 *
 * The files currently in /public/assets are premium generated PLACEHOLDERS.
 * To swap in the real KSB logo and construction photography:
 *
 *   1. Drop the real file into  /public/assets/  using the SAME filename.
 *   2. Done — no component, page or import needs to change.
 *
 * If you would rather use a different filename, update ONLY the map below.
 * =========================================================================== */

export const images = {
  /* ---------------------------------------------------------- BRAND ------ */
  /** Original KSB logo (black + orange + deep green + white). */
  logo: "/assets/ksb-logo.svg",
  /** Favicon / og-image source. */
  logoMark: "/assets/ksb-logo.svg",

  /* ---------------------------------------------------------- HERO ------- */
  /** Full-viewport cinematic hero background — preloaded. */
  hero: "/assets/hero.svg",

  /* ---------------------------------------------------------- SECTIONS --- */
  about: "/assets/about.svg",
  blueprint: "/assets/blueprint.svg",
  interior: "/assets/interior.svg",
  site: "/assets/site.svg",
  cta: "/assets/cta.svg",

  /* ---------------------------------------------------------- SERVICES --- */
  serviceResidential: "/assets/service-residential.svg",
  serviceCommercial: "/assets/service-commercial.svg",
  serviceRenovation: "/assets/service-renovation.svg",
  servicePlanning: "/assets/service-planning.svg",
  serviceDesign3d: "/assets/service-design3d.svg",
  serviceStructural: "/assets/service-structural.svg",

  /* ---------------------------------------------------------- MATERIALS -- */
  materialBrick: "/assets/material-brick.svg",
  materialConcrete: "/assets/material-concrete.svg",
  materialSteel: "/assets/material-steel.svg",
  materialWood: "/assets/material-wood.svg",
  materialFinish: "/assets/material-finish.svg",
  materialDetail: "/assets/material-detail.svg",
} as const;

/** Project gallery images — index matches `project-XX` file numbering. */
export const projectImages = [
  "/assets/project-01.svg",
  "/assets/project-02.svg",
  "/assets/project-03.svg",
  "/assets/project-04.svg",
  "/assets/project-05.svg",
  "/assets/project-06.svg",
] as const;

export type ImageKey = keyof typeof images;
