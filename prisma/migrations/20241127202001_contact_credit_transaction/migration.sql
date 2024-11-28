/*
  Warnings:

  - You are about to drop the column `buyerCredits` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `sellerCredits` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `buyer_credit_transactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "buyer_credit_transactions" DROP CONSTRAINT "buyer_credit_transactions_homeId_fkey";

-- DropForeignKey
ALTER TABLE "buyer_credit_transactions" DROP CONSTRAINT "buyer_credit_transactions_userId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "buyerCredits",
DROP COLUMN "sellerCredits",
ADD COLUMN     "contactCredits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sellCredits" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "buyer_credit_transactions";

-- CreateTable
CREATE TABLE "contact_credit_transactions" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "homeId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "creditsSpent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_credit_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contact_credit_transactions_userId_homeId_key" ON "contact_credit_transactions"("userId", "homeId");

-- AddForeignKey
ALTER TABLE "contact_credit_transactions" ADD CONSTRAINT "contact_credit_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_credit_transactions" ADD CONSTRAINT "contact_credit_transactions_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "homes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
