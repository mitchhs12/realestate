/*
  Warnings:

  - Made the column `latitude` on table `homes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `homes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `homes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `areaSqm` on table `homes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "homes" ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "longitude" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "areaSqm" SET NOT NULL;
