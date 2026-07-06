import {
  AppointmentStatus,
  PaymentStatus,
} from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";
import { createAppointment } from "./appointment.type";

// const createAppointment = async (
//   appointmentData: createAppointment,
//   userId: string,
// ) => {
//   const isUser = await prisma.user.findUnique({
//     where: {
//       id: userId,
//     },
//   });

//   if (!isUser) {
//     throw new Error("only user can create an appointment");
//   }

//   const isUserPatient = await prisma.patient.findUnique({
//     where: {
//       userId: userId,
//     },
//   });

//   if (!isUserPatient || isUser.role !== UserRole.patient) {
//     throw new Error("Only patient create an appointment");
//   }

//   const data = await prisma.appointment.create({
//     data: {
//       date: appointmentData.date,
//       recordHistory: appointmentData.recordHistory,
//       patientIssue: appointmentData.patientIssue,
//       meetLink: appointmentData.meetLink,
//       psychologistid: appointmentData.psychologistid,
//       duration: appointmentData.duration,
//       patientId: appointmentData.patientId,
//       paymentStatus: PaymentStatus.PENDING,
//       appointmentStatus: AppointmentStatus.PENDING,
//     },
//   });

//   return data;
// };

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
    throw new Error("Only a registered user can create an appointment");
  }

  if (isUser.role !== UserRole.patient) {
    throw new Error("Only a patient can create an appointment");
  }

  const isUserPatient = await prisma.patient.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!isUserPatient) {
    throw new Error("Patient profile not found for this user");
  }

  const patientId = isUserPatient.id;

  const isPsychologist = await prisma.psychologist.findUnique({
    where: {
      id: appointmentData.psychologistid,
    },
  });

  if (!isPsychologist) {
    throw new Error("Psychologist not found");
  }

  const data = await prisma.appointment.create({
    data: {
      date: appointmentData.date,
      recordHistory: appointmentData.recordHistory,
      patientIssue: appointmentData.patientIssue,
      psychologistid: appointmentData.psychologistid,
      duration: appointmentData.duration,
      patientId: patientId,
      meetLink: null, // will be generated once psychologist accepts
      paymentStatus: PaymentStatus.PENDING,
      appointmentStatus: AppointmentStatus.PENDING,
    },
  });

  return data;
};

const getMyAppointments = async (userId: string, role: UserRole) => {
  if (role === UserRole.admin) {
    return prisma.appointment.findMany({
      include: {
        patient: true,
        psychologist: true,
      },
      orderBy: { date: "desc" },
    });
  }

  if (role === UserRole.patient) {
    const patient = await prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new Error("Patient profile not found for this user");
    }

    return prisma.appointment.findMany({
      where: { patientId: patient.id },
      include: { psychologist: true },
      orderBy: { date: "desc" },
    });
  }

  if (role === UserRole.psychologist) {
    const psychologist = await prisma.psychologist.findUnique({
      where: { userId },
    });

    if (!psychologist) {
      throw new Error("Psychologist profile not found for this user");
    }

    return prisma.appointment.findMany({
      where: { psychologistid: psychologist.id },
      include: { patient: true },
      orderBy: { date: "desc" },
    });
  }

  throw new Error("Invalid role");
};

const updateAppointmentStatus = async (
  appointmentId: string,
  status: AppointmentStatus,
  userId: string,
) => {
  const isUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!isUser) {
    throw new Error("Only a registered user can update an appointment");
  }

  if (isUser.role !== UserRole.psychologist) {
    throw new Error("Only a psychologist can update appointment status");
  }

  const psychologist = await prisma.psychologist.findUnique({
    where: { userId },
  });

  if (!psychologist) {
    throw new Error("Psychologist profile not found for this user");
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  if (appointment.psychologistid !== psychologist.id) {
    throw new Error("You can only update your own appointments");
  }

  if (appointment.appointmentStatus === AppointmentStatus.CANCELLED) {
    throw new Error("Cannot update a cancelled appointment");
  }

  const allowedStatuses: AppointmentStatus[] = [
    AppointmentStatus.CONFIRMED,
    AppointmentStatus.CANCELLED,
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status update");
  }

  const data = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { appointmentStatus: status },
  });

  return data;
};

export const appointmentServices = {
  createAppointment,
  getMyAppointments,
  updateAppointmentStatus,
};

// export const appointmentServices = { createAppointment, getMyAppointments };
