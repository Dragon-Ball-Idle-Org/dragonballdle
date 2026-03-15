import type { Metadata } from "next";
import { Roboto, Bangers, Inter } from "next/font/google";
import "./globals.css";

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
  title: "DragonBallDle - Jogo de Adivinhação",
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
      >
        {children}
      </body>
    </html>
  );
}
