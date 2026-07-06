import { Request, Response } from "express";
import { appointmentServices } from "./appointment.service";
import { UserRole } from "../../middlewares/auth";

// const createAppointment = async (req: Request, res: Response) => {
//   try {
//     const user = req.user;

//     const data = await appointmentServices.createAppointment(
//       req.body,
//       user?.id as string,
//     );

//     res.status(200).json({ success: true, data: data });
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const createAppointment = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const data = await appointmentServices.createAppointment(req.body, user.id);

    res.status(200).json({ success: true, data: data });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyAppointments = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id || !user?.role) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const data = await appointmentServices.getMyAppointments(
      user.id,
      user.role as UserRole,
    );

    res.status(200).json({ success: true, data });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// const updateAppointmentStatus = async (req: Request, res: Response) => {
//   try {
//     const user = req.user;

//     if (!user?.id) {
//       res.status(401).json({ success: false, message: "Unauthorized" });
//       return;
//     }

//     const { id } = req.params;
//     const { appointmentStatus } = req.body;

//     const data = await appointmentServices.updateAppointmentStatus(
//       id,
//       appointmentStatus,
//       user.id,
//     );

//     res.status(200).json({ success: true, data });
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const updateAppointmentStatus = async (req: Request, res: Response) => {
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
        .json({ success: false, message: "Invalid appointment id" });
      return;
    }

    const { appointmentStatus } = req.body;

    const data = await appointmentServices.updateAppointmentStatus(
      id,
      appointmentStatus,
      user.id,
    );

    res.status(200).json({ success: true, data });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const appointmentController = {
  createAppointment,
  getMyAppointments,
  updateAppointmentStatus,
};

// export const appointmentController = {
//   createAppointment,
//   getMyAppointments,
// };

// export const appointmentController = {
//   createAppointment,
// };
