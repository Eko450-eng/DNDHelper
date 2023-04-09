ALTER TABLE "character" ALTER COLUMN "stat" SET DATA TYPE integer[];
ALTER TABLE "character" DROP CONSTRAINT "character_stat_stat_id_fk";
