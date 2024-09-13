/*
  Warnings:

  - The primary key for the `favorite_lists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `favorite_lists` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `A` on the `_HomesInFavoriteLists` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "_HomesInFavoriteLists" DROP CONSTRAINT "_HomesInFavoriteLists_A_fkey";

-- AlterTable
ALTER TABLE "_HomesInFavoriteLists" DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "favorite_lists" DROP CONSTRAINT "favorite_lists_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "favorite_lists_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "_HomesInFavoriteLists_AB_unique" ON "_HomesInFavoriteLists"("A", "B");

-- AddForeignKey
ALTER TABLE "_HomesInFavoriteLists" ADD CONSTRAINT "_HomesInFavoriteLists_A_fkey" FOREIGN KEY ("A") REFERENCES "favorite_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
