import { Router } from "express";
import { patientRoutes } from "../module/patient/patient.routes";

const router = Router();

router.use("/patient", patientRoutes);

export const indexRoutes = router;
