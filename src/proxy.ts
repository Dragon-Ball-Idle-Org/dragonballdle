import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

async function normalizeQueryParamLocale(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale");

  if (locale && locale !== locale.toLowerCase()) {
    const url = request.nextUrl.clone();
    url.searchParams.set("locale", locale.toLowerCase());
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export async function proxy(request: NextRequest) {
  let response: NextResponse;
  
  if (request.nextUrl.pathname.startsWith("/api")) {
    response = await normalizeQueryParamLocale(request);
  } else {
    response = intlMiddleware(request);
  }

  // Set CSP headers
  const isDev = process.env.NODE_ENV === "development";
  const localhostConnect = isDev
    ? " ws://localhost:* ws://127.0.0.1:* http://localhost:* http://127.0.0.1:*"
    : "";

  const ContentSecurityPolicy = `
    default-src 'self' vercel.live;
    script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel.com https://www.googletagmanager.com https://static.cloudflareinsights.com *.google.com www.google.com google.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https://cdn.dragonballdle.site https://pub-7a42112fb83543e09f959229a0efd07f.r2.dev vercel.live https://www.google.com.br https://*.google.com https://*.doubleclick.net https://www.googletagmanager.com;
    font-src 'self';
    connect-src 'self' *.supabase.co wss://*.supabase.co *.sentry.io *.vercel.com https://analytics.google.com https://www.google.com https://*.google.com.br https://stats.g.doubleclick.net https://*.doubleclick.net https://google.com${localhostConnect};
    frame-src 'self' *.vercel.com https://*.doubleclick.net https://googleads.g.doubleclick.net;
    worker-src 'self' blob:;
    form-action 'self';
    frame-ancestors 'none';
    base-uri 'self';
    object-src 'none';
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  response.headers.set("Content-Security-Policy", ContentSecurityPolicy);
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), browsing-topics=()");

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  // - … Sentry's tunnel route `/monitoring`
  matcher: ["/((?!api|_next|_vercel|monitoring|.*\\..*).*)"],
};
