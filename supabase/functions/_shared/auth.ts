import { CORS_HEADERS } from "./cors.ts";

export function getApiKey(req: Request): string | null {
  return req.headers.get("apiKey") || req.headers.get("x-api-key");
}

export function isAuthorized(req: Request): boolean {
  const apiKey = getApiKey(req);
  const publishableKeys = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS")?.split(",") ?? [];
  return !!apiKey && publishableKeys.includes(apiKey);
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
