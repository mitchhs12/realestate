-- AlterTable
ALTER TABLE "users" ADD COLUMN     "buyerCredits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sellerCredits" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "buyer_credit_transactions" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "homeId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "creditsSpent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "buyer_credit_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "buyer_credit_transactions_userId_homeId_key" ON "buyer_credit_transactions"("userId", "homeId");

-- AddForeignKey
ALTER TABLE "buyer_credit_transactions" ADD CONSTRAINT "buyer_credit_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyer_credit_transactions" ADD CONSTRAINT "buyer_credit_transactions_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "homes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
