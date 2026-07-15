// backend/src/modules/admin/admin.controller.ts
import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { adminService } from "./admin.service";

export const getPendingUsers = async (req: Request, res: Response) => {
  try {
    const pendingUsers = await prisma.user.findMany({
      where: { isVerified: false, isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json({ success: true, data: pendingUsers });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending users",
      error,
    });
  }
};

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getAllUser();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch users", error });
  }
};

export const adminController = {
  getPendingUsers,
  getAllUser,
};
