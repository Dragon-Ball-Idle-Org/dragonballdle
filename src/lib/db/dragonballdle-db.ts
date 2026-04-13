"use client";

import Dexie, { type EntityTable } from "dexie";
import { CachedCharacter } from "./models/character.model";
import { HydrationMeta } from "./models/hidration-meta-model";

export class DragonBallDleDatabase extends Dexie {
  characters!: EntityTable<CachedCharacter, "slug">;
  meta!: EntityTable<HydrationMeta, "id">;

  constructor() {
    super("dragonballdle-cache");
    this.version(1).stores({
      characters: "slug, locale, [locale+name]",
      meta: "id",
    });
  }
}

let db: DragonBallDleDatabase | null = null;

export function getDB() {
  if (typeof window === "undefined") return null;

  if (!db) {
    db = new DragonBallDleDatabase();
  }

  return db;
}
