"use client";

import { cn } from "@/utils/cn";
import {
  CaretDownIcon,
  CopySimpleIcon,
  XLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "@/contexts/TranslationContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGuessesContext } from "@/contexts/GuessesContext";
import { compareGuess } from "@/utils/guess";
import { buildShareText } from "@/utils/build-share-text";

type ShareDropdownProps = {
  todayCharacterSlug: string;
};

export function ShareDropdown({ todayCharacterSlug }: ShareDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { guesses, tries } = useGuessesContext();
  const translations = useTranslations("winBanner");
  const shareTextTranslations = useTranslations("share");

  const shareText = useMemo(() => {
    const dailyChar = guesses.find((g) => g.slug === todayCharacterSlug)!;
    const comparedGuesses = guesses.map((g) => compareGuess(g, dailyChar));

    return buildShareText({
      tries,
      headers: [
        { value: "character" },
        { value: "gender" },
        { value: "race" },
        { value: "affiliation" },
        { value: "transformation" },
        { value: "attribute" },
        { value: "series" },
        { value: "debut_saga" },
      ],
      guesses: comparedGuesses,
      translations: shareTextTranslations,
    });
  }, [tries, guesses, todayCharacterSlug, shareTextTranslations]);

  const xShareUrl = useMemo(() => {
    return (
      "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText)
    );
  }, [shareText]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleShareX = () => {
    window.open(xShareUrl, "_blank", "noopener");
    setIsOpen(false);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center justify-center gap-2 w-full sm:w-auto! max-h-11 rounded-xl p-4",
          "bg-linear-135 from-green-500 to-green-700 shadow-[inset_0_0_0_1px_#fff3,0_6px_14px_#00000040]",
          "transition-transform ease-linear hover:scale-105",
          "text-white font-ui font-black leading-none cursor-pointer",
        )}
      >
        <span>{translations.share}</span>
        <CaretDownIcon size={16} weight="bold" />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full mt-2 right-0 z-50",
            "min-w-48 rounded-xl bg-linear-135 from-green-600 to-green-700 border border-white/25",
            "shadow-[0_8px_20px_#00000042] overflow-hidden",
          )}
        >
          <button
            onClick={handleShareX}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3",
              "hover:bg-white/10 transition-colors text-left",
              "border-b border-white/12 last:border-b-0",
              "text-white font-ui font-semibold text-nowrap text-center cursor-pointer",
            )}
          >
            <XLogoIcon size={18} weight="fill" />
            <span>{translations.shareOnX}</span>
          </button>
          <button
            onClick={handleCopyText}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3",
              "hover:bg-white/10 transition-colors text-left",
              "border-b border-white/12 last:border-b-0",
              "text-white font-ui font-semibold text-nowrap text-center cursor-pointer",
            )}
          >
            <CopySimpleIcon size={18} weight="regular" />
            <span>{translations.copyToClipboard}</span>
          </button>
        </div>
      )}
    </div>
  );
}
