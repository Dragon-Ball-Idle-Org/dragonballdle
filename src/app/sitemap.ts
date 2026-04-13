import { routing } from "@/i18n/routing";
import { MetadataRoute } from "next";

const pages = ["", "legal", "contact-us", "classic", "silhouette"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = "2026-03-21";

  return routing.locales.flatMap((locale) =>
    pages.map((page) => {
      const url = new URL("https://dragonballdle.site/");
      url.pathname = `${locale}/`;
      if (page.length) {
        url.pathname = `${url.pathname}${page}/`;
      }

      return {
        url: url.toString(),
        lastModified,
      };
    }),
  );
}
