// backend/src/modules/admin/admin.controller.ts
import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

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
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch pending users" });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    res
      .status(200)
      .json({ success: true, data: user, message: "User verified" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to verify user" });
  }
};

export const rejectUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Soft-delete rather than hard delete, matching your existing isDeleted pattern
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    res
      .status(200)
      .json({ success: true, data: user, message: "User rejected" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to reject user" });
  }
};
