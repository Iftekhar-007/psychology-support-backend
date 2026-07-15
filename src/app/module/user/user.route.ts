import { Router } from "express";
import { userController } from "./user.controller";
import authMiddle, { UserRole } from "../../middlewares/auth";
// import auth from "../../middlewares/auth";
// import userController from "./user.controller";

const router = Router();

router.get(
  "/me/status",
  authMiddle(
    UserRole.user,
    UserRole.admin,
    UserRole.psychologist,
    UserRole.patient,
  ),
  userController.getMyStatus,
);

export const userRoutes = router;
