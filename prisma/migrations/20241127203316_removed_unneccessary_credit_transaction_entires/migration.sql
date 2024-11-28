/*
  Warnings:

  - You are about to drop the column `amount` on the `contact_credit_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `creditsSpent` on the `contact_credit_transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "contact_credit_transactions" DROP COLUMN "amount",
DROP COLUMN "creditsSpent";
