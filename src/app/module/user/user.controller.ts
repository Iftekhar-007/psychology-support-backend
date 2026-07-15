import { Request, Response } from "express";
import { userServices } from "./user.service";

const getMyStatus = async (req: Request, res: Response) => {
  const user = req.user;
  // auth middleware থেকে

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const result = await userServices.getMyStatus(user.id as string);

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const userController = {
  getMyStatus,
};
