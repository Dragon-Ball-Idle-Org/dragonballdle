import { useTranslations } from "next-intl";

export default function LegalPage() {
  const t = useTranslations("legal");

  return (
    <main className="flex-1 flex w-full flex-col items-center justify-start gap-8 py-8 px-4 sm:px-8 max-w-4xl mx-auto mt-4 mb-2 rounded-3xl bg-black/60 backdrop-blur-sm border-2 border-zinc-800/60 shadow-game">
      <div className="w-full text-center">
        <h1 className="font-display text-5xl sm:text-6xl text-primary drop-shadow-md">
          {t("title")}
        </h1>
      </div>

      <section className="flex flex-col gap-4 w-full">
        <h2 className="font-display tracking-widest text-4xl text-white border-b-2 border-zinc-800/80 pb-2">
          {t("termsTitle")}
        </h2>
        <span className="text-sm text-zinc-400 font-ui italic wrap-break-words">
          {t("termsUpdated")}
        </span>
        <p className="font-base text-lg leading-relaxed text-zinc-300">
          {t("termsIntro")}
        </p>
        <div className="flex flex-col gap-3 mt-2 pl-4 border-l-4 border-primary/50 text-zinc-300 font-base drop-shadow-sm bg-zinc-900/40 p-3 rounded-r-xl">
          <p>
            <strong className="text-white drop-shadow-sm font-semibold">
              Copyright & DMCA:
            </strong>{" "}
            {t("termsNature")}
          </p>
          <p>
            <strong className="text-white drop-shadow-sm font-semibold">
              Acceptable Use:
            </strong>{" "}
            {t("termsAcceptableUse")}
          </p>
          <p>
            <strong className="text-white drop-shadow-sm font-semibold">
              Services:
            </strong>{" "}
            {t("termsThirdParty")}
          </p>
          <p>
            <strong className="text-white drop-shadow-sm font-semibold">
              Disclaimer:
            </strong>{" "}
            {t("termsDisclaimer")}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4 w-full mt-4">
        <h2 className="font-display tracking-widest text-4xl text-white border-b-2 border-zinc-800/80 pb-2">
          {t("privacyTitle")}
        </h2>
        <span className="text-sm text-zinc-400 font-ui italic wrap-break-words">
          {t("privacyUpdated")}
        </span>
        <p className="font-base text-lg leading-relaxed text-zinc-300">
          {t("privacyIntro")}
        </p>
        <div className="flex flex-col gap-3 mt-2 pl-4 border-l-4 border-primary/50 text-zinc-300 font-base drop-shadow-sm bg-zinc-900/40 p-3 rounded-r-xl">
          <p>
            <strong className="text-white drop-shadow-sm font-semibold">
              Data:
            </strong>{" "}
            {t("privacyDataCollected")}
          </p>
          <p>
            <strong className="text-white drop-shadow-sm font-semibold">
              Basis:
            </strong>{" "}
            {t("privacyLegalBasis")}
          </p>
          <p>
            <strong className="text-white drop-shadow-sm font-semibold">
              Rights:
            </strong>{" "}
            {t("privacyYourRights")}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4 w-full mt-4">
        <h2 className="font-display tracking-widest text-4xl text-white border-b-2 border-zinc-800/80 pb-2">
          {t("cookiesTitle")}
        </h2>
        <span className="text-sm text-zinc-400 font-ui italic wrap-break-words">
          {t("cookiesUpdated")}
        </span>
        <p className="font-base text-lg leading-relaxed text-zinc-300">
          {t("cookiesIntro")}
        </p>
        <div className="flex flex-col gap-3 mt-2 pl-4 border-l-4 border-primary/50 text-zinc-300 font-base drop-shadow-sm bg-zinc-900/40 p-3 rounded-r-xl">
          <p>
            <strong className="text-white drop-shadow-sm font-semibold">
              Ads:
            </strong>{" "}
            {t("cookiesAds")}
          </p>
          <p>
            <strong className="text-white drop-shadow-sm font-semibold">
              Consent:
            </strong>{" "}
            {t("cookiesConsent")}
          </p>
        </div>
      </section>
    </main>
  );
}
