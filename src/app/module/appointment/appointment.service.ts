import {
  AppointmentStatus,
  PaymentStatus,
} from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";
import { createAppointment } from "./appointment.type";

const createAppointment = async (
  appointmentData: createAppointment,
  userId: string,
) => {
  const isUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!isUser) {
    throw new Error("only user can create an appointment");
  }

  const isUserPatient = await prisma.patient.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!isUserPatient || isUser.role !== UserRole.patient) {
    throw new Error("Only patient create an appointment");
  }

  const data = await prisma.appointment.create({
    data: {
      date: appointmentData.date,
      recordHistory: appointmentData.recordHistory,
      patientIssue: appointmentData.patientIssue,
      meetLink: appointmentData.meetLink,
      psychologistid: appointmentData.psychologistid,
      duration: appointmentData.duration,
      patientId: appointmentData.patientId,
      paymentStatus: PaymentStatus.PENDING,
      appointmentStatus: AppointmentStatus.PENDING,
    },
  });

  return data;
};

export const appointmentServices = { createAppointment };
