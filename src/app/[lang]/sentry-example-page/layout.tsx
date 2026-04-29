import type { Metadata } from "next";
import { buildNoIndexMetadata } from "@/lib/seo/build-page-metadata";

/** Dev/diagnostics route — omit from indexing */
export const metadata: Metadata = buildNoIndexMetadata({
  title: "Sentry diagnostics",
});

export default function SentryExampleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
