/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { patientServices } from "./patient.service";

const createPatient = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const data = await patientServices.createPatient(
      req.body,
      user?.id as string,
    );

    res.status(200).json({ success: true, data: data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const patientController = {
  createPatient,
};
