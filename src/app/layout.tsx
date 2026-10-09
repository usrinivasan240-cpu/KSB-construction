import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { siteConfig, fullAddress, whatsappUrl } from "@/lib/site.config";
import SmoothScroll from "@/components/system/SmoothScroll";
import PageTransition from "@/components/system/PageTransition";
import RevealSystem from "@/components/system/RevealSystem";
import Header from "@/components/chrome/Header";
import Footer from "@/components/chrome/Footer";
import WhatsAppFab from "@/components/chrome/WhatsAppFab";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s | KSB Constructions",
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: "/assets/photos/hero.jpg", width: 2400, height: 1500, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/assets/photos/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // [PLACEHOLDER] add real icons once supplied:
  // icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#0B0D0C",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ConstructionCompany"],
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  description: siteConfig.description,
  url: siteConfig.url,
  logo: `${siteConfig.url}/assets/ksb-logo-official.png`,
  image: `${siteConfig.url}/assets/photos/hero.jpg`,
  slogan: siteConfig.taglineTranslated,
  foundingDate: "2019",
  telephone: siteConfig.phoneDisplay,
  email: siteConfig.email,
  priceRange: "₹₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.line1,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.state,
    postalCode: siteConfig.address.postalCode,
    addressCountry: siteConfig.address.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: siteConfig.geo.latitude,
    longitude: siteConfig.geo.longitude,
  },
  areaServed: siteConfig.serviceAreas.map((name) => ({ "@type": "City", name })),
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
  ],
  sameAs: [siteConfig.social.instagram, siteConfig.social.facebook, siteConfig.social.youtube],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Construction Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Residential Construction" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Commercial Construction" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Renovation & Remodelling" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Architectural Planning" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "2D & 3D Design" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Structural & Civil Works" } },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-ink text-bone antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <noscript>
          <style>{`[data-reveal],[data-reveal-line]>span{opacity:1!important;transform:none!important}`}</style>
        </noscript>

        <SmoothScroll />
        <RevealSystem />
        <PageTransition />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:bg-copper focus:px-5 focus:py-3 focus:text-xs focus:font-bold focus:uppercase focus:tracking-widest focus:text-ink"
        >
          Skip to content
        </a>

        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppFab />

        {/* Client-side call / WhatsApp helpers shared by CTAs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteConfig.name,
              url: siteConfig.url,
              description: siteConfig.description,
              potentialAction: {
                "@type": "ContactAction",
                target: whatsappUrl(),
                name: "Start Your Project",
              },
            }).replace(/</g, "\\u003c"),
          }}
        />
        <span className="sr-only">{fullAddress()}</span>
      </body>
    </html>
  );
}
