import type { Metadata } from "next";
import { Roboto, Bangers, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { routing } from "@/i18n/routing";

import "../globals.css";
import { Providers } from "../providers";
import { SplashScreen } from "@/components/_UI/SplashScreen";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const bangers = Bangers({
  variable: "--font-bangers",
  weight: ["400"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(routing.locales, lang)) {
    notFound();
  }

  setRequestLocale(lang);

  return (
    <html lang="en">
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
      <body
        className={`${roboto.variable} ${bangers.variable} ${inter.variable} antialiased`}
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("${process.env.NEXT_PUBLIC_CDN_BASE_URL}/background-img.jpg") center bottom / cover no-repeat fixed`,
        }}
      >
        <SplashScreen />
        <Providers locale={lang}>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
