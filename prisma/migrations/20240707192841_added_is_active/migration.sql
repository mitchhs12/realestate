/*
  Warnings:

  - Added the required column `listingFlowStep` to the `homes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "homes" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "listingFlowStep" INTEGER NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "bedrooms" DROP NOT NULL,
ALTER COLUMN "bathrooms" DROP NOT NULL,
ALTER COLUMN "capacity" DROP NOT NULL,
ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "areaSqm" DROP NOT NULL;
