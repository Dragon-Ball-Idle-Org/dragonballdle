import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/constants/site";

export type StaticPageSlug =
  | ""
  | "classic"
  | "silhouette"
  | "legal"
  | "contact-us";

function pathTail(slug: StaticPageSlug): string {
  if (slug === "") return "";
  return `${slug}/`;
}

/** hreflang alternates + canonical aligned with slug (segment after `[lang]`). */
export function buildAlternates(
  locale: string,
  slug: StaticPageSlug,
): NonNullable<Metadata["alternates"]> {
  const tail = pathTail(slug);

  const perLocale =
    slug === ""
      ? (l: string) => `${SITE_URL}/${l}/`
      : (l: string) => `${SITE_URL}/${l}/${tail}`;

  return {
    canonical: perLocale(locale),
    languages: {
      "x-default": perLocale(routing.defaultLocale),
      ...Object.fromEntries(
        routing.locales.map((l) => [l, perLocale(l)] as const),
      ),
    },
  };
}

/** Default OG image — override with NEXT_PUBLIC_OG_IMAGE_URL (absolute or site-relative). */
function defaultOgImages() {
  const raw = process.env.NEXT_PUBLIC_OG_IMAGE_URL;
  if (raw) {
    const absolute =
      raw.startsWith("http") ? raw : `${SITE_URL}${raw.startsWith("/") ? "" : "/"}${raw}`;
    return [{ url: absolute, width: 1200, height: 630, alt: "DragonBallDle" }];
  }

  const icon = `${SITE_URL}/icon.png`;
  return [{ url: icon, width: 512, height: 512, alt: "DragonBallDle" }];
}

/** Locale string for og:locale — e.g. en-US → en_US */
function ogLocaleFormat(locale: string): string {
  return locale.replace(/-/g, "_");
}

/** Full metadata blob for localized static routes (reuse in layout generateMetadata). */
export function buildPageMetadata(opts: {
  locale: string;
  slug: StaticPageSlug;
  title: string;
  description: string;
}): Metadata {
  const tail = pathTail(opts.slug);
  const pageUrl =
    opts.slug === "" ?
      `${SITE_URL}/${opts.locale}/`
    : `${SITE_URL}/${opts.locale}/${tail}`;

  const images = defaultOgImages();
  const siteName = "DragonBallDle";

  return {
    title: opts.title,
    description: opts.description,
    applicationName: siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    alternates: buildAlternates(opts.locale, opts.slug),
    openGraph: {
      type: "website",
      locale: ogLocaleFormat(opts.locale),
      url: pageUrl,
      siteName,
      title: opts.title,
      description: opts.description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      ...(Array.isArray(images) && images.length > 0 && images[0] && "url" in images[0] ?
        { images: [String(images[0].url)] }
      : {}),
    },
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?
      {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
  };
}

/** Route segment + noindex — Sentry/example/test pages. */
export function buildNoIndexMetadata(opts: {
  title: string;
  description?: string;
}): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    robots: { index: false, follow: false, nocache: true },
  };
}
