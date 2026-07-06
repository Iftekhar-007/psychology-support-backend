import { Request, Response } from "express";
import { prescriptionServices } from "./prescription.service";
import { UserRole } from "../../middlewares/auth";

const createPrescription = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const data = await prescriptionServices.createPrescriptionEntry(
      req.body,
      user.id,
    );

    res.status(200).json({ success: true, data });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyPrescriptions = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id || !user?.role) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const data = await prescriptionServices.getMyPrescriptions(
      user.id,
      user.role as UserRole,
    );

    res.status(200).json({ success: true, data });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePrescription = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { id } = req.params;

    if (typeof id !== "string") {
      res
        .status(400)
        .json({ success: false, message: "Invalid prescription id" });
      return;
    }

    const data = await prescriptionServices.updatePrescriptionEntry(
      id,
      req.body,
      user.id,
    );

    res.status(200).json({ success: true, data });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const prescriptionController = {
  createPrescription,
  getMyPrescriptions,
  updatePrescription,
};
