import type { Metadata } from "next";
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
    title: t("title"),
    description: t("description"),
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
    alternates: {
      canonical: `https://dragonballdle.site/${lang}/`,
      languages: {
        "x-default": `https://dragonballdle.site/${routing.defaultLocale}/`,
        ...Object.fromEntries(
          routing.locales.map((locale) => [
            locale,
            `https://dragonballdle.site/${locale}/`,
          ]),
        ),
      },
    },
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

  const roles = {
    frontend: tCommon("roles.frontend"),
    analytics: tCommon("roles.analytics"),
    fullstack: tCommon("roles.fullstack"),
  };

  return (
    <html lang={lang}>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
      <body
        className={`${roboto.variable} ${bangers.variable} ${inter.variable} antialiased`}
        style={
          {
            background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), var(--bg-image, url("${process.env.NEXT_PUBLIC_CDN_BASE_URL}/background-img.jpg")) center bottom / cover no-repeat fixed`,
          } as React.CSSProperties
        }
      >
        <SplashScreen />
        <Providers locale={lang}>
          <h1 className="hidden">DragonBallDle</h1>
          {children}
          <Footer />
          <BottomNavBar
            socialLinksTitle={tSocial("title")}
            roles={roles}
            languagesDrawerTitle={tCommon("language")}
            changeLanguageButtonTitle={tCommon("changeLanguage")}
          />
        </Providers>
      </body>
    </html>
  );
}
