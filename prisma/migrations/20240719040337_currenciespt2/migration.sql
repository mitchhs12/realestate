/*
  Warnings:

  - You are about to drop the column `usdprice` on the `currencies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "currencies" DROP COLUMN "usdprice",
ADD COLUMN     "usdPrice" DOUBLE PRECISION,
ALTER COLUMN "symbol" DROP NOT NULL;
