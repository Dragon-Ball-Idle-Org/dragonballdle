import { NextRequest } from "next/server";

export async function parseBody<T extends Record<string, unknown>>(
  req: NextRequest,
): Promise<T> {
  const body = (await req.json()) as T;
 if ("locale" in body && typeof body.locale === "string") {
   (body as Record<string, unknown>).locale = body.locale.toLowerCase();
 }
  return body;
}
