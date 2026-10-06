import servicesJson from "@/content/services.json";
import projectsJson from "@/content/projects.json";
import processJson from "@/content/process.json";
import whyJson from "@/content/why.json";
import materialsJson from "@/content/materials.json";
import testimonialsJson from "@/content/testimonials.json";
import statsJson from "@/content/stats.json";

/* ===========================================================================
 * TYPED CONTENT LAYER
 * ---------------------------------------------------------------------------
 * Reads every editable block of the site from JSON in /src/content.
 * To make the site CMS-driven later, replace these imports with fetches —
 * no component needs to change.
 * =========================================================================== */

export type Service = {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
  highlights: string[];
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  location: string;
  type: string;
  status: string;
  image: string;
  gallery: string[];
  summary: string;
  brief: string;
  approach: string;
  construction: string;
  details: string;
  result: string;
};

export type ProcessStep = { number: string; title: string; description: string };
export type WhyReason = { number: string; title: string; description: string };
export type Material = { id: string; title: string; subtitle: string; image: string };
export type Testimonial = { id: string; quote: string; name: string; project: string };
export type Stat = { number: string; label: string; detail: string };

export const services = servicesJson as Service[];
export const projects = projectsJson as Project[];
export const processSteps = processJson as ProcessStep[];
export const whyReasons = whyJson as WhyReason[];
export const materials = materialsJson as Material[];
export const testimonials = testimonialsJson as Testimonial[];
export const stats = statsJson as Stat[];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function adjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: projects[projects.length - 1], next: projects[0] };
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
}

/* ------------------------------------------------------------ page copy ---- */
export const heroCopy = {
  eyebrow: ["KSB CONSTRUCTIONS", "TRICHY • TAMIL NADU"],
  headline: ["BUILDING", "SPACES THAT", "LAST."],
  supporting:
    "From strong foundations to refined finishes, we build spaces designed for life.",
  primaryCta: "START YOUR PROJECT",
  secondaryCta: "VIEW OUR WORK",
  scroll: "SCROLL TO EXPLORE",
};

export const aboutCopy = {
  label: "WHO WE ARE",
  headline: ["WE DON'T JUST", "BUILD HOUSES.", "WE BUILD", "WHAT LASTS."],
  intro:
    "KSB Constructions is a construction and design-focused company committed to delivering reliable, quality-driven spaces with careful attention to planning, execution and finishing.",
  secondary:
    "Based in Trichy, we work across residential, commercial and renovation projects — bringing structured planning, clear communication and skilled workmanship to every stage of the build.",
  points: [
    { title: "Quality-focused execution", body: "Standards set before work starts, checked at every stage." },
    { title: "Transparent communication", body: "You always know where your project stands." },
    { title: "Professional planning", body: "Decisions, drawings and sequencing resolved up front." },
    { title: "Skilled workmanship", body: "Experienced teams and disciplined site practice." },
    { title: "End-to-end support", body: "One accountable team from consultation to handover." },
  ],
};

export const materialsCopy = {
  label: "MATERIALS & CRAFT",
  headline: ["DETAILS", "MAKE THE", "DIFFERENCE."],
  body: "Brick, concrete, steel, wood, finishes and architectural detail — every material is chosen, placed and finished with intent. This is where a building stops being structure and starts being a space.",
};

export const finalCtaCopy = {
  headline: ["READY TO BUILD", "SOMETHING", "GREAT?"],
  supporting:
    "Tell us about your project and let's turn your vision into a space built to last.",
  primary: "START YOUR PROJECT",
  secondary: "WHATSAPP US",
};
