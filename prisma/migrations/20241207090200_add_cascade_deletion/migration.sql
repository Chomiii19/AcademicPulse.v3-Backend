/*
  Warnings:

  - A unique constraint covering the columns `[studentId]` on the table `students` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "schoollogs" DROP CONSTRAINT "schoollogs_studentId_fkey";

-- AlterTable
ALTER TABLE "schools" ALTER COLUMN "schoolId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "id" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "students_studentId_key" ON "students"("studentId");

-- AddForeignKey
ALTER TABLE "schoollogs" ADD CONSTRAINT "schoollogs_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;
