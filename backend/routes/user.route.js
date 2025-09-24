import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getProfile, updateUser } from "../controllers/user.controller.js";

const router = Router();
router.get("/profile/:username", isAuthenticated, getProfile);
router.patch("/update", isAuthenticated, updateUser);

export default router;
