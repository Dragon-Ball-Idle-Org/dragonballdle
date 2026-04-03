import { createClient } from "@/lib/supabase/client";

export async function getWinsCount() {
  const supabase = createClient();
  const date = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase.functions.invoke("increment-wins", {
    body: { date },
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY}`,
    },
  });

  if (error) {
    console.error("[getWinsCount] Error fetching wins count:", error);
    return 0;
  }

  return data?.wins_count ?? 0;
}
