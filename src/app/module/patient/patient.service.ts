import { UserRoles } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { CreatePatient } from "./patient.types";

const createPatient = async (patientData: CreatePatient, userId: string) => {
  const isUserAlreadyPatient = await prisma.patient.findUnique({
    where: {
      userId: userId,
    },
  });

  if (isUserAlreadyPatient) {
    throw new Error("User is already registered as a patient.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (user?.role !== UserRoles.PATIENT) {
    throw new Error("User role is not patient.");
  }

  const result = await prisma.patient.create({
    data: {
      userId: patientData.userId,
      name: patientData.name,
      email: patientData.email,
      contactNumber: patientData.contactNumber,
      address: patientData.address,
      profilePhoto: patientData.profilePhoto,
    },
  });

  return result;
};

export const patientServices = {
  createPatient,
};
