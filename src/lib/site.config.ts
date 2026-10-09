/* ===========================================================================
 * KSB CONSTRUCTIONS — CENTRAL SITE CONFIGURATION  ("site.config")
 * ---------------------------------------------------------------------------
 * EVERY contact / social / location value on the website is read from THIS
 * file. Nothing else needs to change when real details arrive.
 *
 * ⚠️  ALL VALUES MARKED  [PLACEHOLDER]  MUST BE REPLACED BEFORE LAUNCH.
 * =========================================================================== */

export const siteConfig = {
  /* ------------------------------------------------------------- identity */
  name: "KSB Constructions",
  legalName: "KSB Constructions",
  shortName: "KSB",
  tagline: "நம்பிக்கை | தரம் | திறமை",
  taglineTranslated: "Trust | Quality | Expertise",
  tamilCta: "உங்கள் கனவு இல்லத்தை\nஉருவாக்குவோம்.",
  tamilCtaTranslated: "Let's build your dream home.",

  /* --------------------------------------------------------------- SEO ---- */
  url: "https://ksbconstructions.in", // [SAMPLE DATA] production URL
  title: "KSB Constructions | Construction Company in Trichy, Tamil Nadu",
  description:
    "KSB Constructions provides residential construction, commercial construction, renovation, planning and design solutions in Trichy, Tamil Nadu.",
  keywords: [
    "construction company trichy",
    "residential construction trichy",
    "commercial construction tamil nadu",
    "renovation trichy",
    "architectural planning trichy",
    "2D 3D house design trichy",
    "civil contractors trichy",
  ],
  locale: "en_IN",

  /* ---------------------------------------------------------- CONTACT ---- */
  // [SAMPLE DATA] Replace with the real company phone number before launch.
  phoneDisplay: "+91 88384 61175",
  phoneHref: "tel:+918838461175",
  // [SAMPLE DATA] WhatsApp number in INTERNATIONAL format, digits only, no "+".
  // The floating button, mobile sticky CTA and every "WhatsApp Us" button use it.
  whatsappNumber: "918838461175",
  whatsappMessage:
    "Hi KSB Constructions, I would like to discuss a construction project.",
  // [SAMPLE DATA] Replace with the real company e-mail before launch.
  email: "info@ksbconstructions.com",

  /* -------------------------------------------------------------- FORM ---- */
  // [OPTIONAL] Serverless form endpoint (Formspree / Basin / your own API).
  // Example: "https://formspree.io/f/xxxxxxxx"
  // When EMPTY, the enquiry form falls back to opening WhatsApp with the
  // message pre-filled — so leads are never lost.
  formEndpoint: "",

  /* ------------------------------------------------------------- ADDRESS -- */
  address: {
    line1: "Srirangam", // [SAMPLE DATA] add street / door no. when supplied
    city: "Trichy",
    district: "Tiruchirappalli",
    state: "Tamil Nadu",
    postalCode: "620006", // Srirangam area PIN
    country: "India",
  },
  // Human readable single line — shown in the contact section.
  addressDisplay: "Trichy, Tamil Nadu",
  // [SAMPLE DATA] Google Maps embed <src> — replace with the exact business
  // listing URL when supplied; it is used verbatim in the contact section.
  mapEmbedUrl:
    "https://www.google.com/maps?q=Trichy,%20Tamil%20Nadu,%20India&z=12&output=embed",
  mapLinkUrl: "https://maps.google.com/?q=Trichy,+Tamil+Nadu,+India",
  // Trichy city centre coordinates — used for LocalBusiness JSON-LD.
  geo: { latitude: 10.7905, longitude: 78.7047 },
  // [OPTIONAL] Google Business Profile review URL.
  reviewUrl: "",

  /* ------------------------------------------------------------- SOCIAL --- */
  social: {
    instagram: "https://instagram.com/ksbconstructions", // [SAMPLE DATA]
    facebook: "https://facebook.com/ksbconstructions", // [SAMPLE DATA]
    youtube: "https://youtube.com/@ksbconstructions", // [SAMPLE DATA]
    // WhatsApp is derived from whatsappNumber — never set it manually.
  },

  /* --------------------------------------------------------- SERVICE AREA -- */
  serviceAreas: [
    "Trichy",
    "Tiruchirappalli",
    "Srirangam",
    "Thuraiyur",
    "Musiri",
    "Lalgudi",
    "Thanjavur",
    "Pudukkottai",
    "Tamil Nadu",
  ],

  /* --------------------------------------------------------------- HOURS -- */
  hours: [
    { days: "Monday – Saturday", time: "9:00 AM – 7:00 PM" },
    { days: "Sunday", time: "By appointment" },
  ],
} as const;

/** WhatsApp deep-link with the prefilled enquiry message. */
export function whatsappUrl(message: string = siteConfig.whatsappMessage): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Full street address as one line (used in JSON-LD). */
export function fullAddress(): string {
  const a = siteConfig.address;
  return [a.line1, a.city, a.district, a.state, a.postalCode, a.country]
    .filter((v, i, arr) => v && arr.indexOf(v) === i)
    .join(", ");
}

export const nav = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT", href: "#about" },
  { label: "SERVICES", href: "#services" },
  { label: "PROJECTS", href: "#projects" },
  { label: "PROCESS", href: "#process" },
  { label: "WHY KSB", href: "#why" },
  { label: "CONTACT", href: "#contact" },
] as const;
