import { Router } from "express";
import { patientRoutes } from "../module/patient/patient.routes.js";
import { PsychologistRoutes } from "../module/psychologist/psychologist.route.js";
import { appointmentRoutes } from "../module/appointment/appointment.route.js";
import { prescriptionRoutes } from "../module/prescription/prescription.route.js";
import { paymentRoutes } from "../module/payment/payment.route.js";
import { userRoutes } from "../module/user/user.route.js";

const router = Router();

// router.use("/user", userRoutes);

router.use("/user", userRoutes);

router.use("/patient", patientRoutes);

router.use("/psychologist", PsychologistRoutes);

router.use("/appointment", appointmentRoutes);

router.use("/prescription", prescriptionRoutes);

router.use("/payment", paymentRoutes);

export const indexRoutes = router;
