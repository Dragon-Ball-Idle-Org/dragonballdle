import { SITE_URL } from "@/constants/site";
import { routing } from "@/i18n/routing";
import { MetadataRoute } from "next";

const pages = ["", "legal", "contact-us", "classic", "silhouette"];

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL;
  const lastModified = new Date();

  return routing.locales.flatMap((locale) =>
    pages.map((page) => {
      const path = page === "" ? `${locale}/` : `${locale}/${page}/`;
      return {
        url: `${origin}/${path}`,
        lastModified,
        changeFrequency:
          page === "" || page === "classic" ? "daily"
          : page === "silhouette" ? "daily"
          : "weekly",
        priority:
          page === "" ? 1 : page === "classic" || page === "silhouette" ? 0.9 : 0.7,
      } satisfies MetadataRoute.Sitemap[number];
    }),
  );
}
