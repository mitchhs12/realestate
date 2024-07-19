/*
  Warnings:

  - You are about to drop the column `usdPrice` on the `currencies` table. All the data in the column will be lost.
  - Added the required column `usdprice` to the `currencies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "currencies" DROP COLUMN "usdPrice",
ADD COLUMN     "usdprice" DOUBLE PRECISION NOT NULL;
