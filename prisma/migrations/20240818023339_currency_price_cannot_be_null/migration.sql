/*
  Warnings:

  - Made the column `usdPrice` on table `currencies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "currencies" ALTER COLUMN "usdPrice" SET NOT NULL;
