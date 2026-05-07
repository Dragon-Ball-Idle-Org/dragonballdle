import { CORS_HEADERS } from "./cors.ts";
import { verify } from "djwt";

export function getApiKey(req: Request): string | null {
  return req.headers.get("apiKey") || req.headers.get("x-api-key") || req.headers.get("apikey");
}

export async function isAuthorized(req: Request): Promise<boolean> {
  const apiKey = getApiKey(req);
  
  if (!apiKey) {
    console.error("[auth] No API Key provided in headers");
    return false;
  }

  // 1. Check SUPABASE_PUBLISHABLE_KEYS (Modern JSON format)
  const publishableKeysRaw = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS");
  if (publishableKeysRaw) {
    try {
      const keys = JSON.parse(publishableKeysRaw);
      // The keys object usually has 'default' or project-specific keys
      const allowedKeys = Object.values(keys);
      if (allowedKeys.includes(apiKey)) {
        return true;
      }
    } catch (err) {
      console.error("[auth] Error parsing SUPABASE_PUBLISHABLE_KEYS:", err.message);
    }
  }

  // 2. Fallback to SUPABASE_ANON_KEY (Legacy format)
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (anonKey && apiKey === anonKey) {
    return true;
  }

  console.error("[auth] Unauthorized: API Key does not match any allowed keys");
  return false;
}

export function unauthorizedResponse() {
  return Response.json(
    { error: "unauthorized" },
    { status: 401, headers: CORS_HEADERS },
  );
}

export function methodNotAllowedResponse() {
  return Response.json(
    { error: "method not allowed" },
    { status: 405, headers: CORS_HEADERS },
  );
}
