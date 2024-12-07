-- DropForeignKey
ALTER TABLE "schoollogs" DROP CONSTRAINT "schoollogs_studentId_fkey";

-- AddForeignKey
ALTER TABLE "schoollogs" ADD CONSTRAINT "schoollogs_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("studentId") ON DELETE CASCADE ON UPDATE CASCADE;
