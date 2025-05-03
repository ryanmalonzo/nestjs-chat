-- CreateTable
CREATE TABLE "Message" (
    "identifier" UUID NOT NULL DEFAULT gen_random_uuid(),
    "fromUserIdentifier" UUID NOT NULL,
    "channel" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("identifier")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_fromUserIdentifier_fkey" FOREIGN KEY ("fromUserIdentifier") REFERENCES "User"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;
