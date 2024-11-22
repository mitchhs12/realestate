/*
  Warnings:

  - A unique constraint covering the columns `[customerId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "customerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_customerId_key" ON "users"("customerId");
