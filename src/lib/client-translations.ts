import { getTranslations as getServerTranslations } from "next-intl/server";

export type TranslateType =
  | "home"
  | "classic"
  | "winModal"
  | "winBanner"
  | "hero";

export async function getTranslationsBundle(
  type?: TranslateType | TranslateType[],
) {
  const t = await getServerTranslations();

  const essential = {
    common: {
      none: t("common.none"),
      yes: t("common.yes"),
      no: t("common.no"),
      loading: t("common.loading"),
      searchPlaceholder: t("common.searchPlaceholder"),
      noResults: t("common.noResults"),
      changeLanguage: t("common.changeLanguage"),
      language: t("common.language"),
      roles: {
        frontend: t("common.roles.frontend"),
        analytics: t("common.roles.analytics"),
        fullstack: t("common.roles.fullstack"),
      },
    },
    socialLinksModal: {
      title: t("socialLinksModal.title"),
    },
  };

  const pageSpecific = {
    home: {
      home: {
        classic: {
          title: t("home.classic.title"),
          subtitle: t("home.classic.subtitle"),
        },
        inProgress: {
          title: t("home.inProgress.title"),
          subtitle: t("home.inProgress.subtitle"),
        },
      },
    },
    classic: {
      classic: {
        dailyNotFound: t("classic.dailyNotFound"),
        table: {
          character: t("classic.table.character"),
          gender: t("classic.table.gender"),
          race: t("classic.table.race"),
          affiliation: t("classic.table.affiliation"),
          transformation: t("classic.table.transformation"),
          attribute: t("classic.table.attribute"),
          series: t("classic.table.series"),
          saga: t("classic.table.saga"),
        },
        guide: {
          header: t("classic.guide.header"),
          correct: t("classic.guide.correct"),
          partial: t("classic.guide.partial"),
          incorrect: t("classic.guide.incorrect"),
          after: t("classic.guide.after"),
          before: t("classic.guide.before"),
        },
      },
      yesterday: {
        title: t("yesterday.title"),
        characterLabel: t("yesterday.characterLabel"),
      },
      guessForm: {
        submitAlt: t("guessForm.submitAlt"),
      },
    },
  };

  const components = {
    hero: {
      hero: {
        title: t("hero.title"),
        subtitle: t("hero.subtitle"),
      },
    },
    winModal: {
      winModal: {
        congrats: t("winModal.congrats"),
        lineBefore: t("winModal.line.before"),
        lineAfter: t("winModal.line.after"),
        countdown: t("winModal.countdown"),
      },
    },
    winBanner: {
      winBanner: {
        title: t("winBanner.title"),
        tries: t("winBanner.tries"),
        nextCharacter: t("winBanner.nextCharacter"),
        todayCharacter: t("winBanner.todayCharacter"),
        share: t("winBanner.share"),
        shareOnX: t("winBanner.shareOnX"),
        copyToClipboard: t("winBanner.copyToClipboard"),
        supportUs: t("winBanner.supportUs"),
      },
    },
  };

  const types = Array.isArray(type) ? type : type ? [type] : [];

  let result: Record<string, any> = { ...essential };

  for (const tType of types) {
    const pageData =
      tType in pageSpecific
        ? pageSpecific[tType as keyof typeof pageSpecific]
        : {};
    const componentData =
      tType in components ? components[tType as keyof typeof components] : {};

    result = {
      ...result,
      ...pageData,
      ...componentData,
    };
  }

  return result as any;
}

export type TranslationsBundle = Awaited<
  ReturnType<typeof getTranslationsBundle>
>;

export type TranslationNamespace = keyof TranslationsBundle;
