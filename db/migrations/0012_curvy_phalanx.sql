ALTER TABLE "spellbook" DROP CONSTRAINT "spellbook_spells_spell_id_fk";

ALTER TABLE "spellbook" DROP COLUMN IF EXISTS "spells";