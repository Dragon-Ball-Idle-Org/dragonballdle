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
    const { date, game_mode } = await req.json();

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return Response.json({ error: "invalid date" }, { status: 400, headers: CORS_HEADERS });
    }

    if (!game_mode || !VALID_GAME_MODES.includes(game_mode as GameMode)) {
      return Response.json(
        { error: `invalid game_mode, must be one of: ${VALID_GAME_MODES.join(", ")}` },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const secretKeys = Deno.env.get("SUPABASE_SECRET_KEYS")?.split(",") ?? [];
    const secretKey = secretKeys[0] || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!secretKey) {
      throw new Error("Missing secret key for database operations");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      secretKey,
    );

    const { data, error } = await supabase.rpc("increment_wins", {
      p_date: date,
      p_game_mode: game_mode,
    });

    if (error) throw error;

    return Response.json({ date, wins_count: data }, { headers: CORS_HEADERS });
  } catch (err) {
    console.error("[increment-wins]", err);
    return Response.json({ error: "internal error" }, { status: 500, headers: CORS_HEADERS });
  }
});
