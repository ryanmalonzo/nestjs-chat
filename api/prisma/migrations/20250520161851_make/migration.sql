/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Document` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Document_key_key" ON "Document"("key");
