ALTER TABLE "stat" ADD COLUMN "characterid" integer;
ALTER TABLE "character" DROP CONSTRAINT "character_stat_stat_id_fk";

DO $$ BEGIN
 ALTER TABLE "stat" ADD CONSTRAINT "stat_characterid_character_id_fk" FOREIGN KEY ("characterid") REFERENCES "character"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "character" DROP COLUMN IF EXISTS "stat";