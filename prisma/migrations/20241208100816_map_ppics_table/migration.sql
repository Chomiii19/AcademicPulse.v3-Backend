/*
  Warnings:

  - You are about to drop the `ProfilePictures` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProfilePictures" DROP CONSTRAINT "ProfilePictures_userId_fkey";

-- DropTable
DROP TABLE "ProfilePictures";

-- CreateTable
CREATE TABLE "profilepictures" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profilepictures_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "profilepictures" ADD CONSTRAINT "profilepictures_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
