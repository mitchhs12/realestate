-- DropForeignKey
ALTER TABLE "userFavorites" DROP CONSTRAINT "userFavorites_userId_fkey";

-- AddForeignKey
ALTER TABLE "userFavorites" ADD CONSTRAINT "userFavorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
