import { Header } from "@/components/ui/Header";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo/build-page-metadata";
import { ClassicProviders } from "./providers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "metadata" });

  return buildPageMetadata({
    locale: lang,
    slug: "classic",
    title: t("title"),
    description: t("description"),
  });
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }));
}
export default async function ClassicLayout({
  children,
  params,
}: LayoutProps<"/[lang]/classic">) {
  const { lang } = await params;

  return (
    <ClassicProviders locale={lang}>
      <Header />
      {children}
    </ClassicProviders>
  );
}
