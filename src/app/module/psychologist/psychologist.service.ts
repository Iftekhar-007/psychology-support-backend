import { PsychologistStatus, UserRoles } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { CreatePsychologistProfile } from "./psychologist.types";

const createPsychologist = async (
  psychologistData: CreatePsychologistProfile,
  userId: string,
) => {
  const isUserAlreadyPatient = await prisma.psychologist.findUnique({
    where: {
      userId: userId,
    },
  });

  if (isUserAlreadyPatient) {
    throw new Error("User is already registered as a psychologist.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (user?.role !== UserRoles.PSYCHOLOGIST) {
    throw new Error("User role is not psychologist.");
  }

  const result = await prisma.psychologist.create({
    data: {
      userId: userId,
      name: psychologistData.name,
      email: psychologistData.email,
      contactNumber: psychologistData.contactNumber,
      address: psychologistData.address,
      profilePhoto: psychologistData.profilePhoto,
      sector: psychologistData.sector,
      availability: psychologistData.availability,
      appointmentFee: psychologistData.appointmentFee,
      qualification: psychologistData.qualification,
      licenseId: psychologistData.licenseId,
      experience: psychologistData.experience,
      role: UserRoles.PSYCHOLOGIST,
      status: PsychologistStatus.REGULAR,
      verified: false,
    },
  });

  return result;
};

const getAllPsychologist = async () => {
  const allPsychologist = await prisma.psychologist.findMany({
    include: {
      user: true,
    },
  });

  return allPsychologist;
};

const getSinglePsychologistById = async (psychologistId: string) => {
  const psychologist = await prisma.psychologist.findUnique({
    where: {
      id: psychologistId,
    },
    include: {
      user: true,
    },
  });

  return psychologist;
};

export const psychologistServices = {
  createPsychologist,
  getAllPsychologist,
  getSinglePsychologistById,
};
