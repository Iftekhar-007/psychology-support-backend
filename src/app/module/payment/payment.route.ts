import { Router } from "express";
import { paymentController } from "./payment.controller";
import authMiddle, { UserRole } from "../../middlewares/auth";

const router = Router();

router.post(
  "/initiate/:appointmentId",
  authMiddle(UserRole.patient),
  paymentController.initiatePayment,
);

router.get(
  "/my-payments",
  authMiddle(UserRole.patient, UserRole.psychologist, UserRole.admin),
  paymentController.getMyPayments,
);

export const paymentRoutes = router;
