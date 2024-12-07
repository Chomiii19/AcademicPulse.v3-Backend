/*
  Warnings:

  - You are about to drop the column `id` on the `students` table. All the data in the column will be lost.
  - Made the column `schoolId` on table `schools` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "schoollogs" DROP CONSTRAINT "schoollogs_studentId_fkey";

-- DropIndex
DROP INDEX "students_studentId_key";

-- AlterTable
ALTER TABLE "schools" ALTER COLUMN "schoolId" SET NOT NULL;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "id";

-- AddForeignKey
ALTER TABLE "schoollogs" ADD CONSTRAINT "schoollogs_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("studentId") ON DELETE CASCADE ON UPDATE CASCADE;
