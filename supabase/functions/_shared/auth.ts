import { CORS_HEADERS } from "./cors.ts";
import { verify } from "djwt";

export function getApiKey(req: Request): string | null {
  return req.headers.get("apiKey") || req.headers.get("x-api-key");
}

export async function isAuthorized(req: Request): Promise<boolean> {
  const apiKey = getApiKey(req);
  const jwtSecret = Deno.env.get("SUPABASE_JWT_SECRET");

  if (!apiKey || !jwtSecret) {
    console.error("[auth] Missing API Key or JWT Secret");
    return false;
  }

  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(jwtSecret);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    await verify(apiKey, cryptoKey);
    return true;
  } catch (err) {
    console.error("[auth] JWT validation failed:", err.message);
    return false;
  }
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
