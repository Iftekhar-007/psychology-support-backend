import { Router } from "express";
import { userController } from "./user.controller";
import authMiddle, { UserRole } from "../../middlewares/auth";

const router = Router();

router.get(
  "/me",
  authMiddle(UserRole.patient, UserRole.psychologist, UserRole.admin),
  userController.getMyProfile,
);

router.patch(
  "/me",
  authMiddle(UserRole.patient, UserRole.psychologist, UserRole.admin),
  userController.updateMyProfile,
);

export const userRoutes = router;
