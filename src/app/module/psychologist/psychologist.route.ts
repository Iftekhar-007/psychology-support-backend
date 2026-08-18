import { Router } from "express";
import authMiddle, { UserRole } from "../../middlewares/auth.js";
import { psychologistController } from "./psychologist.controller.js";

const router = Router();

router.post(
  "/create-psychologistprofile",
  authMiddle(UserRole.psychologist),
  psychologistController.createPsychologist,
);

router.get("/all-psychologists", psychologistController.getAllPsychogist);

router.get(
  "/:psychologistId",
  psychologistController.getSinglePsychologistById,
);

export const PsychologistRoutes = router;
