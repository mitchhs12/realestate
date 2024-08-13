/*
  Warnings:

  - Made the column `currency` on table `homes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "homes" ALTER COLUMN "currency" SET NOT NULL;
