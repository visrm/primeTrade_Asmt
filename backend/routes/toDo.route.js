import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createToDo,
  deleteToDo,
  getToDos,
  getUserToDos,
  updateToDo,
  updateToDoStatus,
} from "../controllers/toDo.controller.js";

const router = Router();

router.post("/create", isAuthenticated, createToDo);
router.patch("/edit/:id", isAuthenticated, updateToDo);
router.patch("/status/:id", isAuthenticated, updateToDoStatus);
router.get("/my", isAuthenticated, getUserToDos);
router.get("/all", isAuthenticated, getToDos);
router.delete("/delete/:id", isAuthenticated, deleteToDo);

export default router;
