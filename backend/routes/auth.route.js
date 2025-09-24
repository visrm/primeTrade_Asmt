import { Router } from "express";
import {
  getMe,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = Router();
router.get("/me", isAuthenticated, getMe);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

export default router;
