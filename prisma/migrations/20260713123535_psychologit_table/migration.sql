/*
  Warnings:

  - You are about to drop the column `isVerified` on the `psychologists` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "psychologists" DROP COLUMN "isVerified",
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
