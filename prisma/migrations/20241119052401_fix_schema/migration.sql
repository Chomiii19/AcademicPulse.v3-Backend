/*
  Warnings:

  - The `schoolId` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `name` to the `schools` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "schoollogs" DROP CONSTRAINT "schoollogs_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_schoolId_fkey";

-- AlterTable
ALTER TABLE "schools" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "schoolId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "schoolId",
ADD COLUMN     "schoolId" INTEGER;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schoollogs" ADD CONSTRAINT "schoollogs_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("schoolId") ON DELETE CASCADE ON UPDATE CASCADE;
