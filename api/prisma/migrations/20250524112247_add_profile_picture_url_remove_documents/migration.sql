/*
  Warnings:

  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_userIdentifier_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePictureUrl" TEXT;

-- DropTable
DROP TABLE "Document";
