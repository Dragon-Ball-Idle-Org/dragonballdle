import { TranslationProvider } from "@/contexts/TranslationContext";
import { getTranslationsBundle } from "@/lib/client-translations";

export async function ContactUsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const translations = await getTranslationsBundle("contact");

  return (
    <TranslationProvider translations={translations}>
      {children}
    </TranslationProvider>
  );
}
