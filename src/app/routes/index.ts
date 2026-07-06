import { Router } from "express";
import { patientRoutes } from "../module/patient/patient.routes";
import { PsychologistRoutes } from "../module/psychologist/psychologist.route";
import { appointmentRoutes } from "../module/appointment/appointment.route";

const router = Router();

router.use("/patient", patientRoutes);

router.use("/psychologist", PsychologistRoutes);

router.use("/appointment", appointmentRoutes);

router.use("/prescription,");

export const indexRoutes = router;
