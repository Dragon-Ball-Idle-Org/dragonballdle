import { getTranslations } from "next-intl/server";
import { MetadataRoute } from "next";

export default async function manifest({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<MetadataRoute.Manifest> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "manifest" });

  return {
    name: "DragonBallDle",
    short_name: "DBDle",
    start_url: `/${lang}/`,
    display: "standalone",
    background_color: "#fb8c00",
    theme_color: "#fb8c00",
    description: t("description"),
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
