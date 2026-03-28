"use client";

import { cn } from "@/utils/cn";
import { Autocomplete } from "@base-ui/react";
import Image from "next/image";

type Suggestion = {
  id: string;
  name: string;
  image?: string;
};

type MartialArtsAutocompleteFieldProps = {
  suggestions: Suggestion[];
  className?: string;
};

export function MartialArtsAutocompleteField({
  suggestions,
  className,
}: MartialArtsAutocompleteFieldProps) {
  return (
    <Autocomplete.Root items={suggestions}>
      <div
        className={cn(
          "w-full",
          "relative before:absolute before:content-[''] before:inset-0 before:border-24 before:border-transparent before:pointer-events-none before:[border-image:url('/assets/dragon-border.svg')_500_stretch] before:z-1",
        )}
      >
        <Autocomplete.Input
          className={cn(
            "guess-input h-14 w-full px-6 font-ui text-md font-semibold text-on-primary caret-on-primary bg-primary",
            "focus-visible:outline-2 focus-visible:outline-primary-light focus-visible:outline-offset-2",
            className,
          )}
          placeholder="Type character name..."
        />
      </div>

      <Autocomplete.Portal>
        <Autocomplete.Positioner sideOffset={5}>
          <Autocomplete.Popup
            className={cn(
              "max-h-100 w-(--anchor-width) max-w-(--available-width)",
              "bg-primary border-2 border-primary-dark rounded-md shadow-[0_10px_24px_rgba(0,0,0,0.35)] overflow-y-auto",
            )}
          >
            <Autocomplete.Empty className="flex items-center p-5 font-ui font-semibold text-white empty:m-0 empty:p-0">
              No characters found...
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
                >
                  {suggestion.image ? (
                    <Image
                      src={suggestion.image}
                      alt={suggestion.name}
                      width={56}
                      height={56}
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
