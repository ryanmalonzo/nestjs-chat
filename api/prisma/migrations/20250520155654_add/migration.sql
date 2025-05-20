-- CreateTable
CREATE TABLE "Document" (
    "identifier" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" TEXT NOT NULL,
    "userIdentifier" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("identifier")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userIdentifier_fkey" FOREIGN KEY ("userIdentifier") REFERENCES "User"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;
