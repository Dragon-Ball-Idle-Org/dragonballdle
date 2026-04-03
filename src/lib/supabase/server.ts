import { Database } from "@/types/database";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    { cookies: { getAll: async () => (await cookies()).getAll() } },
  );
}

export function createClientWithTag(tag: string) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: { getAll: async () => (await cookies()).getAll() },
      global: {
        fetch: (url, options) =>
          fetch(url, { ...options, next: { tags: [tag] } }),
      },
    },
  );
}
