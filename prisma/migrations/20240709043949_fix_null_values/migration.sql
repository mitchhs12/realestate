/*
  Warnings:

  - Made the column `bedrooms` on table `homes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bathrooms` on table `homes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `capacity` on table `homes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `kitchens` on table `homes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `livingrooms` on table `homes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "homes" ALTER COLUMN "bedrooms" SET NOT NULL,
ALTER COLUMN "bathrooms" SET NOT NULL,
ALTER COLUMN "capacity" SET NOT NULL,
ALTER COLUMN "kitchens" SET NOT NULL,
ALTER COLUMN "livingrooms" SET NOT NULL;
