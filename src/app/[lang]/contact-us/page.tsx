import { ContactForm } from "@/components/shared/ContactForm";
import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <main className="w-full min-h-screen flex flex-col max-w-4xl mx-auto mt-4 mb-2 bg-black/60 backdrop-blur-sm border-2 border-zinc-800/60 shadow-game rounded-3xl">
      <div className="flex-1 flex flex-col items-center justify-center px-3 py-10 sm:py-16">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="p-3 sm:p-4 bg-orange-600/20 rounded-full">
                <span className="text-4xl">📧</span>
              </div>
            </div>

            <h1
              className="font-display text-hero-title text-white mb-3 sm:mb-4
              text-shadow-hero-title"
            >
              {t("title")}
            </h1>

            <p
              className="font-base text-hero-subtitle text-zinc-300 max-w-2xl mx-auto
              text-shadow-hero-subtitle"
            >
              {t("description")}
            </p>
          </div>

          <div className="h-px bg-linear-to-r from-transparent via-orange-600/50 to-transparent mb-10 sm:mb-12" />

          <div className="px-0 sm:px-4">
            <ContactForm />
          </div>

          <div className="mt-12 sm:mt-16 text-center">
            <p className="font-ui text-zinc-500 text-xs sm:text-sm">
              We typically respond within 24-48 hours. Thank you for reaching
              out!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
