-- Baseline: these columns already exist in the database
-- (added earlier via prisma db push, outside migration history)
ALTER TABLE "clicks" ADD COLUMN "ip_address" TEXT;
ALTER TABLE "clicks" ADD COLUMN "city" TEXT;
ALTER TABLE "clicks" ADD COLUMN "country" TEXT;
