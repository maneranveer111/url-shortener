-- CreateTable
CREATE TABLE "clicks" (
    "id" SERIAL NOT NULL,
    "url_id" INTEGER NOT NULL,
    "clicked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_agent" TEXT,

    CONSTRAINT "clicks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_url_id_fkey" FOREIGN KEY ("url_id") REFERENCES "urls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
