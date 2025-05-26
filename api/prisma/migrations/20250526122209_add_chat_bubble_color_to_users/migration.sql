-- CreateEnum
CREATE TYPE "ChatBubbleColor" AS ENUM ('blue', 'indigo', 'pink', 'red', 'orange', 'amber', 'emerald');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "chatBubbleColor" "ChatBubbleColor" NOT NULL DEFAULT 'red';
