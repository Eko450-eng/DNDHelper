ALTER TABLE "spell" RENAME COLUMN "tier" TO "level";
ALTER TABLE "spell" ALTER COLUMN "desc" SET DATA TYPE text[];
ALTER TABLE "spell" ALTER COLUMN "classes" SET DATA TYPE text[];
DO $$ BEGIN
 ALTER TABLE "spell" ADD CONSTRAINT "spell_level_spellbook_id_fk" FOREIGN KEY ("level") REFERENCES "spellbook"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "spell" DROP CONSTRAINT "spell_tier_spellbook_id_fk";
