import { Router } from "express";
import { prescriptionController } from "./prescription.controller.js";
import authMiddle, { UserRole } from "../../middlewares/auth.js";

const router = Router();

router.post(
  "/create-prescription",
  authMiddle(UserRole.psychologist),
  prescriptionController.createPrescription,
);

router.get(
  "/my-prescriptions",
  authMiddle(UserRole.patient, UserRole.psychologist),
  prescriptionController.getMyPrescriptions,
);

router.patch(
  "/update-prescription/:id",
  authMiddle(UserRole.psychologist),
  prescriptionController.updatePrescription,
);

export const prescriptionRoutes = router;
