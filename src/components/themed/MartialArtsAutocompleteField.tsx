"use client";

import { cn } from "@/utils/cn";
import { Autocomplete } from "@base-ui/react";
import { useState } from "react";
import { useTranslations } from "@/contexts/TranslationContext";
import { SpinnerIcon } from "@phosphor-icons/react";
import { ImageWithFallback } from "../ui/ImageWithFallback";

type Suggestion = {
  id: string;
  name: string;
  image?: string;
};

type MartialArtsAutocompleteFieldProps = {
  suggestions: Suggestion[];
  className?: string;
  submitOnSelect?: boolean;
  onChange: (value: string) => void;
  onSelect: (id: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
};

export function MartialArtsAutocompleteField({
  suggestions,
  className,
  submitOnSelect,
  onChange,
  onSelect,
  disabled,
  isLoading = true,
}: MartialArtsAutocompleteFieldProps) {
  const [value, setValue] = useState("");
  const translations = useTranslations("common");

  const handleChange = (value: string) => {
    setValue(value);
    onChange(value);
  };

  const handleSelect = (id: string) => {
    onSelect(id);
    if (submitOnSelect) {
      setValue("");
    }
  };

  return (
    <Autocomplete.Root items={suggestions} submitOnItemClick={submitOnSelect} autoHighlight="always">
      <div className="w-full border-martial-arts-sm">
        <Autocomplete.Input
          className={cn(
            "guess-input h-14 w-full px-6 font-ui text-md font-semibold text-on-primary caret-on-primary bg-primary",
            "focus-visible:outline-2 focus-visible:outline-primary-light focus-visible:outline-offset-2",
            className,
          )}
          placeholder={translations.searchPlaceholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
        />
      </div>

      <Autocomplete.Portal className="z-10">
        <Autocomplete.Positioner sideOffset={5}>
          <Autocomplete.Popup
            className={cn(
              "max-h-100 w-(--anchor-width) max-w-(--available-width)",
              "bg-primary border-2 border-primary-dark rounded-md shadow-[0_10px_24px_rgba(0,0,0,0.35)] overflow-y-auto",
            )}
          >
            <Autocomplete.Empty className="flex items-center justify-center p-5 font-ui font-semibold text-white empty:m-0 empty:p-0">
              {isLoading ? (
                <SpinnerIcon className="animate-spin w-10 h-10" />
              ) : (
                translations.noResults
              )}
            </Autocomplete.Empty>
            <Autocomplete.List>
              {(suggestion) => (
                <Autocomplete.Item
                  key={suggestion.id}
                  value={suggestion.id}
                  className={cn(
                    "flex items-center gap-3 px-3 min-h-20",
                    "font-ui font-semibold text-white cursor-pointer transition-background duration-120 ease-linear",
                    "odd:bg-black/3 even:bg-black/8 hover:bg-white/16",
                    "data-highlighted:bg-white/22 data-highlighted:outline-2 data-highlighted:outline-primary-dark data-highlighted:-outline-offset-2",
                  )}
                  onClick={() => handleSelect(suggestion.id)}
                >
                  {suggestion.image ? (
                    <ImageWithFallback
                      src={suggestion.image}
                      alt={suggestion.name}
                      width={56}
                      height={56}
                      quality={100}
                      className="size-14 object-cover rounded-sm bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.18)]"
                    />
                  ) : (
                    <h1 className="font-display text-9xl">?</h1>
                  )}
                  <span className="[text-shadow:2px_2px_3px_#000000]">
                    {suggestion.name}
                  </span>
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  );
}
