import { Router } from "express";
import { patientRoutes } from "../module/patient/patient.routes";
import { PsychologistRoutes } from "../module/psychologist/psychologist.route";
import { appointmentRoutes } from "../module/appointment/appointment.route";
import { prescriptionRoutes } from "../module/prescription/prescription.route";
import { paymentRoutes } from "../module/payment/payment.route";

const router = Router();

router.use("/patient", patientRoutes);

router.use("/psychologist", PsychologistRoutes);

router.use("/appointment", appointmentRoutes);

router.use("/prescription", prescriptionRoutes);

router.use("/payment", paymentRoutes);

export const indexRoutes = router;
