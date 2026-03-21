import { routing } from "@/i18n/routing";
import { Header } from "@/components/Header";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }));
}

export default async function LegalLayout({
  children,
}: LayoutProps<"/[lang]/legal">) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
