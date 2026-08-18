import { Router } from "express";
import { patientController } from "./patient.controller.js";
import authMiddle, { UserRole } from "../../middlewares/auth.js";

const router = Router();

router.post(
  "/create-patientprofile",
  authMiddle(UserRole.patient),
  patientController.createPatient,
);

router.get(
  "/all-patient",
  authMiddle(UserRole.admin),
  patientController.getAllPatient,
);

router.get(
  "/:patientId",
  authMiddle(UserRole.admin),
  patientController.getSinglePatientById,
);

export const patientRoutes = router;
