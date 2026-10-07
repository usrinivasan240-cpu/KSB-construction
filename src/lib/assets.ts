/* ===========================================================================
 * KSB CONSTRUCTIONS — IMAGE / BRAND ASSET MANIFEST
 * ---------------------------------------------------------------------------
 * ★ SINGLE SOURCE OF TRUTH FOR EVERY IMAGE ON THE WEBSITE ★
 *
 * Large surfaces use photographic imagery (/public/assets/photos/*.jpg).
 * The KSB logo + the six small material tiles remain vector placeholders
 * until the official logo and real close-up shots arrive:
 *
 *   1. Drop the real file into  /public/assets/  using the SAME filename.
 *   2. Done — no component, page or import needs to change.
 *
 * If you would rather use a different filename, update ONLY the map below.
 *
 * Photography: Unsplash (free to use under the Unsplash License).
 * =========================================================================== */

export const images = {
  /* ---------------------------------------------------------- BRAND ------ */
  /** Official KSB Constructions logo (transparent PNG, 747×489). */
  logo: "/assets/ksb-logo-official.png",
  /** Favicon / og-image source. */
  logoMark: "/assets/ksb-logo-official.png",

  /* ---------------------------------------------------------- HERO ------- */
  /** Full-viewport cinematic hero background — preloaded. */
  hero: "/assets/photos/hero.jpg",

  /* ---------------------------------------------------------- SECTIONS --- */
  about: "/assets/photos/about.jpg",
  blueprint: "/assets/photos/blueprint.jpg",
  interior: "/assets/photos/interior.jpg",
  site: "/assets/photos/site.jpg",
  cta: "/assets/photos/cta.jpg",

  /* ---------------------------------------------------------- SERVICES --- */
  serviceResidential: "/assets/photos/service-residential.jpg",
  serviceCommercial: "/assets/photos/service-commercial.jpg",
  serviceRenovation: "/assets/photos/service-renovation.jpg",
  servicePlanning: "/assets/photos/service-planning.jpg",
  serviceDesign3d: "/assets/photos/service-design3d.jpg",
  serviceStructural: "/assets/photos/service-structural.jpg",

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
  "/assets/photos/project-01.jpg",
  "/assets/photos/project-02.jpg",
  "/assets/photos/project-03.jpg",
  "/assets/photos/project-04.jpg",
  "/assets/photos/project-05.jpg",
  "/assets/photos/project-06.jpg",
] as const;

export type ImageKey = keyof typeof images;
