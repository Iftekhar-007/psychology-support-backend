import { UserRoles } from "../../../generated/prisma/enums.js";
import { prisma } from "../../../lib/prisma.js";
import { UpdateUserProfile } from "./user.type.js";
// import { UpdateUserProfile } from "./user.types.js";

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.role === UserRoles.PATIENT) {
    const patient = await prisma.patient.findUnique({
      where: { userId },
    });
    return { ...user, profile: patient };
  }

  if (user.role === UserRoles.PSYCHOLOGIST) {
    const psychologist = await prisma.psychologist.findUnique({
      where: { userId },
    });
    return { ...user, profile: psychologist };
  }

  return { ...user, profile: null };
};

const updateMyProfile = async (userId: string, payload: UpdateUserProfile) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const data = {
    name: payload.name,
    profilePhoto: payload.profilePhoto,
    address: payload.address,
    contactNumber: payload.contactNumber,
  };

  if (user.role === UserRoles.PATIENT) {
    const result = await prisma.patient.update({
      where: { userId },
      data,
    });
    return result;
  }

  if (user.role === UserRoles.PSYCHOLOGIST) {
    const result = await prisma.psychologist.update({
      where: { userId },
      data,
    });
    return result;
  }

  throw new Error("Profile update not supported for this role.");
};

export const userServices = {
  getMyProfile,
  updateMyProfile,
};
