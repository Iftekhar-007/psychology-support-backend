import { Router } from "express";
import auth from "../../middlewares/auth";
import userController from "./user.controller";

const router = Router();

router.get("/me/status", auth(), userController.getMyStatus);

export const userRoutes = router;
