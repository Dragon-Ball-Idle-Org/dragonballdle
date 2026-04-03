import { getDailyCharacter } from "@/service/daily";
import { getCharacterBySlug } from "@/service/characters";
import { compareGuess } from "@/utils/guess";
import { NextRequest } from "next/server";
import { parseBody } from "@/utils/api";

export async function POST(req: NextRequest) {
  const { slug, locale } = await parseBody<{ slug: string; locale: string }>(
    req,
  );

  const [daily, guessed] = await Promise.all([
    getDailyCharacter(locale),
    getCharacterBySlug(slug, locale),
  ]);

  if (!daily || !guessed)
    return Response.json({ error: "Not found" }, { status: 404 });

  const result = compareGuess(guessed, daily);
  const won = result.correct;

  return Response.json({ result, won });
}
