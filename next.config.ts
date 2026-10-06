import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Next 16: `qualities` defaults to [75] only — declare every value used
    // in <Image quality={…}> across the site (75 hero, 80/82 photography).
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80, 82],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2400],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640],
    minimumCacheTTL: 21600,
    // Add the production host here once siteConfig.url is real:
    // remotePatterns: [{ protocol: "https", hostname: "ksbconstructions.in" }],
  },
  reactStrictMode: true,
};

export default nextConfig;
