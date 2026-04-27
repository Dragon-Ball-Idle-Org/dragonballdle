import { getDailyCharacter } from "@/features/game-engine/services/daily";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function main() {
  console.log("Fetching daily character for pt-BR...");
  const char = await getDailyCharacter("pt-BR");
  console.log(char);
}

main().catch(console.error);
