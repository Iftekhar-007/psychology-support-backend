import { Router } from "express";
import authMiddle, { UserRole } from "../../middlewares/auth";
import { psychologistController } from "./psychologist.controller";

const router = Router();

router.post(
  "/create-psychologistprofile",
  authMiddle(UserRole.psychologist),
  psychologistController.createPsychologist,
);

export const PsychologistRoutes = router;
