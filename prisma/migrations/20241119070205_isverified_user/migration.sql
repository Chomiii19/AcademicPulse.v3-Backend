/*
  Warnings:

  - You are about to drop the column `isValid` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "isValid",
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
