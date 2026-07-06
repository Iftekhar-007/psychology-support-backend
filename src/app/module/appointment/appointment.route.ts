import { Router } from "express";
import { appointmentController } from "./appointment.controller";
import authMiddle, { UserRole } from "../../middlewares/auth";

const router = Router();

router.post(
  "/create-appointment",
  authMiddle(UserRole.patient),
  appointmentController.createAppointment,
);

router.get(
  "/my-appointments",
  authMiddle(UserRole.patient, UserRole.psychologist, UserRole.admin),
  appointmentController.getMyAppointments,
);

router.patch(
  "/update-appointment-status/:id",
  authMiddle(UserRole.psychologist),
  appointmentController.updateAppointmentStatus,
);

export const appointmentRoutes = router;
