-- DropForeignKey
ALTER TABLE "clicks" DROP CONSTRAINT "clicks_url_id_fkey";

-- AddForeignKey
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_url_id_fkey" FOREIGN KEY ("url_id") REFERENCES "urls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
