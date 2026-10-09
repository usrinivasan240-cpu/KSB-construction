# KSB CONSTRUCTIONS — Website

Premium architectural / construction studio website for **KSB Constructions, Trichy, Tamil Nadu**.

> **நம்பிக்கை | தரம் | திறமை** — Trust | Quality | Expertise

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis smooth scroll · Framer Motion

```bash
npm install      # already installed
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint
npm run gen:art  # regenerate the placeholder artwork (scripts/gen-art.mjs)
```

---

## ⚠️ PLACEHOLDER CHECKLIST — replace before launch

Nothing below is real yet. Every value is intentionally marked so nothing fake ships.

### 1. Logo & photography (biggest visual win)

The brand assets were **not present on disk**, so the site uses drop-in asset slots.

| What | Where | Status |
| --- | --- | --- |
| Logo (all backgrounds) | `public/assets/ksb-logo-official.png` | ✅ Official transparent logo (747×489) — header, footer, transition curtain, JSON-LD |
| Hero image | `public/assets/photos/hero.jpg` | ✅ Real photography (crane site at dusk) |
| About image | `public/assets/photos/about.jpg` | ✅ Real photography |
| Final CTA background | `public/assets/photos/cta.jpg` | ✅ Real photography |
| Service hover images | `public/assets/photos/service-*.jpg` (6) | ✅ Real photography, one per service |
| Project images | `public/assets/photos/project-01…06.jpg` | ✅ Real photography (portrait 4:5 crops) |
| Materials close-ups | `public/assets/material-*.svg` (6) | ⏳ Dark cinematic vector textures — replace with real close-ups when available |

*Keep the same filename and format. To use a different file, update the path in
**`src/lib/assets.ts`** (one file, all images).*

*Photography: `public/assets/photos/real/house-*.jpg` are genuine KSB completed-home
photos (supplied Oct 2026) — residential villa page + galleries, About section,
and the residential/renovation service cards. Remaining `photos/*.jpg` are
free-use stand-ins (Unsplash License) awaiting KSB site photography.*

**Swapping an image takes ~30 seconds:** drop the real file over the placeholder at the same path, or update the path in **`src/lib/assets.ts`** (one file, all images).

> The current logo is a **temporary placeholder** built to the KSB identity (black + orange + deep green + white, `KSB` / `CONSTRUCTIONS` wordmark with architectural roof motif). **Do not ship it** — drop in the official file.

### 2. Contact & social — `src/lib/site.config.ts` (ONE file)

| Key | Currently | Replace with |
| --- | --- | --- |
| `contact.phoneDisplay` | `+91 98765 43210` | Real phone number |
| `contact.phoneHref` | `tel:+919876543210` | Matching `tel:` link |
| `contact.whatsappNumber` | `919876543210` | Real WhatsApp number (digits only, with `91`) |
| `contact.email` | `hello@ksbconstructions.in` | Real email |
| `address.*` / `addressDisplay` | `Trichy, Tamil Nadu` | Full street address when available |
| `mapEmbedUrl` / `mapLinkUrl` | Trichy placeholder | Exact Google Maps embed + link |
| `social.instagram` / `.facebook` / `.youtube` | `#` | Real profile URLs |
| `url` | `https://ksbconstructions.example.com` | **Real production domain** (drives canonical/OG/sitemap/robots/JSON-LD) |
| `formEndpoint` | `""` (empty) | Optional Formspree/Basin endpoint. **While empty, the enquiry form opens WhatsApp with the full message pre-filled** — a working conversion path with zero backend. |

`whatsappUrl()` builds the prefilled chat link automatically, including the required message:
`Hi KSB Constructions, I would like to discuss a construction project.`

### 3. Content — `src/content/*.json` (this is the "CMS")

Edit these JSON files; no frontend code changes needed.

| File | Contains |
| --- | --- |
| `services.json` | 6 services — number, title, description, image, highlights |
| `projects.json` | 6 projects — **category-based names**, location, type, status, image, gallery, and the 5 case-study sections (brief / approach / construction / details / result) |
| `process.json` | 5-step process |
| `why.json` | 6 reasons |
| `materials.json` | 6 material tiles |
| `testimonials.json` | 4 **explicit placeholder** reviews |
| `stats.json` | 4 non-numeric categories (no invented counts) |

**Must change before launch:**

- **Project names + status** are category-based placeholders (`RESIDENTIAL VILLA`, `ONGOING`, etc.). Replace with real project names and genuine status.
- **Testimonials** are visibly marked placeholders (`"Client testimonial goes here."` / `CLIENT NAME`). Replace with genuine reviews only — do not invent any.
- No numerical claims (`100+ projects`), no awards, no certifications anywhere by design.

### 4. Recommended next step: real CMS

The JSON layer is deliberately shaped like a headless CMS so it can be swapped for **Supabase** or **Firebase** (or Sanity/Contentful) later without touching components: each file maps 1:1 to a table/collection with the exact same fields.

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx            fonts, metadata, JSON-LD (LocalBusiness + ConstructionCompany), chrome
│   ├── page.tsx              home — all sections
│   ├── projects/[slug]/      full case-study page (SSG, 6 routes)
│   ├── sitemap.ts  robots.ts
│   ├── globals.css           design tokens + custom utilities (@theme / @utility)
├── components/
│   ├── chrome/               Header, Footer, WhatsAppFab
│   ├── sections/             Hero, HeroStats, About, Services, Projects, Process,
│   │                         WhyKsb, Materials, Testimonials, FinalCta, Contact
│   └── system/               SmoothScroll, RevealSystem, Cursor, PageTransition
├── content/*.json            ← the CMS layer
└── lib/
    ├── site.config.ts        ← all contact / social / URL values
    ├── assets.ts             ← all image paths (single manifest)
    ├── content.ts            typed accessors + copy blocks
    └── gsap.ts               GSAP + ScrollTrigger registration
```

## Design system

| Token | Value | Source |
| --- | --- | --- |
| Background | `#0B0D0C` (`ink`) | neutral near-black |
| Secondary | graphite grey (`forest` … `forest-4`, now grey not green) | logo grey `#A7A9AC` deepened |
| Accent | logo orange `#F7941D` (`copper`), amber `#FFC53D` (`copper-light`) | sampled from official logo |
| Spark | logo yellow `#FFD91A` (`gilt`) — numerals, stars only | sampled from official logo |
| Text | `bone #EFEAE2`, `mist`, `mist-dim` | warm neutrals |
| Type | **Inter** (UI) + **Playfair Display** (architectural headlines) + Tamil fallback stack |
| Motion ease | `--ease-arch: cubic-bezier(.16,1,.3,1)` |

## Animation

- **Page entrance / route changes:** short dark curtain with the KSB logo (~0.6–1.05s).
- **Scroll reveals:** `[data-reveal]`, `[data-reveal-line]`, `[data-reveal-img]` (mask reveal `scale 1.08 → 1`) driven by `ScrollTrigger.batch`.
- **Hero:** image `1.05 → 1`, headline line-by-line, CTAs after the headline, subtle grain.
- **Projects:** pinned horizontal gallery on desktop (`min-width:1024px` only), vertical stacked cards on mobile.
- **Process:** timeline line draws with scroll; steps activate sequentially.
- **Reduced motion:** everything falls back to fully-visible, static content.

## Performance & SEO

- Images: AVIF/WebP, responsive `deviceSizes`, lazy loading (hero is `priority`), `quality` capped at 82.
- Lighthouse targets: Performance / A11y / SEO **90+**.
- Title: `KSB Constructions | Construction Company in Trichy, Tamil Nadu`
- Meta description, canonical, Open Graph/Twitter, `sitemap.xml`, `robots.txt`.
- Structured data: `LocalBusiness` + `ConstructionCompany` (layout), `CreativeWork` per project (case study).

## Accessibility

- Skip-to-content link, semantic landmarks, `aria-labelledby` per section, visible copper `:focus-visible` rings, sr-only address & phone, decorative layers `aria-hidden`.
- Mobile menu: `inert` + `aria-hidden` when closed, Escape to close, body scroll lock.
