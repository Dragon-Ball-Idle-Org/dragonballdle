


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "hypopg" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "index_advisor" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "unaccent" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."get_all_characters_with_translations"("p_locale" "text", "p_limit" integer DEFAULT 100, "p_offset" integer DEFAULT 0) RETURNS SETOF json
    LANGUAGE "sql" STABLE
    AS $$
  SELECT
    json_build_object(
      'slug',                c.slug,
      'thumb_path',          c.thumb_path,
      'has_transformations', c.has_transformations,
      'name',                ct.name,
      'gender',              json_build_object('slug', g.slug,  'name', gt.name),
      'series',              json_build_object('slug', se.slug, 'name', st.name),
      'debut_saga',          json_build_object('slug', sa.slug, 'name', sat.name, 'sort_order', sa.sort_order),
      'races', (
        SELECT json_agg(json_build_object('slug', r.slug, 'name', rt.name))
        FROM   character_races cr
        JOIN   races r            ON r.id  = cr.race_id
        JOIN   race_translations rt ON rt.race_id = r.id AND rt.locale = p_locale
        WHERE  cr.character_id = c.id
      ),
      'affiliations', (
        SELECT json_agg(json_build_object('slug', a.slug, 'name', at.name))
        FROM   character_affiliations ca
        JOIN   affiliations a              ON a.id  = ca.affiliation_id
        JOIN   affiliation_translations at ON at.affiliation_id = a.id AND at.locale = p_locale
        WHERE  ca.character_id = c.id
      ),
      'attributes', (
        SELECT json_agg(json_build_object('slug', at2.slug, 'name', att.name))
        FROM   character_attributes cat
        JOIN   attributes at2              ON at2.id = cat.attribute_id
        JOIN   attribute_translations att  ON att.attribute_id = at2.id AND att.locale = p_locale
        WHERE  cat.character_id = c.id
      )
    )
  FROM  characters c
  JOIN  character_translations ct  ON ct.character_id = c.id  AND ct.locale = p_locale
  LEFT JOIN genders g              ON g.id  = c.gender_id
  LEFT JOIN gender_translations gt ON gt.gender_id = g.id     AND gt.locale = p_locale
  LEFT JOIN series se              ON se.id = c.serie_id
  LEFT JOIN series_translations st ON st.serie_id = se.id     AND st.locale = p_locale
  LEFT JOIN sagas sa               ON sa.id = c.saga_id
  LEFT JOIN saga_translations sat  ON sat.saga_id = sa.id     AND sat.locale = p_locale
  ORDER BY c.slug
  LIMIT  p_limit
  OFFSET p_offset;
$$;


ALTER FUNCTION "public"."get_all_characters_with_translations"("p_locale" "text", "p_limit" integer, "p_offset" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_character_with_translations"("p_slug" "text", "p_locale" "text") RETURNS json
    LANGUAGE "sql" STABLE
    AS $$select
  json_build_object(
    'slug',
    c.slug,
    'thumb_path',
    c.thumb_path,
    'has_transformations',
    c.has_transformations,
    'name',
    ct.name,
    'gender',
    json_build_object('slug', g.slug, 'name', gt.name),
    'series',
    json_build_object('slug', se.slug, 'name', st.name),
    'debut_saga',
    json_build_object(
      'slug',
      sa.slug,
      'name',
      sat.name,
      'sort_order',
      sa.sort_order
    ),
    'races',
    (
      select
        json_agg(
          json_build_object('slug', r.slug, 'name', rt.name)
        )
      from
        character_races cr
        join races r on r.id = cr.race_id
        join race_translations rt on rt.race_id = r.id
        and rt.locale = p_locale
      where
        cr.character_id = c.id
    ),
    'affiliations',
    (
      select
        json_agg(
          json_build_object('slug', a.slug, 'name', at.name)
        )
      from
        character_affiliations ca
        join affiliations a on a.id = ca.affiliation_id
        join affiliation_translations at on at.affiliation_id = a.id
        and at.locale = p_locale
      where
        ca.character_id = c.id
    ),
    'attributes',
    (
      select
        json_agg(
          json_build_object('slug', at2.slug, 'name', att.name)
        )
      from
        character_attributes cat
        join attributes at2 on at2.id = cat.attribute_id
        join attribute_translations att on att.attribute_id = at2.id
        and att.locale = p_locale
      where
        cat.character_id = c.id
    )
  )
from
  characters c
  join character_translations ct on ct.character_id = c.id
  and ct.locale = p_locale
  left join genders g on g.id = c.gender_id
  left join gender_translations gt on gt.gender_id = g.id
  and gt.locale = p_locale
  left join series se on se.id = c.serie_id
  left join series_translations st on st.serie_id = se.id
  and st.locale = p_locale
  left join sagas sa on sa.id = c.saga_id
  left join saga_translations sat on sat.saga_id = sa.id
  and sat.locale = p_locale
where
  c.slug = p_slug;$$;


ALTER FUNCTION "public"."get_character_with_translations"("p_slug" "text", "p_locale" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_wins"("p_date" "date", "p_game_mode" "text") RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_wins INTEGER;
BEGIN
  INSERT INTO wins (game_date, game_mode, wins_count)
    VALUES (p_date, p_game_mode, 1)
  ON CONFLICT (game_date, game_mode) DO UPDATE
    SET wins_count = wins.wins_count + 1
  RETURNING wins_count INTO v_wins;

  RETURN v_wins;
END;
$$;


ALTER FUNCTION "public"."increment_wins"("p_date" "date", "p_game_mode" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_characters"("query" "text", "loc" "text") RETURNS TABLE("name" "text", "slug" "text", "thumb_path" "text")
    LANGUAGE "sql" STABLE
    AS $$SELECT ct.name, c.slug, c.thumb_path 
  FROM character_translations ct
  JOIN characters c ON c.id = ct.character_id
  WHERE ct.locale = loc 
    AND unaccent(ct.name) ILIKE '%' || unaccent(query) || '%'
  ORDER BY
    CASE
      WHEN lower(unaccent(ct.name)) = lower(unaccent(query))           THEN 0  -- match exato
      WHEN lower(unaccent(ct.name)) ILIKE lower(unaccent(query)) || '%' THEN 1  -- prefixo
      ELSE 2  -- ✅ adicionar valor aqui
    END,
    ct.name  -- alfabético como desempate$$;


ALTER FUNCTION "public"."search_characters"("query" "text", "loc" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."affiliation_translations" (
    "affiliation_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "locale" character varying NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."affiliation_translations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."affiliations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."affiliations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."attribute_translations" (
    "attribute_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "locale" character varying NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."attribute_translations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."attributes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."attributes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."character_affiliations" (
    "character_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "affiliation_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."character_affiliations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."character_attributes" (
    "character_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "attribute_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."character_attributes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."character_races" (
    "character_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "race_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."character_races" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."character_translations" (
    "character_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "locale" character varying NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "search_vector" "tsvector" GENERATED ALWAYS AS ("to_tsvector"('"simple"'::"regconfig", "name")) STORED
);


ALTER TABLE "public"."character_translations" OWNER TO "postgres";


COMMENT ON TABLE "public"."character_translations" IS 'Dragon Ball character info translations';



CREATE TABLE IF NOT EXISTS "public"."characters" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "image_path" "text",
    "thumb_path" "text",
    "silhouette_path" "text",
    "slug" character varying NOT NULL,
    "saga_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "has_transformations" boolean NOT NULL,
    "gender_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "serie_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "silhouette_colored_path" "text" GENERATED ALWAYS AS ((('/characters/silhouettes-colored/'::"text" || ("slug")::"text") || '.png'::"text")) STORED
);


ALTER TABLE "public"."characters" OWNER TO "postgres";


COMMENT ON TABLE "public"."characters" IS 'Dragon Ball Characters';



CREATE TABLE IF NOT EXISTS "public"."daily_characters" (
    "day_index" integer NOT NULL,
    "character_id" "uuid",
    "date" "date" GENERATED ALWAYS AS (('2024-01-01'::"date" + "day_index")) STORED,
    "game_mode" "text" DEFAULT 'classic'::"text" NOT NULL
);


ALTER TABLE "public"."daily_characters" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."gender_translations" (
    "gender_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "locale" character varying NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."gender_translations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."genders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."genders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."race_translations" (
    "race_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "locale" character varying NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."race_translations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."races" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."races" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."saga_translations" (
    "saga_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "locale" character varying NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."saga_translations" OWNER TO "postgres";


COMMENT ON TABLE "public"."saga_translations" IS 'Saga name translations';



CREATE TABLE IF NOT EXISTS "public"."sagas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sort_order" integer NOT NULL,
    "type" character varying NOT NULL,
    "slug" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."sagas" OWNER TO "postgres";


COMMENT ON TABLE "public"."sagas" IS 'Dragon Ball Sagas';



CREATE TABLE IF NOT EXISTS "public"."series" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."series" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."series_translations" (
    "serie_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "locale" character varying NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."series_translations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."wins" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "game_date" timestamp with time zone DEFAULT "now"() NOT NULL,
    "wins_count" numeric DEFAULT '0'::numeric NOT NULL,
    "game_mode" "text" NOT NULL
);


ALTER TABLE "public"."wins" OWNER TO "postgres";


COMMENT ON TABLE "public"."wins" IS 'Table to count wins per day';



ALTER TABLE ONLY "public"."affiliation_translations"
    ADD CONSTRAINT "affiliation_translations_pkey" PRIMARY KEY ("affiliation_id", "locale");



ALTER TABLE ONLY "public"."affiliations"
    ADD CONSTRAINT "affiliations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."affiliations"
    ADD CONSTRAINT "affiliations_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."attribute_translations"
    ADD CONSTRAINT "attribute_translations_pkey" PRIMARY KEY ("attribute_id", "locale");



ALTER TABLE ONLY "public"."attributes"
    ADD CONSTRAINT "attributes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."attributes"
    ADD CONSTRAINT "attributes_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."character_affiliations"
    ADD CONSTRAINT "character_affiliations_pkey" PRIMARY KEY ("character_id", "affiliation_id");



ALTER TABLE ONLY "public"."character_attributes"
    ADD CONSTRAINT "character_attributes_pkey" PRIMARY KEY ("character_id", "attribute_id");



ALTER TABLE ONLY "public"."character_races"
    ADD CONSTRAINT "character_races_pkey" PRIMARY KEY ("character_id", "race_id");



ALTER TABLE ONLY "public"."character_translations"
    ADD CONSTRAINT "character_translations_pkey" PRIMARY KEY ("character_id", "locale");



ALTER TABLE ONLY "public"."characters"
    ADD CONSTRAINT "characters_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."characters"
    ADD CONSTRAINT "characters_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."daily_characters"
    ADD CONSTRAINT "daily_characters_pkey" PRIMARY KEY ("day_index", "game_mode");



ALTER TABLE ONLY "public"."genders"
    ADD CONSTRAINT "gender_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."genders"
    ADD CONSTRAINT "gender_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."gender_translations"
    ADD CONSTRAINT "gender_translations_pkey" PRIMARY KEY ("gender_id", "locale");



ALTER TABLE ONLY "public"."races"
    ADD CONSTRAINT "race_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."races"
    ADD CONSTRAINT "race_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."race_translations"
    ADD CONSTRAINT "race_translations_pkey" PRIMARY KEY ("race_id", "locale");



ALTER TABLE ONLY "public"."saga_translations"
    ADD CONSTRAINT "saga_translations_pkey" PRIMARY KEY ("saga_id", "locale");



ALTER TABLE ONLY "public"."sagas"
    ADD CONSTRAINT "sagas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sagas"
    ADD CONSTRAINT "sagas_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."sagas"
    ADD CONSTRAINT "sagas_sort_order_key" UNIQUE ("sort_order");



ALTER TABLE ONLY "public"."series_translations"
    ADD CONSTRAINT "serie_translations_pkey" PRIMARY KEY ("serie_id", "locale");



ALTER TABLE ONLY "public"."series"
    ADD CONSTRAINT "series_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."series"
    ADD CONSTRAINT "series_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."wins"
    ADD CONSTRAINT "wins_game_mode_game_date_key" UNIQUE ("game_mode", "game_date");



ALTER TABLE ONLY "public"."wins"
    ADD CONSTRAINT "wins_pkey" PRIMARY KEY ("id");



CREATE INDEX "character_affiliations_character_id_idx" ON "public"."character_affiliations" USING "btree" ("character_id");



CREATE INDEX "character_attributes_character_id_idx" ON "public"."character_attributes" USING "btree" ("character_id");



CREATE INDEX "character_races_character_id_idx" ON "public"."character_races" USING "btree" ("character_id");



CREATE INDEX "character_translations_locale_name_idx" ON "public"."character_translations" USING "btree" ("locale", "name" "varchar_pattern_ops");



CREATE INDEX "character_translations_search_vector_idx" ON "public"."character_translations" USING "gin" ("search_vector");



CREATE INDEX "daily_characters_date_idx" ON "public"."daily_characters" USING "btree" ("date");



ALTER TABLE ONLY "public"."affiliation_translations"
    ADD CONSTRAINT "affiliation_translations_affiliation_id_fkey" FOREIGN KEY ("affiliation_id") REFERENCES "public"."affiliations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."attribute_translations"
    ADD CONSTRAINT "attribute_translations_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."character_affiliations"
    ADD CONSTRAINT "character_affiliations_affiliation_id_fkey" FOREIGN KEY ("affiliation_id") REFERENCES "public"."affiliations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."character_affiliations"
    ADD CONSTRAINT "character_affiliations_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."character_attributes"
    ADD CONSTRAINT "character_attributes_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."character_attributes"
    ADD CONSTRAINT "character_attributes_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."character_races"
    ADD CONSTRAINT "character_races_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."character_races"
    ADD CONSTRAINT "character_races_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."character_translations"
    ADD CONSTRAINT "character_translations_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."characters"
    ADD CONSTRAINT "characters_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "public"."genders"("id");



ALTER TABLE ONLY "public"."characters"
    ADD CONSTRAINT "characters_saga_id_fkey" FOREIGN KEY ("saga_id") REFERENCES "public"."sagas"("id");



ALTER TABLE ONLY "public"."characters"
    ADD CONSTRAINT "characters_serie_id_fkey" FOREIGN KEY ("serie_id") REFERENCES "public"."series"("id");



ALTER TABLE ONLY "public"."daily_characters"
    ADD CONSTRAINT "daily_characters_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."gender_translations"
    ADD CONSTRAINT "gender_translations_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "public"."genders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."race_translations"
    ADD CONSTRAINT "race_translations_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."saga_translations"
    ADD CONSTRAINT "saga_translations_saga_id_fkey" FOREIGN KEY ("saga_id") REFERENCES "public"."sagas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."series_translations"
    ADD CONSTRAINT "serie_translations_serie_id_fkey" FOREIGN KEY ("serie_id") REFERENCES "public"."series"("id") ON DELETE CASCADE;



ALTER TABLE "public"."affiliation_translations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."affiliations" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "allow public read" ON "public"."affiliation_translations" FOR SELECT TO "anon" USING (true);



CREATE POLICY "allow public read" ON "public"."affiliations" FOR SELECT TO "anon" USING (true);



CREATE POLICY "allow public read" ON "public"."attribute_translations" FOR SELECT TO "anon" USING (true);



CREATE POLICY "allow public read" ON "public"."attributes" FOR SELECT TO "anon" USING (true);



CREATE POLICY "allow public read" ON "public"."character_affiliations" FOR SELECT TO "anon" USING (true);



CREATE POLICY "allow public read" ON "public"."character_attributes" FOR SELECT TO "anon" USING (true);



CREATE POLICY "allow public read" ON "public"."character_races" FOR SELECT TO "anon" USING (true);



CREATE POLICY "allow public read" ON "public"."character_translations" FOR SELECT TO "anon" USING (true);



CREATE POLICY "allow public read" ON "public"."characters" FOR SELECT TO "anon" USING (true);



CREATE POLICY "allow public read" ON "public"."gender_translations" FOR SELECT TO "anon" USING (true);



CREATE POLICY "allow public read" ON "public"."genders" FOR SELECT TO "anon" USING (true);



CREATE POLICY "allow public read" ON "public"."race_translations" FOR SELECT TO "anon" USING (true);



CREATE POLICY "allow public read" ON "public"."races" FOR SELECT TO "anon" USING (true);



CREATE POLICY "allow public read" ON "public"."saga_translations" FOR SELECT TO "anon" USING (true);



CREATE POLICY "allow public read" ON "public"."sagas" FOR SELECT TO "anon" USING (true);



CREATE POLICY "allow public read" ON "public"."series" FOR SELECT TO "anon" USING (true);



CREATE POLICY "allow public read" ON "public"."series_translations" FOR SELECT TO "anon" USING (true);



CREATE POLICY "allow public read" ON "public"."wins" FOR SELECT TO "anon" USING (true);



ALTER TABLE "public"."attribute_translations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."attributes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."character_affiliations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."character_attributes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."character_races" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."character_translations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."characters" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."daily_characters" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."gender_translations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."genders" ENABLE ROW LEVEL SECURITY;





CREATE POLICY "public read" ON "public"."daily_characters" FOR SELECT USING (true);



ALTER TABLE "public"."race_translations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."races" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."saga_translations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sagas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."series" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."series_translations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."wins" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."wins";









GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


















































































































































































































GRANT ALL ON FUNCTION "public"."get_all_characters_with_translations"("p_locale" "text", "p_limit" integer, "p_offset" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_characters_with_translations"("p_locale" "text", "p_limit" integer, "p_offset" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_characters_with_translations"("p_locale" "text", "p_limit" integer, "p_offset" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_character_with_translations"("p_slug" "text", "p_locale" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_character_with_translations"("p_slug" "text", "p_locale" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_character_with_translations"("p_slug" "text", "p_locale" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_wins"("p_date" "date", "p_game_mode" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_wins"("p_date" "date", "p_game_mode" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_wins"("p_date" "date", "p_game_mode" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."search_characters"("query" "text", "loc" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."search_characters"("query" "text", "loc" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_characters"("query" "text", "loc" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "service_role";






























GRANT ALL ON TABLE "public"."affiliation_translations" TO "anon";
GRANT ALL ON TABLE "public"."affiliation_translations" TO "authenticated";
GRANT ALL ON TABLE "public"."affiliation_translations" TO "service_role";



GRANT ALL ON TABLE "public"."affiliations" TO "anon";
GRANT ALL ON TABLE "public"."affiliations" TO "authenticated";
GRANT ALL ON TABLE "public"."affiliations" TO "service_role";



GRANT ALL ON TABLE "public"."attribute_translations" TO "anon";
GRANT ALL ON TABLE "public"."attribute_translations" TO "authenticated";
GRANT ALL ON TABLE "public"."attribute_translations" TO "service_role";



GRANT ALL ON TABLE "public"."attributes" TO "anon";
GRANT ALL ON TABLE "public"."attributes" TO "authenticated";
GRANT ALL ON TABLE "public"."attributes" TO "service_role";



GRANT ALL ON TABLE "public"."character_affiliations" TO "anon";
GRANT ALL ON TABLE "public"."character_affiliations" TO "authenticated";
GRANT ALL ON TABLE "public"."character_affiliations" TO "service_role";



GRANT ALL ON TABLE "public"."character_attributes" TO "anon";
GRANT ALL ON TABLE "public"."character_attributes" TO "authenticated";
GRANT ALL ON TABLE "public"."character_attributes" TO "service_role";



GRANT ALL ON TABLE "public"."character_races" TO "anon";
GRANT ALL ON TABLE "public"."character_races" TO "authenticated";
GRANT ALL ON TABLE "public"."character_races" TO "service_role";



GRANT ALL ON TABLE "public"."character_translations" TO "anon";
GRANT ALL ON TABLE "public"."character_translations" TO "authenticated";
GRANT ALL ON TABLE "public"."character_translations" TO "service_role";



GRANT ALL ON TABLE "public"."characters" TO "anon";
GRANT ALL ON TABLE "public"."characters" TO "authenticated";
GRANT ALL ON TABLE "public"."characters" TO "service_role";



GRANT ALL ON TABLE "public"."daily_characters" TO "anon";
GRANT ALL ON TABLE "public"."daily_characters" TO "authenticated";
GRANT ALL ON TABLE "public"."daily_characters" TO "service_role";



GRANT ALL ON TABLE "public"."gender_translations" TO "anon";
GRANT ALL ON TABLE "public"."gender_translations" TO "authenticated";
GRANT ALL ON TABLE "public"."gender_translations" TO "service_role";



GRANT ALL ON TABLE "public"."genders" TO "anon";
GRANT ALL ON TABLE "public"."genders" TO "authenticated";
GRANT ALL ON TABLE "public"."genders" TO "service_role";



GRANT ALL ON TABLE "public"."race_translations" TO "anon";
GRANT ALL ON TABLE "public"."race_translations" TO "authenticated";
GRANT ALL ON TABLE "public"."race_translations" TO "service_role";



GRANT ALL ON TABLE "public"."races" TO "anon";
GRANT ALL ON TABLE "public"."races" TO "authenticated";
GRANT ALL ON TABLE "public"."races" TO "service_role";



GRANT ALL ON TABLE "public"."saga_translations" TO "anon";
GRANT ALL ON TABLE "public"."saga_translations" TO "authenticated";
GRANT ALL ON TABLE "public"."saga_translations" TO "service_role";



GRANT ALL ON TABLE "public"."sagas" TO "anon";
GRANT ALL ON TABLE "public"."sagas" TO "authenticated";
GRANT ALL ON TABLE "public"."sagas" TO "service_role";



GRANT ALL ON TABLE "public"."series" TO "anon";
GRANT ALL ON TABLE "public"."series" TO "authenticated";
GRANT ALL ON TABLE "public"."series" TO "service_role";



GRANT ALL ON TABLE "public"."series_translations" TO "anon";
GRANT ALL ON TABLE "public"."series_translations" TO "authenticated";
GRANT ALL ON TABLE "public"."series_translations" TO "service_role";



GRANT ALL ON TABLE "public"."wins" TO "anon";
GRANT ALL ON TABLE "public"."wins" TO "authenticated";
GRANT ALL ON TABLE "public"."wins" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































