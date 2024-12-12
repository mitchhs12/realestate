/*
  Warnings:

  - You are about to drop the column `isBuyerMode` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "isBuyerMode",
ADD COLUMN     "isSellerMode" BOOLEAN;
