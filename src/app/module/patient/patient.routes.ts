import { Router } from "express";
import { patientController } from "./patient.controller";
import authMiddle, { UserRole } from "../../middlewares/auth";

const router = Router();

router.post(
  "/create-patientprofile",
  authMiddle(UserRole.patient),
  patientController.createPatient,
);

export const patientRoutes = router;
