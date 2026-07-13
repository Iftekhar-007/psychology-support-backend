import { Request, Response } from "express";
import { userServices } from "./user.service";

const getMyStatus = async (req: Request, res: Response) => {
  const user = req.user;
  const userId = user?.id; // auth middleware থেকে

  const result = await userServices.getMyStatus(userId as string);

  res.status(200).json({
    success: true,
    data: result,
  });
};

const userController = {
  getMyStatus,
};

export default userController;
