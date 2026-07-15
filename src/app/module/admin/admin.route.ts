import { Router } from "express";
import { adminController } from "./admin.controller";
import authMiddle, { UserRole } from "../../middlewares/auth";

const router = Router();

router.get("/pending-users", adminController.getPendingUsers);
router.get(
  "/all-users",
  authMiddle(UserRole.admin),
  adminController.getAllUser,
);

export const adminRoute = router;
