CREATE TABLE IF NOT EXISTS "abillitie" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar
);

CREATE TABLE IF NOT EXISTS "attack" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"atk" varchar,
	"range" integer,
	"type" varchar
);

CREATE TABLE IF NOT EXISTS "character" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"lvl" integer,
	"race" text,
	"alignment" text,
	"background" text,
	"class" text,
	"hp" integer,
	"ac" integer,
	"init" integer,
	"playerid" text,
	"attacks" integer,
	"equipment" integer,
	"coins" integer,
	"abillitie" integer,
	"language" integer,
	"stat" integer,
	"detstat" integer,
	"spellbook" integer
);

CREATE TABLE IF NOT EXISTS "class" (
	"id" serial PRIMARY KEY NOT NULL,
	"index" text,
	"name" text,
	"url" text
);

CREATE TABLE IF NOT EXISTS "coins" (
	"id" serial PRIMARY KEY NOT NULL,
	"pp" integer,
	"gp" integer,
	"ep" integer,
	"sp" integer,
	"cp" integer
);

CREATE TABLE IF NOT EXISTS "detstat" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"value" integer,
	"proficiency" boolean,
	"relation" text
);

CREATE TABLE IF NOT EXISTS "equipment" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"amount" integer
);

CREATE TABLE IF NOT EXISTS "language" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar
);

CREATE TABLE IF NOT EXISTS "spell" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"casting_time" text,
	"index" text,
	"range" text,
	"duration" text,
	"components" text,
	"desc" text,
	"tier" integer,
	"classes" integer[]
);

CREATE TABLE IF NOT EXISTS "spellbook" (
	"id" serial PRIMARY KEY NOT NULL,
	"tier" integer,
	"slots" integer
);

CREATE TABLE IF NOT EXISTS "stat" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"value" integer,
	"savingvalue" integer,
	"modifier" integer,
	"shorthand" text
);

DO $$ BEGIN
 ALTER TABLE "character" ADD CONSTRAINT "character_attacks_attack_id_fk" FOREIGN KEY ("attacks") REFERENCES "attack"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "character" ADD CONSTRAINT "character_equipment_equipment_id_fk" FOREIGN KEY ("equipment") REFERENCES "equipment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "character" ADD CONSTRAINT "character_coins_coins_id_fk" FOREIGN KEY ("coins") REFERENCES "coins"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "character" ADD CONSTRAINT "character_abillitie_abillitie_id_fk" FOREIGN KEY ("abillitie") REFERENCES "abillitie"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "character" ADD CONSTRAINT "character_language_language_id_fk" FOREIGN KEY ("language") REFERENCES "language"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "character" ADD CONSTRAINT "character_stat_stat_id_fk" FOREIGN KEY ("stat") REFERENCES "stat"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "character" ADD CONSTRAINT "character_detstat_detstat_id_fk" FOREIGN KEY ("detstat") REFERENCES "detstat"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "character" ADD CONSTRAINT "character_spellbook_spellbook_id_fk" FOREIGN KEY ("spellbook") REFERENCES "spellbook"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "spell" ADD CONSTRAINT "spell_tier_spellbook_id_fk" FOREIGN KEY ("tier") REFERENCES "spellbook"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
