import type { Metadata } from "next";
import { Roboto, Bangers, Inter } from "next/font/google";
import "../globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
