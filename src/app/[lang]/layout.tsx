import type { Metadata } from "next";
import { Roboto, Bangers, Inter } from "next/font/google";
import { Footer } from "@/src/components/Footer";
import { Header } from "@/src/components/Header";
import { hasLocale } from "next-intl";
import { routing } from "@/src/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import "../globals.css";

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

export const metadata: Metadata = {
  title: "DragonBallDle — Jogo de Adivinhação",
  description: "O desafio diário para verdadeiros fãs de Dragon Ball",
};

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
      <body
        className={`${roboto.variable} ${bangers.variable} ${inter.variable} antialiased`}
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("${process.env.NEXT_PUBLIC_CDN_BASE_URL}/background-img.jpg") center bottom / cover no-repeat fixed`,
        }}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
