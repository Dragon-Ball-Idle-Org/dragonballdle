import { MainContainer } from "@/components/ui/MainContainer";
import { MartialArtsAutocompleteField } from "@/components/themed/MartialArtsAutocompleteField";
import { MartialArtsHero } from "@/components/themed/MartialArtsHero";
import { MartialArtsYesterdayCharacter } from "@/components/themed/MartialArtsYesterdayCharacter";

export default function ClassicPage() {
  return (
    <MainContainer>
      <MartialArtsHero />
      <MartialArtsYesterdayCharacter />
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
