import { MainContainer } from "@/components/_UI/MainContainer";
import { MartialArtsAutocompleteField } from "@/components/MartialArtsAutocompleteField";
import { MartialArtsHero } from "@/components/MartialArtsHero";

export default function ClassicPage() {
  return (
    <MainContainer>
      <MartialArtsHero />
      <MartialArtsAutocompleteField
        className="w-full"
        suggestions={[
          {
            id: "goku",
            name: "Goku",
            image: "https://cdn.dragonballdle.site/characters/thumbs/goku.png",
          },
          {
            id: "vegeta",
            name: "Vegeta",
            image:
              "https://cdn.dragonballdle.site/characters/thumbs/vegeta.png",
          },
        ]}
      />
    </MainContainer>
  );
}
