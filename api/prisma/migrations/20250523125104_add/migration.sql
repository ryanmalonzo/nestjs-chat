/*
  Warnings:

  - You are about to drop the column `channel` on the `Message` table. All the data in the column will be lost.
  - Added the required column `channelIdentifier` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "channel",
ADD COLUMN     "channelIdentifier" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Channel" (
    "identifier" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("identifier")
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelIdentifier_fkey" FOREIGN KEY ("channelIdentifier") REFERENCES "Channel"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;
