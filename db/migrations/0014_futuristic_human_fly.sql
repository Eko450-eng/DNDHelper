ALTER TABLE "spellbook" ALTER COLUMN "spells" SET DATA TYPE integer[];
ALTER TABLE "spellbook" DROP CONSTRAINT "spellbook_spells_spell_id_fk";
