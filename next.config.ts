import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dragonballdle.site",
      },
      {
        protocol: "https",
        hostname: "pub-7a42112fb83543e09f959229a0efd07f.r2.dev",
      },
    ],
    qualities: [75, 85, 100],
  },
  trailingSlash: true,
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
