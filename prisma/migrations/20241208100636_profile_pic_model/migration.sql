-- CreateTable
CREATE TABLE "ProfilePictures" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfilePictures_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfilePictures" ADD CONSTRAINT "ProfilePictures_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
