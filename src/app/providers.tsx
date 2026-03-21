"use client";

import { NextIntlClientProvider } from "next-intl";

export function Providers({ children, locale }: { children: React.ReactNode, locale: string }) {
  return <NextIntlClientProvider locale={locale}>{children}</NextIntlClientProvider>;
}