/*
  Warnings:

  - You are about to drop the column `city` on the `homes` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `homes` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `homes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "homes" DROP COLUMN "city",
DROP COLUMN "district",
DROP COLUMN "state",
ADD COLUMN     "municipality" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "subRegion" TEXT;
