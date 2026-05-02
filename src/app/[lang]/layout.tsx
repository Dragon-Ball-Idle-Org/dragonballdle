import type { Metadata } from "next";
import { WebsiteJsonLd } from "@/components/seo/WebsiteJsonLd";
import { SITE_URL } from "@/constants/site";
import { buildPageMetadata } from "@/lib/seo/build-page-metadata";
import { Roboto, Bangers, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/ui/Footer";
import { routing } from "@/i18n/routing";
import { Providers } from "../providers";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { BottomNavBar } from "@/components/mobile/BottomNavBar";
import { ChangelogTrigger } from "@/components/shared/ChangelogTrigger";
import RootClientLayout from "./layout.client";
import AdBanner from "@/components/ads/AdBanner";

import "../globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
  adjustFontFallback: false,
});

const bangers = Bangers({
  variable: "--font-bangers",
  weight: ["400"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "home.metadata" });

  return {
    metadataBase: new URL(`${SITE_URL}/`),
    ...buildPageMetadata({
      locale: lang,
      slug: "",
      title: t("title"),
      description: t("description"),
    }),
  };
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }));
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { lang } = await params;

  if (!hasLocale(routing.locales, lang)) {
    notFound();
  }

  setRequestLocale(lang);

  const tSocial = await getTranslations("socialLinksModal");
  const tCommon = await getTranslations("common");
  const tHomeMetaForJsonLd = await getTranslations({
    locale: lang,
    namespace: "home.metadata",
  });
  const tHome = await getTranslations("home");
  const tLegal = await getTranslations("legal");
  const tWinBanner = await getTranslations("winBanner");
  const tChangelog = await getTranslations("changelog");

  const roles = {
    frontend: tCommon("roles.frontend"),
    analytics: tCommon("roles.analytics"),
    fullstack: tCommon("roles.fullstack"),
  };

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
      </head>
      <body
        className={`${roboto.variable} ${bangers.variable} ${inter.variable} antialiased`}
        style={
          {
            background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), var(--bg-image, url("${process.env.NEXT_PUBLIC_CDN_BASE_URL}/background-img.jpg")) center bottom / cover no-repeat fixed`,
          } as React.CSSProperties
        }
      >
        <SplashScreen />
        <WebsiteJsonLd description={tHomeMetaForJsonLd("description")} />
        <Providers locale={lang}>
          <h1 className="hidden">DragonBallDle</h1>
          <RootClientLayout>{children}</RootClientLayout>
          <div className="w-full flex justify-center my-4">
            <AdBanner
              adScriptSrc="https://aclib.com/aclib.js"
              containerId="ad-banner-footer"
              zoneId="11261426"
              width={728}
              height={90}
            />
          </div>
          <Footer />
          <ChangelogTrigger
            latestVersion={tChangelog("latestVersion")}
            title={tChangelog("title")}
            versions={tChangelog.raw("versions")}
          />
          <BottomNavBar
            socialLinksTitle={tSocial("title")}
            roles={roles}
            languagesDrawerTitle={tCommon("language")}
            changeLanguageButtonTitle={tCommon("changeLanguage")}
            classicTitle={tHome("classic.title")}
            silhouetteTitle={tHome("silhouette.title")}
            legalTitle={tLegal("title")}
            supportUsTitle={tWinBanner("supportUs")}
          />
        </Providers>
      </body>
    </html>
  );
}
