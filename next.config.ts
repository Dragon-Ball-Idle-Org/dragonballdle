import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// CSP Kinda hard to implement with next-intl using app router
const ContentSecurityPolicy = `
  default-src 'self' vercel.live;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel.com https://www.googletagmanager.com https://static.cloudflareinsights.com https://aclib.com *.cdn-fileserver.com *.searchresultsworld.com https://acscdn.com http://acscdn.com https://www.highperformanceformat.com https://google.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://cdn.dragonballdle.site https://pub-7a42112fb83543e09f959229a0efd07f.r2.dev vercel.live https://www.google.com.br https://*.google.com https://*.doubleclick.net https://www.googletagmanager.com *.cdn-fileserver.com *.searchresultsworld.com https://crcdn.org https://adexchangerapid.com https://cdn.storageimagedisplay.com https://kettledroopingcontinuation.com https://realizationnewestfangs.com https://wayfarerorthodox.com;
  font-src 'self';
  connect-src 'self' *.supabase.co wss://*.supabase.co *.sentry.io *.vercel.com https://analytics.google.com https://www.google.com https://*.google.com.br https://stats.g.doubleclick.net https://*.doubleclick.net *.cdn-fileserver.com *.searchresultsworld.com https://usrpubtrk.com http://adexchangerapid.com https://www.highperformanceformat.com https://protrafficinspector.com https://kettledroopingcontinuation.com https://realizationnewestfangs.com https://sourshaped.com https://skinnycrawlinglax.com https://wayfarerorthodox.com;
  frame-src 'self' *.vercel.com https://*.doubleclick.net https://googleads.g.doubleclick.net *.cdn-fileserver.com searchresultsworld.com *.searchresultsworld.com https://skinnycrawlinglax.com https://kettledroopingcontinuation.com https://realizationnewestfangs.com https://sourshaped.com https://wayfarerorthodox.com;
  worker-src 'self' blob:;
  form-action 'self';
  frame-ancestors 'none';
  base-uri 'self';
  object-src 'none';
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy,
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
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
    unoptimized: true,
    qualities: [75, 85, 100],
  },
  trailingSlash: true,
  allowedDevOrigins: ["127.0.0.1:3000", "localhost:3000"],
};

const withNextIntl = createNextIntlPlugin();

export default withSentryConfig(withNextIntl(nextConfig), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "dragonballdle-org",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/api/sentry-tunnel",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
