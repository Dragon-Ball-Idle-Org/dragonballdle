import { SITE_URL } from "@/constants/site";
import { routing } from "@/i18n/routing";

/** schema.org WebSite — home layout only */
export function WebsiteJsonLd({ description }: { description: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DragonBallDle",
    url: SITE_URL,
    description,
    inLanguage: routing.locales,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}
