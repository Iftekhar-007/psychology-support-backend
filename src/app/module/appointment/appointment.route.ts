import { Router } from "express";
import { appointmentController } from "./appointment.controller";
import authMiddle, { UserRole } from "../../middlewares/auth";

const router = Router();

router.post(
  "/create-appointment",
  authMiddle(UserRole.patient),
  appointmentController.createAppointment,
);

export const appointmentRoutes = router;
