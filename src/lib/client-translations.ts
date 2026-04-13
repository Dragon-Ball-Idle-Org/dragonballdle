import { getTranslations as getServerTranslations } from "next-intl/server";

export type TranslateType =
  | "home"
  | "classic"
  | "silhouette"
  | "silhouetteHero"
  | "silhouetteViewer"
  | "winModal"
  | "winBanner"
  | "share"
  | "hero"
  | "contact";

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
        silhouette: {
          title: t("home.silhouette.title"),
          subtitle: t("home.silhouette.subtitle"),
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
    silhouette: {
      silhouette: {
        dailyNotFound: t("silhouette.dailyNotFound"),
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
    silhouetteHero: {
      silhouetteHero: {
        title: t("silhouetteHero.title"),
        subtitle: t("silhouetteHero.subtitle"),
      },
    },
    silhouetteViewer: {
      silhouetteViewer: {
        revealPercent: t("silhouetteViewer.revealPercent", { percent: "__P__" }),
        guessCountOne: t("silhouetteViewer.guessCountOne"),
        guessCountMany: t("silhouetteViewer.guessCountMany", {
          count: "__C__",
        }),
        characterRevealed: t("silhouetteViewer.characterRevealed"),
        imageAltDaily: t("silhouetteViewer.imageAltDaily"),
        imageAltRevealed: t("silhouetteViewer.imageAltRevealed", {
          name: "__NAME__",
        }),
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
        playSilhouette: t("winBanner.playSilhouette"),
      },
    },
    share: {
      share: {
        tweet: {
          one: t("share.tweet.one", {
            tries: "1",
            guesses: "[guesses]",
            url: "[url]",
          }),
          other: t("share.tweet.other", {
            tries: "[tries]",
            guesses: "[guesses]",
            url: "[url]",
          }),
          silhouetteOne: t("share.silhouette.one", {
            tries: "1",
            guesses: "[guesses]",
            url: "[url]",
          }),
          silhouetteOther: t("share.silhouette.other", {
            tries: "[tries]",
            guesses: "[guesses]",
            url: "[url]",
          }),
        },
      },
    },
    contact: {
      contact: {
        title: t("contact.title"),
        description: t("contact.description"),
        directEmail: t("contact.directEmail"),
        nameLabel: t("contact.nameLabel"),
        namePlaceholder: t("contact.namePlaceholder"),
        emailLabel: t("contact.emailLabel"),
        emailPlaceholder: t("contact.emailPlaceholder"),
        messageLabel: t("contact.messageLabel"),
        messagePlaceholder: t("contact.messagePlaceholder"),
        copyButton: t("contact.copyButton"),
        copiedFeedback: t("contact.copiedFeedback"),
        sendButton: t("contact.sendButton"),
        submitSuccess: t("contact.submitSuccess"),
        submitError: t("contact.submitError"),
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
