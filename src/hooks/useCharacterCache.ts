"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { HydrationMeta } from "@/lib/db/models/hidration-meta-model";
import { CachedCharacter } from "@/lib/db/models/character.model";
import { DragonBallDleDatabase, getDB } from "@/lib/db/dragonballdle-db";

const BATCH_SZ = 100;
const TTL_MS = 1000 * 60 * 60 * 6; // 6h

export function useCharacterCache(locale: string) {
  const [status, setStatus] = useState<HydrationMeta["status"]>("pending");

  useEffect(() => {
    const db = getDB();
    if (!db) return;

    checkAndHydrate(db, locale.toLowerCase());
  }, [locale]);

  async function checkAndHydrate(
    db: DragonBallDleDatabase,
    currentLocale: string,
  ) {
    const meta = await db.meta.get("hydration_status");

    const isStale = !meta || Date.now() - meta.cachedAt > TTL_MS;
    const isWrong = meta?.locale !== currentLocale;

    if (isWrong) {
      await db.characters
        .where("locale")
        .equals(meta?.locale ?? "")
        .delete();
      await db.meta.delete("hydration_status");
    }

    if (isWrong || isStale) {
      await hydrateInBackground(db, currentLocale);
    } else {
      setStatus(meta!.status);
    }
  }

  async function hydrateInBackground(
    db: DragonBallDleDatabase,
    currentLocale: string,
  ) {
    setStatus("pending");
    const supabase = createClient();

    const { count } = await supabase
      .from("characters")
      .select("*", { count: "exact", head: true });

    await db.meta.put({
      id: "hydration_status",
      locale: currentLocale,
      status: "pending",
      totalCount: count ?? 0,
      loadedCount: 0,
      cachedAt: Date.now(),
    });

    let offset = 0;
    while (true) {
      const { data: rawData, error } = await supabase.rpc(
        "get_all_characters_with_translations",
        {
          p_locale: currentLocale,
          p_limit: BATCH_SZ,
          p_offset: offset,
        },
      );

      if (error || !rawData?.length) break;

      const data = rawData as unknown as CachedCharacter[];

      await db.characters.bulkPut(
        data.map((char) => ({
          ...char,
          locale: currentLocale,
          cachedAt: Date.now(),
        })),
      );

      if (data.length < BATCH_SZ) break;
      offset += BATCH_SZ;

      await db.meta.update("hydration_status", { loadedCount: offset });
    }

    await db.meta.update("hydration_status", { status: "complete" });
    setStatus("complete");
  }

  async function findBySlug(slug: string): Promise<CachedCharacter | null> {
    const db = getDB();
    if (!db) return null;
    if (!slug) return null;

    return (await db.characters.where("slug").equals(slug).first()) ?? null;
  }

  async function findByName(query: string): Promise<CachedCharacter[]> {
    const db = getDB();
    if (!db) {
      console.warn("DB not initialized");
      return [];
    }
    if (!query) return [];

    const normalize = (s: string) =>
      s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const normalizedQuery = normalize(query);

    const all = await db.characters
      .where("locale")
      .equals(locale.toLowerCase())
      .toArray();

    return all.filter((c: CachedCharacter) =>
      normalize(c.name).includes(normalizedQuery),
    );
  }

  return { status, findBySlug, findByName };
}
