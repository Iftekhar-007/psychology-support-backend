-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('USER', 'ADMIN', 'PATIENT', 'PSYCHOLOGIST');

-- CreateEnum
CREATE TYPE "PsychologistStatus" AS ENUM ('FEATURED', 'REGULAR', 'DELETED');

-- CreateTable
CREATE TABLE "psychologists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "password" TEXT NOT NULL,
    "address" TEXT,
    "contactNumber" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "sector" TEXT,
    "qualification" TEXT NOT NULL,
    "licenseId" TEXT NOT NULL,
    "experience" INTEGER NOT NULL,
    "role" "UserRoles" NOT NULL DEFAULT 'PSYCHOLOGIST',
    "status" "PsychologistStatus" NOT NULL DEFAULT 'REGULAR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "psychologists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "psychologists_email_key" ON "psychologists"("email");

-- CreateIndex
CREATE UNIQUE INDEX "psychologists_contactNumber_key" ON "psychologists"("contactNumber");

-- CreateIndex
CREATE UNIQUE INDEX "psychologists_licenseId_key" ON "psychologists"("licenseId");

-- CreateIndex
CREATE INDEX "psychologists_email_contactNumber_licenseId_idx" ON "psychologists"("email", "contactNumber", "licenseId");
