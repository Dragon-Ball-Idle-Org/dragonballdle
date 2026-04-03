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
  if (request.nextUrl.pathname.startsWith("/api")) {
    const response = await normalizeQueryParamLocale(request);

    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
