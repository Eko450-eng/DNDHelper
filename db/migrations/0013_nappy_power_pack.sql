ALTER TABLE "spellbook" ADD COLUMN "spells" integer;
DO $$ BEGIN
 ALTER TABLE "spellbook" ADD CONSTRAINT "spellbook_spells_spell_id_fk" FOREIGN KEY ("spells") REFERENCES "spell"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
