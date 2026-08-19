/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { userServices } from "./user.service.js";

const getMyProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const data = await userServices.getMyProfile(user?.id as string);

    res.status(200).json({ success: true, data: data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateMyProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const data = await userServices.updateMyProfile(
      user?.id as string,
      req.body,
    );

    res.status(200).json({ success: true, data: data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyStatus = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const data = await userServices.getMyStatus(user?.id as string);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userController = {
  getMyProfile,
  updateMyProfile,
  getMyStatus,
};
