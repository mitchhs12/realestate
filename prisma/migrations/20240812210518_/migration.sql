/*
  Warnings:

  - You are about to drop the column `defaultCurrency` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "defaultCurrency",
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD';
