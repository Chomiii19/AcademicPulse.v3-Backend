/*
  Warnings:

  - You are about to drop the `School` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SchoolLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "School" DROP CONSTRAINT "School_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "SchoolLog" DROP CONSTRAINT "SchoolLog_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "SchoolLog" DROP CONSTRAINT "SchoolLog_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_schoolId_fkey";

-- DropTable
DROP TABLE "School";

-- DropTable
DROP TABLE "SchoolLog";

-- DropTable
DROP TABLE "Student";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "schoolId" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "middlename" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schools" (
    "id" SERIAL NOT NULL,
    "schoolId" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "studentId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "middlename" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "yearLevel" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("studentId")
);

-- CreateTable
CREATE TABLE "schoollogs" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "Type" NOT NULL,

    CONSTRAINT "schoollogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "schools_schoolId_key" ON "schools"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "schools_ownerId_key" ON "schools"("ownerId");

-- CreateIndex
CREATE INDEX "schools_schoolId_idx" ON "schools"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE INDEX "students_schoolId_idx" ON "students"("schoolId");

-- CreateIndex
CREATE INDEX "schoollogs_studentId_idx" ON "schoollogs"("studentId");

-- CreateIndex
CREATE INDEX "schoollogs_schoolId_idx" ON "schoollogs"("schoolId");

-- CreateIndex
CREATE INDEX "schoollogs_schoolId_timestamp_idx" ON "schoollogs"("schoolId", "timestamp");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("schoolId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "schools_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("schoolId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schoollogs" ADD CONSTRAINT "schoollogs_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schoollogs" ADD CONSTRAINT "schoollogs_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("schoolId") ON DELETE RESTRICT ON UPDATE CASCADE;
