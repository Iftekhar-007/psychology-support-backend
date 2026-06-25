/*
  Warnings:

  - You are about to drop the column `password` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `psychologists` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[appointmentId]` on the table `prescriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "password";

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "password";

-- AlterTable
ALTER TABLE "prescriptions" ADD COLUMN     "appointmentId" TEXT;

-- AlterTable
ALTER TABLE "psychologists" DROP COLUMN "password";

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "recordHistory" TEXT,
    "patientIssue" TEXT,
    "meetLink" TEXT,
    "psychologistid" TEXT NOT NULL,
    "appointmentStatus" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "duration" INTEGER NOT NULL,
    "patientId" TEXT NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "gateway" TEXT DEFAULT 'Stripe',
    "paymentgatewayData" JSONB,
    "stripeEventId" TEXT,
    "transactionId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appointmentId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "appointments_psychologistid_patientId_id_idx" ON "appointments"("psychologistid", "patientId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripeEventId_key" ON "payments"("stripeEventId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_appointmentId_key" ON "payments"("appointmentId");

-- CreateIndex
CREATE INDEX "payments_appointmentId_id_transactionId_stripeEventId_idx" ON "payments"("appointmentId", "id", "transactionId", "stripeEventId");

-- CreateIndex
CREATE UNIQUE INDEX "prescriptions_appointmentId_key" ON "prescriptions"("appointmentId");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_psychologistid_fkey" FOREIGN KEY ("psychologistid") REFERENCES "psychologists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
