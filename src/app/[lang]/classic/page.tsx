import { MartialArtsAutocompleteField } from "@/components/MartialArtsAutocompleteField";

export default function ClassicPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-3 my-3">
      <MartialArtsAutocompleteField
        suggestions={[
          {
            id: "goku",
            name: "Goku",
            image: "https://cdn.dragonballdle.site/characters/thumbs/goku.png",
          },
          {
            id: "vegeta",
            name: "Vegeta",
            image: "https://cdn.dragonballdle.site/characters/thumbs/vegeta.png",
          },
        ]}
      />
    </main>
  );
}
