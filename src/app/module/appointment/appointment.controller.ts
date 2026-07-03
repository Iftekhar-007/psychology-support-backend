import { Request, Response } from "express";
import { appointmentServices } from "./appointment.service";

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

export const appointmentController = {
  createAppointment,
};
