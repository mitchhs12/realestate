/*
  Warnings:

  - You are about to drop the column `subscription` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "subscription",
ADD COLUMN     "buyerSubscription" TEXT DEFAULT 'free',
ADD COLUMN     "sellerSubscription" TEXT;
