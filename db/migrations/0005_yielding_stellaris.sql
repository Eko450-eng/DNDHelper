ALTER TABLE "character" ALTER COLUMN "stat" SET DATA TYPE integer;
DO $$ BEGIN
 ALTER TABLE "character" ADD CONSTRAINT "character_stat_stat_id_fk" FOREIGN KEY ("stat") REFERENCES "stat"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
