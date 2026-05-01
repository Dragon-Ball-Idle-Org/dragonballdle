import { SITE_URL } from "@/constants/site";
import {
  AI_USER_AGENTS,
  DISALLOW_PUBLIC_SURFACES,
} from "@/lib/seo/crawler-policy";
import type { MetadataRoute } from "next";

/**
 * robots.txt — SEO crawlers + explicit AI/LLM bot policy (same allow/disallow as *).
 * To opt out of AI training only for some bots, split rules and adjust `disallow`.
 */
export default function robots(): MetadataRoute.Robots {
  const origin = SITE_URL.replace(/\/$/, "");
  const disallow = [...DISALLOW_PUBLIC_SURFACES];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      {
        userAgent: [...AI_USER_AGENTS],
        allow: "/",
        disallow,
      },
    ],
    host: new URL(`${SITE_URL}/`).hostname,
    sitemap: `${origin}/sitemap.xml`,
  };
}
