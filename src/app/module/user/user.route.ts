import { Router } from "express";
import { userController } from "./user.controller.js";
import authMiddle, { UserRole } from "../../middlewares/auth.js";

const router = Router();

router.get(
  "/me",
  authMiddle(UserRole.patient, UserRole.psychologist, UserRole.admin),
  userController.getMyProfile,
);

router.get(
  "/me/status",
  authMiddle(UserRole.patient, UserRole.psychologist, UserRole.admin),
  userController.getMyStatus,
);

router.patch(
  "/me",
  authMiddle(UserRole.patient, UserRole.psychologist, UserRole.admin),
  userController.updateMyProfile,
);

export const userRoutes = router;
