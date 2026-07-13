// user.service.ts

import { prisma } from "../../lib/prisma";

const getMyStatus = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      patient: true,
      psychologist: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    role: user.role,
    hasPatientProfile: !!user.patient,
    hasPsychologistProfile: !!user.psychologist,
  };
};

export const userServices = {
  getMyStatus,
};
