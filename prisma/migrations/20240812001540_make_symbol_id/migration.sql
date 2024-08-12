/*
  Warnings:

  - The primary key for the `currencies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `currencies` table. All the data in the column will be lost.
  - Made the column `symbol` on table `currencies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "currencies" DROP CONSTRAINT "currencies_pkey",
DROP COLUMN "id",
ALTER COLUMN "symbol" SET NOT NULL,
ADD CONSTRAINT "currencies_pkey" PRIMARY KEY ("symbol");
