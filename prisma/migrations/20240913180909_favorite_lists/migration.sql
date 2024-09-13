/*
  Warnings:

  - You are about to drop the `userFavorites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "userFavorites" DROP CONSTRAINT "userFavorites_homeId_fkey";

-- DropForeignKey
ALTER TABLE "userFavorites" DROP CONSTRAINT "userFavorites_userId_fkey";

-- DropTable
DROP TABLE "userFavorites";

-- CreateTable
CREATE TABLE "favorite_lists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "favorite_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HomesInFavoriteLists" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HomesInFavoriteLists_AB_unique" ON "_HomesInFavoriteLists"("A", "B");

-- CreateIndex
CREATE INDEX "_HomesInFavoriteLists_B_index" ON "_HomesInFavoriteLists"("B");

-- AddForeignKey
ALTER TABLE "favorite_lists" ADD CONSTRAINT "favorite_lists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HomesInFavoriteLists" ADD CONSTRAINT "_HomesInFavoriteLists_A_fkey" FOREIGN KEY ("A") REFERENCES "favorite_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HomesInFavoriteLists" ADD CONSTRAINT "_HomesInFavoriteLists_B_fkey" FOREIGN KEY ("B") REFERENCES "homes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
