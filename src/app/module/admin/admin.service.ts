import { prisma } from "../../../lib/prisma.js";

const getAllUser = async () => {
  const result = await prisma.user.findMany({
    include: {
      patient: true,
      psychologist: true,
    },
  });
  return result;
};

export const adminService = { getAllUser };
