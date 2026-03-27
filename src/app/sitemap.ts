import { routing } from "@/i18n/routing";
import { MetadataRoute } from "next";

const pages = ["", "/legal"];

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date("2026-03-21");

    return routing.locales.flatMap(locale => 
        pages.map(page => ({
            url: `https://dragonballdle.site/${locale}${page}`,
            lastModified
        }))
    )
}