import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";
import { createPrescription, updatePrescription } from "./prescription.type";
import { AppointmentStatus } from "../../../generated/prisma/enums";

const createPrescriptionEntry = async (
  prescriptionData: createPrescription,
  userId: string,
) => {
  const isUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!isUser) {
    throw new Error("Only a registered user can create a prescription");
  }

  if (isUser.role !== UserRole.psychologist) {
    throw new Error("Only a psychologist can create a prescription");
  }

  const psychologist = await prisma.psychologist.findUnique({
    where: { userId },
  });

  if (!psychologist) {
    throw new Error("Psychologist profile not found for this user");
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: prescriptionData.appointmentId },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  if (appointment.psychologistid !== psychologist.id) {
    throw new Error("You can only prescribe for your own appointments");
  }

  // Changed: require CONFIRMED (not COMPLETED) — prescription creation is what marks it COMPLETED
  if (appointment.appointmentStatus !== AppointmentStatus.CONFIRMED) {
    throw new Error(
      "Prescription can only be created for a confirmed appointment",
    );
  }

  if (appointment.date > new Date()) {
    throw new Error(
      "Cannot create a prescription before the appointment's scheduled time",
    );
  }

  const existingPrescription = await prisma.prescription.findUnique({
    where: { appointmentId: prescriptionData.appointmentId },
  });

  if (existingPrescription) {
    throw new Error("A prescription already exists for this appointment");
  }

  const data = await prisma.$transaction(async (tx) => {
    const prescription = await tx.prescription.create({
      data: {
        patientId: appointment.patientId,
        psychologistId: psychologist.id,
        appointmentId: appointment.id,
        medication: prescriptionData.medication,
        exercise: prescriptionData.exercise,
        duration: prescriptionData.duration,
        notes: prescriptionData.notes,
      },
    });

    await tx.appointment.update({
      where: { id: appointment.id },
      data: { appointmentStatus: AppointmentStatus.COMPLETED },
    });

    return prescription;
  });

  return data;
};

const getMyPrescriptions = async (userId: string, role: UserRole) => {
  if (role === UserRole.patient) {
    const patient = await prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new Error("Patient profile not found for this user");
    }

    return prisma.prescription.findMany({
      where: { patientId: patient.id },
      include: { psychologist: true, appointment: true },
      orderBy: { createdAt: "desc" },
    });
  }

  if (role === UserRole.psychologist) {
    const psychologist = await prisma.psychologist.findUnique({
      where: { userId },
    });

    if (!psychologist) {
      throw new Error("Psychologist profile not found for this user");
    }

    return prisma.prescription.findMany({
      where: { psychologistId: psychologist.id },
      include: { patient: true, appointment: true },
      orderBy: { createdAt: "desc" },
    });
  }

  throw new Error("Invalid role");
};

const updatePrescriptionEntry = async (
  prescriptionId: string,
  updateData: updatePrescription,
  userId: string,
) => {
  const isUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!isUser) {
    throw new Error("Only a registered user can update a prescription");
  }

  if (isUser.role !== UserRole.psychologist) {
    throw new Error("Only a psychologist can update a prescription");
  }

  const psychologist = await prisma.psychologist.findUnique({
    where: { userId },
  });

  if (!psychologist) {
    throw new Error("Psychologist profile not found for this user");
  }

  const prescription = await prisma.prescription.findUnique({
    where: { id: prescriptionId },
  });

  if (!prescription) {
    throw new Error("Prescription not found");
  }

  if (prescription.psychologistId !== psychologist.id) {
    throw new Error("You can only update your own prescriptions");
  }

  const data = await prisma.prescription.update({
    where: { id: prescriptionId },
    data: {
      medication: updateData.medication,
      exercise: updateData.exercise,
      duration: updateData.duration,
      notes: updateData.notes,
    },
  });

  return data;
};

export const prescriptionServices = {
  createPrescriptionEntry,
  getMyPrescriptions,
  updatePrescriptionEntry,
};
