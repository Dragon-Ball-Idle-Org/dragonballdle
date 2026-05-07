import { createClient } from "@supabase/supabase-js";
import { CORS_HEADERS } from "../_shared/cors.ts";
import { isAuthorized, unauthorizedResponse, methodNotAllowedResponse } from "../_shared/auth.ts";
import { VALID_GAME_MODES, GameMode } from "../_shared/types.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return methodNotAllowedResponse();
  }

  if (!(await isAuthorized(req))) {
    return unauthorizedResponse();
  }

  try {
    const { date, game_mode, guess_count } = await req.json();

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return Response.json({ error: "invalid date" }, { status: 400, headers: CORS_HEADERS });
    }

    if (!game_mode || !VALID_GAME_MODES.includes(game_mode as GameMode)) {
      return Response.json({ error: "invalid game_mode" }, { status: 400, headers: CORS_HEADERS });
    }

    if (typeof guess_count !== "number" || guess_count <= 0) {
      return Response.json({ error: "invalid guess_count" }, { status: 400, headers: CORS_HEADERS });
    }

    const secretKeysRaw = Deno.env.get("SUPABASE_SECRET_KEYS");
    let secretKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (secretKeysRaw) {
      try {
        const keys = JSON.parse(secretKeysRaw);
        secretKey = Object.values(keys)[0] as string;
      } catch {
        // Fallback for comma-separated or single string
        secretKey = secretKeysRaw.split(",")[0];
      }
    }

    if (!secretKey) {
      throw new Error("Missing secret key for database operations");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      secretKey,
    );

    const { data, error } = await supabase.rpc("record_guess", {
      p_game_date: date,
      p_game_mode: game_mode,
      p_guess_count: guess_count,
    });

    if (error) throw error;

    return Response.json({ date, guess_count, total_in_bucket: data }, { headers: CORS_HEADERS });
  } catch (err) {
    console.error("[record-guess]", err);
    return Response.json({ error: "internal error" }, { status: 500, headers: CORS_HEADERS });
  }
});
